import Welcome from '../components/Welcome';
import { isLoggedIn } from '../components/Queries/User';
import redirect from '../utils/redirect';

const WelcomePage = ({ query, currentUser }) => <Welcome user={currentUser} slug={query.slug} />;

WelcomePage.getInitialProps = async ctx => {
	console.log(ctx.query);
	const { currentUser } = await isLoggedIn(ctx.apolloClient);

	if (!currentUser) {
		redirect(ctx, '/joinus');
	}

	return { currentUser, query: ctx.query };
};

export default WelcomePage;
