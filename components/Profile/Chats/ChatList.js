import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Chats from "./Chats";

const ALL_CHATS_QUERY = gql`
	query {
		getUserChats {
			id
			users {
				id
				firstName
				img {
					id
					img_url
					default
				}
			}
			typing {
				id
				firstName
			}
			messages {
				id
				text
				seen
				createdAt
				from {
					id
					firstName
					img {
						id
						img_url
						default
					}
				}
				updatedAt
			}
		}
	}
`;

export default ({ user }) => {
	return (
		<Query query={ALL_CHATS_QUERY}>
			{({ loading, error, data }) => {
				if (loading || !data.getUserChats) return <div />;
				if (error) return <div>Error</div>;
				return (
					<Chats
						data={data}
						currentUser={user}
					/>
				);
			}}
		</Query>
	);
};
