import JoinUs from "./joinus";
import User from "../components/Queries/User";
import { isLoggedIn } from "../components/Queries/User";
import redirect from "../utils/redirect";
import Home from "./home";
import App from "./_app";

const Index = () => (
	<App>
		{props => (
			<User>
				{({ data, loading, error }) => {
					if (loading) return <div>index</div>;
					if (error || !data.currentUser) return <JoinUs />;
					else return <Home />;
				}}
			</User>
		)}
	</App>
);

Index.getInitialProps = async ctx => {
	if (!process.browser) {
		// let user = await isLoggedIn(ctx.apolloClient);
		// if (!(await isLoggedIn(ctx))) {
		// 	console.log("fucker");
		// }
		let { cookies, cookie } = ctx.req.headers;
		console.log(cookies, cookie);

		console.log(ctx.res.body);

		console.log(Object.keys(ctx.req.headers), "ctx object keys in SSR");
	}

	// if (!user.currentUser) {
	// 	console.log("no user Index.getInitProps");
	// 	// redirect(ctx, '/joinus');
	// }
	// else {
	// 	redirect(ctx, '/home');
	// }
	return {};
};

export default Index;
