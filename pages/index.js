import JoinUs from "./joinus";
import User from "../components/Queries/User";
import { isLoggedIn, CURRENT_USER_QUERY } from "../components/Queries/User";
import redirect from "../utils/redirect";
import Home from "./home";
import Welcome from "./welcome";

const Index = () => (
	<User>
		{({ data, loading, error }) => {
			if (loading) return <div>index</div>;
			if (error || !data.currentUser) return <JoinUs />;
			if (!data.currentUser.gender) return <Welcome query={{ slug: 0 }} />;
			else return <Home />;
		}}
	</User>
);

Index.getInitialProps = async ctx => {
	if (!process.browser) {
		if (ctx.req && ctx.req.headers) {
			// console.log(Object.keys(ctx.req));
			console.log(ctx.req.client, "req.client");
			console.log(ctx.req.query, "req.query");
			console.log(ctx.req.body, "ctx.req.body");
			console.log(ctx.req.cookies, "cookies");
			console.log(ctx.req.method, "http method");
			console.log(ctx.req.statusMessage, "http status message");
			console.log(ctx.req.route, "http route");
			// let user = await isLoggedIn(ctx.apolloClient);
			// console.log("init props", user);
			const response = await ctx.apolloClient.query({
				query: CURRENT_USER_QUERY,
				context: {
					credentials: "include"
				}
				//operationName: 'hellayyy',
				// fetchPolicy: "cache-and-network"
			});

			console.log(response, "response here");
		}
	}
	// if (!user.currentUser) {
	// 	console.log("no user Index.getInitProps");
	// 	// redirect(ctx, '/joinus');
	// }
	// // else {
	// 	redirect(ctx, '/home');
	// }
	return {};
};

export default Index;
