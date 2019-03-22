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
	console.log('keys', Object.keys(ctx), 'apolloClient', Object.keys(ctx.apolloClient));
	if (ctx.req && ctx.req.headers) {
		console.log(ctx.req.headers, 'request headers');
		console.log(ctx.req.cookies, 'request cookies');
	}
	const response = await isLoggedIn(ctx.apolloClient);

	console.log(response, 'response');
	// if (!process.browser && ctx.req && ctx.req.headers) {
	// 	console.log("init props", response);
	// }

	return {};
};

export default Index;
