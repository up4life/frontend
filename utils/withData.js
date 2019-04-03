import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-client';
import getConfig from 'next/config';
const {
	publicRuntimeConfig: { endpoint, wsEndpoint }
} = getConfig();

export default withApollo(
	({ headers }) => {
		const ssrMode = !process.browser;

		const httpLink = createHttpLink({
			uri: endpoint
		});

		const wsLink =
			!ssrMode &&
			new WebSocketLink({
				uri: wsEndpoint,
				options: {
					connectionParams: {
						cookie: headers && headers.cookie,
						test: 'test string here'
					},
					reconnect: true,
					reconnectionAttempts: 50,
					lazy: true,
					timeout: 20000
				}
			});

		const contextLink = setContext(() => ({
			fetchOptions: {
				credentials: 'include'
			},
			headers: {
				...headers,
				host: process.env.NODE_ENV === 'development' ? 'localhost' : 'api.up4.life',
				cookie: headers && headers.cookie
			}
		}));

		const errorLink = onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors) {
				graphQLErrors.map(err => console.log(`[GraphQL error]: Message: ${err.message}`));
			}
			if (networkError) console.log(`[Network error]: ${networkError}`);
		});

		let link = ApolloLink.from([errorLink, contextLink, httpLink]);

		if (!ssrMode) {
			link = split(
				// split based on operation type
				({ query }) => {
					const definition = getMainDefinition(query);
					return (
						definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
					);
				},
				wsLink,
				link
			);
		}

		const cache = new InMemoryCache({
			dataIdFromObject: data =>
				data && data.id && data.__typename ? data.__typename + data.id : null
		});

		return new ApolloClient({
			link,
			ssrMode,
			cache
		});
	},
	{ getDataFromTree: 'always' }
);
