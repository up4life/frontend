import Splash from '../components/SplashPage';
import { isLoggedIn } from '../components/Queries/User';
import redirect from '../utils/redirect';

const Index = () => <Splash />;

Index.getInitialProps = async ctx => {
	let { currentUser } = await isLoggedIn(ctx.apolloClient);

	if (currentUser) {
		redirect(ctx, '/home');
	}

	return {};
};

export default Index;
