import Events from "../components/Home/Events";
import Header from "../components/Header";
import { isLoggedIn } from "../components/Queries/User";
import { getAllEvents } from '../components/Queries/AllEvents';
import redirect from "../utils/redirect";

const Home = ({ query, currentUser, getEvents  }) => {
	
	return (
		<>
			<Header color="primary" user={currentUser} />
			<Events  getEvents={getEvents.data} user={currentUser}/>
		</>
	)
};

Home.getInitialProps = async ctx => {
	const { currentUser } = await isLoggedIn(ctx.apolloClient);

	if (!currentUser) {
		redirect(ctx, '/joinus');
	}else if (!currentUser.dob || !currentUser.location || !currentUser.gender){
		redirect(ctx, '/welcome')
	} else {
		const getEvents = await getAllEvents(ctx.apolloClient, currentUser);
		return { currentUser, getEvents, query: ctx.query};
	}
	
};

export default Home;
