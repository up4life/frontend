import { isLoggedIn } from '../components/Queries/User';
import { getAllEvents } from '../components/Queries/AllEvents';
import redirect from '../utils/redirect';
import Home from './home';
import Welcome from './welcome';

const Index = ({ currentUser, getEvents, query }) => {
	console.log(getEvents);
	if (!currentUser.gender) return <Welcome currentUser={currentUser} query={{ slug: 0 }} />;
	else return <Home getEvents={getEvents} currentUser={currentUser} />;
};

Index.getInitialProps = async ctx => {
	const { currentUser } = await isLoggedIn(ctx.apolloClient);

	if (!currentUser) {
		redirect(ctx, '/joinus');
	} else if (!currentUser.dob || !currentUser.location || !currentUser.gender) {
		redirect(ctx, '/welcome');
	} else {
		const getEvents = await getAllEvents(ctx.apolloClient, currentUser);
		return { currentUser, getEvents, query: ctx.query };
	}
};

export default Index;
