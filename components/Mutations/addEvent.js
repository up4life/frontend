import gql from "graphql-tag";

export const ADD_EVENT_MUTATION = gql`
	mutation ADD_EVENT_MUTATION(
		$title: String!
		$venue: String!
		$image_url: String
		$times: [String]
		$url: String
		$address: String
		$city: String
		$lat: String
		$long: String
		$description: String
		$genre: String
		$category: String
	) {
		addEvent(
			event: {
				title: $title
				venue: $venue
				image_url: $image_url
				times: $times
				url: $url
				address: $address
				city: $city
				lat: $lat
				long: $long
				description: $description
				genre: $genre
				category: $category
			}
		) {
			id
			title
			url
			venue
			description
			times
			image_url
			address
			city
			genre
			category
			notes
			attending {
				id
				dob
				firstName
				img {
					id
					default
					img_url
				}
				biography
			}
		}
	}
`;
