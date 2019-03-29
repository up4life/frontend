import { isLoggedIn } from "../components/Queries/User";
import {genres} from '../components/Queries/Genres'
import redirect from "../utils/redirect";
import Profile from "../components/Profile";
import Header from "../components/Header";

const ProfilePage = ({currentUser}) => (
	<>
		<Header color="warning" user={currentUser} />
		<Profile currentUser={currentUser} />
	</>	
);

ProfilePage.getInitialProps = async ctx => {
	let {currentUser} = await isLoggedIn(ctx.apolloClient);

	if (!currentUser) {
		redirect(ctx, '/joinus');
	} else if (!currentUser.dob || !currentUser.location || !currentUser.gender){
		redirect(ctx, '/welcome')
	}

	await genres(ctx.apolloClient);

	return { currentUser, query: ctx.query };
};

export default ProfilePage;
