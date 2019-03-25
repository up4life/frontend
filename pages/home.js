import Events from "../components/Home/Events";
import Header from "../components/Header";
import { isLoggedIn } from "../components/Queries/User";
import { getAllEvents } from '../components/Queries/AllEvents';
import redirect from "../utils/redirect";

const Home = ({ query, currentUser, getEvents }) => {
	console.log(getEvents)
	return (
		<>
			<Header color="primary" currentUser={currentUser} />
	<Events getEvents={getEvents} currentUser={currentUser}/>
		</>
	)
};

Home.getInitialProps = async ctx => {
	const { currentUser } = await isLoggedIn(ctx.apolloClient);

	if (!currentUser) {
		redirect(ctx, '/joinus');
	}else {
		const getEvents = await getAllEvents(ctx.apolloClient, currentUser);
		console.log(getEvents);
		return { currentUser, getEvents };
	}
};

export default Home;
