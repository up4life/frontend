import JoinUs from './joinus';
import User from '../components/Queries/User';
import { isLoggedIn, CURRENT_USER_QUERY } from '../components/Queries/User';
import redirect from '../utils/redirect';
import Home from './home';
import Welcome from './welcome';

const Index = () => (
	<User>
		{({ data, loading, error }) => {
			if (loading) return <div />;
			if (error || !data.currentUser) return <JoinUs />;
			if (!data.currentUser.gender) return <Welcome query={{ slug: 0 }} />;
			else return <Home />;
		}}
	</User>
);

Index.getInitialProps = async ctx => {
	if (ctx.req && ctx.req.headers) {
		console.log(ctx.req.headers.cookie, 'request cookie');
		console.log(Object.keys(ctx.apolloClient), 'object keys apolloClient');
		console.log(ctx.apolloClient, 'apolloClient');
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
