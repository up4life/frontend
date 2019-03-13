import { Query, withApollo } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

const CURRENT_USER_QUERY = gql`
	query {
		currentUser {
			id
			firstName
			lastName
			gender
			email
			biography
			dob
			location
			genderPrefs
			minAgePref
			maxAgePref
			img {
				default
				img_url
				id
			}
			permissions
			liked {
				id
			}
			blocked {
				id
			}
			events {
				id
			}
			chats {
				users {
					id
				}
			}
			interests {
				id
				category
				name
			}
			stripeCustomerId
		}
	}
`;

const User = props => (
	<Query {...props} query={CURRENT_USER_QUERY}>
		{payload => props.children(payload)}
	</Query>
);

export const isLoggedIn = async ({ apolloClient }) => {
	const { data } = await apolloClient.query({
		query: CURRENT_USER_QUERY,
		fetchPolicy: "cache-and-network"
	});
	if (data) {
		return data.currentUser;
	}
};

User.propTypes = {
	children: PropTypes.func.isRequired
};

export default User;

export { CURRENT_USER_QUERY };
