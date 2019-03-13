import { isLoggedIn } from "../components/Queries/User";
import redirect from "../utils/redirect";
import User from "../components/Queries/User";
import Profile from "../components/Profile";
import Header from "../components/Header";

import JoinUs from "./joinus";

const ProfilePage = () => (
	<User>
		{({ data, loading, error }) => {
			if (data.currentUser)
				return (
					<>
						<Header color="warning" currentUser={data.currentUser} />
						<Profile currentUser={data.currentUser} />
					</>
				);
			else return <div>hi</div>;
		}}
	</User>
);

// ProfilePage.getInitialProps = async ctx => {
// 	let user = await isLoggedIn(ctx.apolloClient);

// 	return {  };
// };

export default ProfilePage;
