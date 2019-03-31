import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { createHttpLink, HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-client';

import { endpoint, prodEndpoint, wsEndpoint, wsProdEndpoint } from '../config';

export default withApollo(
	({ headers }) => {
		const ssrMode = !process.browser;

		const httpLink = createHttpLink({
			uri:
				process.env.NODE_ENV === 'development'
					? 'http://localhost:4000'
					: 'https://api.up4.life',
		});

		const wsLink =
			!ssrMode &&
			new WebSocketLink({
				uri: process.env.NODE_ENV === 'development' ? wsEndpoint : wsProdEndpoint,
				options: {
					reconnect: true,
					reconnectionAttempts: 50,
					lazy: true,
					timeout: 20000,
				},
			});

		const contextLink = setContext(() => ({
			fetchOptions: {
				credentials: 'include',
			},
			headers: {
				...headers,
				host: process.env.NODE_ENV === 'development' ? 'localhost' : 'api.up4.life',
				cookie: headers && headers.cookie,
			},
		}));

		// const middlewareLink = new ApolloLink((operation, forward) => {
		// 	return forward(operation).map(response => {
		// 		const context = operation.getContext();

		// 		if (context.req && context.req.headers) {
		// 			const cookie = context.req.headers.get("set-cookie");
		// 			if (cookie) {
		// 				console.log(cookie);
		// 			}
		// 		}
		// 		return response;
		// 	});
		// });

		const errorLink = onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors) {
				graphQLErrors.map(err => console.log(`[GraphQL error]: Message: ${err.message}`));
			}
			if (networkError) console.log(`[Network error]: ${networkError}`);
		});

		let link = ApolloLink.from([ errorLink, contextLink, httpLink ]);

		if (!ssrMode) {
			link = split(
				// split based on operation type
				({ query }) => {
					const definition = getMainDefinition(query);
					return (
						definition.kind === 'OperationDefinition' &&
						definition.operation === 'subscription'
					);
				},
				wsLink,
				link,
			);
		}

		const cache = new InMemoryCache({
			dataIdFromObject: (data) => (data && data.id && data.__typename ? data.__typename + data.id : null),
		});

		return new ApolloClient({
			link,
			ssrMode,
			cache,
		});
	},
	{ getDataFromTree: 'always' },
);
