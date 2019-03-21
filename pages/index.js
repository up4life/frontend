import JoinUs from "./joinus";
import User from "../components/Queries/User";
import { isLoggedIn, CURRENT_USER_QUERY } from "../components/Queries/User";
import redirect from "../utils/redirect";
import Home from "./home";
import Welcome from "./welcome";

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
		console.log(ctx.req.headers, "request headers");
	}
	const { data } = await ctx.apolloClient.query({
		query: CURRENT_USER_QUERY
	});
	console.log("init props", data);

	return {};
};

export default Index;
