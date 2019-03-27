import { isLoggedIn } from '../components/Queries/User';
import { getAllEvents } from '../components/Queries/AllEvents';
import redirect from '../utils/redirect';
import Home from './home';
import Welcome from './welcome';

const Index = ({ currentUser }) => {
	if (!currentUser.gender) return <Welcome currentUser={currentUser} query={{ slug: 0 }} />;
	else return <Home user={currentUser} />;
};

Index.getInitialProps = async ctx => {
	const { currentUser } = await isLoggedIn(ctx.apolloClient);

	if (!currentUser) {
		redirect(ctx, '/joinus');
	}
	return { currentUser };
};

export default Index;
