import { InMemoryCache } from "apollo-cache-inmemory";
import { getMainDefinition } from "apollo-utilities";
import { createHttpLink, HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";
import withApollo from "next-with-apollo";
import ApolloClient from "apollo-client";
import fetch from "isomorphic-unfetch";
import { endpoint, prodEndpoint, wsEndpoint, wsProdEndpoint } from "../config";

// let apolloClient = null;

// const ssrMode = !process.browser;

// if (!process.browser) {
// 	global.fetch = fetch;
// }

// function create(initialState, { getToken }) {
// 	const httpLink = createHttpLink({
// 		uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
// 		credentials: 'include',
// 	});

// 	const authLink = setContext((_, { headers }) => {
// 		const token = getToken();
// 		console.log('token', token);
// 		return {
// 			headers,
// 		};
// 	});

// 	const wsLink =
// 		!ssrMode &&
// 		new WebSocketLink({
// 			uri: process.env.NODE_ENV === 'development' ? wsEndpoint : wsProdEndpoint,
// 			options: {
// 				reconnect: true,
// 				// maybe we can add a header in here to get some sort of auth working
// 				// connectionParams: {d
// 				//   authorization: headers.authorization
// 				// }
// 			},
// 		});
// 	const errorLink = onError(({ graphQLErrors, networkError }) => {
// 		if (graphQLErrors) {
// 			graphQLErrors.map(err => console.log(`[GraphQL error]: Message: ${err.message}`));
// 		}
// 		if (networkError) console.log(`[Network error]: ${networkError}`);
// 	});
// 	let link = ApolloLink.from([ errorLink, authLink, httpLink ]);

// 	if (!ssrMode) {
// 		link = split(
// 			// split based on operation type
// 			({ query }) => {
// 				const definition = getMainDefinition(query);
// 				return (
// 					definition.kind === 'OperationDefinition' &&
// 					definition.operation === 'subscription'
// 				);
// 			},
// 			wsLink,
// 			link,
// 		);
// 	}

// 	return new ApolloClient({
// 		connectToDevTools: process.browser,
// 		ssrMode, // Disables forceFetch on the server (so queries are only run once)
// 		link,
// 		cache: new InMemoryCache().restore(initialState || {}),
// 	});
// }

// export default function initApollo(initialState, options) {
// 	// Make sure to create a new client for every server-side request so that data
// 	// isn't shared between connections (which would be bad)
// 	if (!process.browser) {
// 		return create(initialState, options);
// 	}

// 	// Reuse client on the client-side
// 	if (!apolloClient) {
// 		apolloClient = create(initialState, options);
// 	}

// 	return apolloClient;
// }

export default withApollo(({ headers }) => {
	const ssrMode = !process.browser;

	// const headers =
	// 	context && context.req
	// 		? {
	// 				cookie: context.req.headers.cookie || "",
	// 				...context.req.headers
	// 		  }
	// 		: null;

	const linky = createHttpLink({
		uri: "//testup4.herokuapp.com",
		fetchOptions: {
			credentials: "include"
		},
		headers
	});

	// const middlewaree = new ApolloLink((operation, forward) => {
	// 	operation.setContext({
	// 		uri: "https://testup4.herokuapp.com",
	// 		fetchOptions: {
	// 			credentials: "include"
	// 		},
	// 		headers
	// 	});
	// 	return forward(operation);
	// });

	const wsLink =
		!ssrMode &&
		new WebSocketLink({
			uri: process.env.NODE_ENV === "development" ? wsEndpoint : wsProdEndpoint,
			options: {
				reconnect: true
			}
		});

	// const contextLink = setContext(() => ({
	// 	fetchOptions: {
	// 		credentials: "include"
	// 	},
	// 	headers
	// }));

	// const errorLink = onError(({ graphQLErrors, networkError }) => {
	// 	if (graphQLErrors) {
	// 		graphQLErrors.map(err => console.log(`[GraphQL error]: Message: ${err.message}`));
	// 	}
	// 	if (networkError) console.log(`[Network error]: ${networkError}`);
	// });

	// let link = ApolloLink.from([middlewaree, httpLink]);

	// if (!ssrMode) {
	// 	link = split(
	// 		// split based on operation type
	// 		({ query }) => {
	// 			const definition = getMainDefinition(query);
	// 			return definition.kind === "OperationDefinition" && definition.operation === "subscription";
	// 		},
	// 		wsLink,
	// 		link
	// 	);
	// }

	const cache = new InMemoryCache({
		dataIdFromObject: ({ id, __typename }) => (id && __typename ? __typename + id : null)
	});

	return new ApolloClient({
		link: linky,
		ssrMode,
		cache
	});
});
