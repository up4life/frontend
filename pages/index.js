import { isLoggedIn } from '../components/Queries/User';
import { getAllEvents } from '../components/Queries/AllEvents';
import redirect from '../utils/redirect';
import Home from './home';
import Welcome from './welcome';

const Index = ({ currentUser, getEvents }) => {
	console.log(currentUser, getEvents);
	if (!currentUser.gender) return <Welcome currentUser={currentUser} query={{ slug: 0 }} />;
	else return <Home currentUser={currentUser} getEvents={getEvents} />;
};

Index.getInitialProps = async ctx => {
	const { currentUser } = await isLoggedIn(ctx.apolloClient);

	if (!currentUser) {
		redirect(ctx, '/joinus');
	} else {
		const getEvents = await getAllEvents(ctx.apolloClient, currentUser);
		console.log(getEvents);
		return { currentUser, getEvents };
	}
};

export default Index;
