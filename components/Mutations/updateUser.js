import gql from 'graphql-tag';

export const UPDATE_USER_MUTATION = gql`
	mutation UPDATE_USER_MUTATION(
		$location: String
		$dob: String
		$gender: Gender
		$genderPrefs: [GenderPrefs!]
		$minAgePref: Int
		$maxAgePref: Int
		$biography: String
	) {
		updateUser(
			data: {
				location: $location
				dob: $dob
				biography: $biography
				gender: $gender
				genderPrefs: { set: $genderPrefs }
				minAgePref: $minAgePref
				maxAgePref: $maxAgePref
			}
		) {
			id
			location
			biography
			dob
			gender
			genderPrefs
			minAgePref
			maxAgePref
		}
	}
`;

export const LIKE_USER_MUTATION = gql`
	mutation LIKE_USER_MUTATION($like: ID) {
		updateUser(data: { liked: { connect: { id: $like } } }) {
			id
			liked {
				id
			}
		}
	}
`;

export const UNLIKE_USER_MUTATION = gql`
	mutation UNLIKE_USER_MUTATION($like: ID) {
		updateUser(data: { liked: { disconnect: { id: $like } } }) {
			id
			liked {
				id
			}
		}
	}
`;

export const UPDATE_BLOCKS_MUTATION = gql`
	mutation UPDATE_BLOCKS_MUTATION($block: ID) {
		updateUser(data: { blocked: { connect: { id: $block } } }) {
			id
			blocked {
				id
			}
		}
	}
`;

export const DELETE_EVENT_MUTATION = gql`
	mutation DELETE_EVENT_MUTATION($tmID: String) {
		updateUser(data: { events: { disconnect: { tmID: $tmID } } }) {
			id
			events {
				id
				tmID
				attending {
					id
				}
			}
		}
	}
`;
