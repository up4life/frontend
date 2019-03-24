import Welcome from '../components/Welcome';
import { isLoggedIn } from '../components/Queries/User';
import redirect from '../utils/redirect';

const WelcomePage = ({ query, currentUser }) => <Welcome user={currentUser} slug={query.slug} />;

WelcomePage.getInitialProps = async ctx => {
	const { currentUser } = await isLoggedIn(ctx.apolloClient);

	if (!currentUser) {
		redirect(ctx, '/joinus');
	}

	return { currentUser };
};

export default WelcomePage;
