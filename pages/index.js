import JoinUs from "./joinus";
import User from "../components/Queries/User";
import { isLoggedIn } from "../components/Queries/User";
import redirect from "../utils/redirect";
import Home from "./home";

const Index = () => (
	<User>
		{({ data, loading, error }) => {
			if (loading) return <div>index</div>;
			if (error || !data.currentUser) return <JoinUs />;
			else return <Home />;
		}}
	</User>
);

Index.getInitialProps = async ctx => {
	if (!process.browser) {
		// let user = await isLoggedIn(ctx.apolloClient);
		let { cookies, cookie } = ctx.req.headers;
		console.log(cookies, cookie);
		console.log(ctx.req.headers["user-agent"]);
		// console.log(Object.keys(ctx), "ctx object keys in SSR");
		console.log(Object.keys(ctx.req.headers), "ctx object keys in SSR");
		// console.log(user);
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
