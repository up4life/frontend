import React, { useState, useEffect } from 'react';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

export const ALL_EVENTS_QUERY = gql`
	query ALL_EVENTS_QUERY(
		$location: String!
		$page: Int
		$categories: [String]
		$dates: [String]
		$genres: [String]
	) {
		getEvents(
			location: $location
			page: $page
			categories: $categories
			dates: $dates
			genres: $genres
		) {
			page_count
			total_items
			page_number
			page_total
			location
			events {
				id
				tmID
				title
				image_url
				times
				genre
				category
				city
				venue
				attending {
					id
					dob
					firstName
					img {
						id
						default
						img_url
					}
				}
			}
		}
	}
`;

const Events = ({ children, variables }) => {
	return (
		<Query query={ALL_EVENTS_QUERY} variables={variables}>
			{payload => children(payload)}
		</Query>
	);
};

export const getAllEvents = async (client, user) => {
	try {
		const response = await client.query({
			query: ALL_EVENTS_QUERY,
			variables: {
				location: user.location || 'Los Angeles, CA',
				page: 0,
				categories: [],
				genres: [],
				dates: [],
			},
		});
		if (response) {
			console.log(response.data);
			return response;
		}
	} catch (e) {
		console.log('hello', e);
		return {};
	}
};

export default Events;
