import { InMemoryCache } from "apollo-cache-inmemory";
import { getMainDefinition } from "apollo-utilities";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { ApolloLink, split, Observable } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";
import withApollo from "next-with-apollo";
import ApolloClient from "apollo-client";
// import fetch from "isomorphic-unfetch";

import { endpoint, prodEndpoint, wsEndpoint, wsProdEndpoint } from "../config";

// if (!process.browser) {
// 	global.fetch = fetch;
// }

export default withApollo(({ headers }) => {
	const ssrMode = !process.browser;

	const httpLink = createHttpLink({
		uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
		credentials: "include"
	});

	const wsLink =
		!ssrMode &&
		new WebSocketLink({
			uri: process.env.NODE_ENV === "development" ? wsEndpoint : wsProdEndpoint,
			options: {
				reconnect: true
				// maybe we can add a header in here to get some sort of auth working
				// connectionParams: {
				//   authorization: headers.authorization
				// }
			}
		});

	// const contextLink = setContext(async () => ({
	// 	fetchOptions: {
	// 		credentials: "include"
	// 	},
	// 	headers: {
	// 		"x-forwarded-for": headers ? headers["x-forwarded-for"] : null
	// 	}
	// }));

	const request = async operation => {
		operation.setContext({
			fetchOptions: {
				credentials: "include"
			},
			headers
		});
	};

	const requestLink = new ApolloLink(
		(operation, forward) =>
			new Observable(observer => {
				let handle;
				Promise.resolve(operation)
					.then(oper => request(oper))
					.then(() => {
						handle = forward(operation).subscribe({
							next: observer.next.bind(observer),
							error: observer.error.bind(observer),
							complete: observer.complete.bind(observer)
						});
					})
					.catch(observer.error.bind(observer));

				return () => {
					if (handle) handle.unsubscribe();
				};
			})
	);

	const errorLink = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors) {
			graphQLErrors.map(err => console.log(`[GraphQL error]: Message: ${err.message}`));
		}
		if (networkError) console.log(`[Network error]: ${networkError}`);
	});

	let link = ApolloLink.from([errorLink, requestLink, httpLink]);

	if (!ssrMode) {
		link = split(
			// split based on operation type
			({ query }) => {
				const definition = getMainDefinition(query);
				return definition.kind === "OperationDefinition" && definition.operation === "subscription";
			},
			wsLink,
			link
		);
	}

	const cache = new InMemoryCache({
		// dataIdFromObject: ({ id, __typename }) => (id && __typename ? __typename + id : null)
	});

	return new ApolloClient({
		link,
		ssrMode,
		cache
	});
});
