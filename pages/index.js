import { isLoggedIn } from '../components/Queries/User';
import { getAllEvents } from '../components/Queries/AllEvents';
import redirect from '../utils/redirect';
import Home from './home';
import Welcome from './welcome';

const Index = ({ currentUser, getEvents }) => {
	if (!currentUser.gender) return <Welcome currentUser={currentUser} query={{ slug: 0 }} />;
	else return <Home currentUser={currentUser} getEvents={getEvents} />;
};

Index.getInitialProps = async ctx => {
	const { currentUser } = await isLoggedIn(ctx.apolloClient);
	console.log(currentUser);
	if (!currentUser) {
		redirect(ctx, '/joinus');
	} else {
		console.log(ctx.apolloClient);
		const getEvents = await getAllEvents(ctx.apolloClient, currentUser);
		return { currentUser, getEvents };
	}
};

export default Index;
