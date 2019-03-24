import JoinUs from './joinus';
import User from '../components/Queries/User';
import { isLoggedIn, CURRENT_USER_QUERY } from '../components/Queries/User';
import redirect from '../utils/redirect';
import Home from './home';
import Welcome from './welcome';

const Index = () => <div>Hi</div>;

Index.getInitialProps = async ctx => {
	if (ctx.req && ctx.req.headers) {
		console.log(ctx.req.headers.cookie, 'request cookie');
		console.log(Object.keys(ctx.apolloClient), 'object keys apolloClient');
		console.log(ctx.apolloClient.query, 'query');
	}
	// 	//const user = await isLoggedIn(ctx.apolloClient, ctx.req.headers.cookie);
	// 	console.log(user, 'user here');
	// }
	const response = await isLoggedIn(ctx.apolloClient);

	console.log(response, 'response');
	// if (!process.browser && ctx.req && ctx.req.headers) {
	// 	console.log("init props", response);
	// }

	return {};
};

export default Index;
