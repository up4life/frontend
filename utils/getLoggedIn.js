export const isLoggedIn = async client => {
	let { data } = await client.query({
		query: CURRENT_USER_QUERY,
		fetchPolicy: "cache-and-network"
	});
	return data;
};
