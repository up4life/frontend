import Events from "../components/Home/Events";
import Header from "../components/Header";
import { isLoggedIn } from "../components/Queries/User";
import redirect from "../utils/redirect";

const Home = ({ query, currentUser }) => {
	console.log(query, currentUser)
	return (
		<>
			<Header color="primary" currentUser={currentUser} />
			<Events />
		</>
	)
};

Home.getInitialProps = async ctx => {
	console.log(Object.keys(ctx))
	const { currentUser } = await isLoggedIn(ctx.apolloClient);
	console.log(currentUser)
	if (!currentUser) {
		redirect(ctx, '/joinus');
	}

	return { currentUser };
};

export default Home;
