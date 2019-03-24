import JoinUs from './joinus';
import User from '../components/Queries/User';
import { isLoggedIn, CURRENT_USER_QUERY } from '../components/Queries/User';
import redirect from '../utils/redirect';
import Home from './home';
import Welcome from './welcome';

const Index = ({ currentUser }) => {
	console.log(currentUser);
	if (!currentUser.gender) return <Welcome query={{ slug: 0 }} />;
	else return <Home />;
};

Index.getInitialProps = async ctx => {
	// if (ctx.req && ctx.req.headers) {
	// 	console.log(ctx.req.headers.cookie, 'request cookie');
	// 	console.log(Object.keys(ctx.apolloClient), 'object keys apolloClient');
	// 	console.log(ctx.apolloClient, 'apolloClient');
	// }
	// 	//const user = await isLoggedIn(ctx.apolloClient, ctx.req.headers.cookie);
	// 	console.log(user, 'user here');
	// }
	const { currentUser } = await isLoggedIn(ctx.apolloClient);

	console.log(currentUser, 'response');
	if (!currentUser) {
		redirect(ctx, '/joinus');
	}
	// if (!process.browser && ctx.req && ctx.req.headers) {
	// 	console.log("init props", response);
	// }

	return { currentUser };
};

export default Index;
