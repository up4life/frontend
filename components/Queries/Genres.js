import gql from 'graphql-tag';

export const ALL_GENRE_QUERY = gql`
	query {
		genres {
			id
			tmID
			category
			name
		}
	}
`;

export const genres = async client => {
	try {
		const response = await client.query({
			query: ALL_GENRE_QUERY,
		});
		if (response) {
			return response;
		}
	} catch (e) {
		console.log('hello', e);
		return {};
	}
};
