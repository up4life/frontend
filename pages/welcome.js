import Welcome from '../components/Welcome'
import { isLoggedIn } from '../components/Queries/User'
import redirect from '../utils/redirect'

const WelcomePage = ({ query, currentUser }) => <Welcome user={currentUser} slug={query.slug} />

WelcomePage.getInitialProps = async ctx => {
  console.log(ctx.query)
  const { currentUser } = await isLoggedIn(ctx.apolloClient)

  if (!currentUser) {
    redirect(ctx, '/joinus')
  }
  if (!currentUser.gender) {
    return { currentUser, query: { slug: 1 } }
  } else if (!currentUser.dob) {
    return { currentUser, query: { slug: 2 } }
  } else if (!currentUser.location) {
    return { currentUser, query: { slug: 3 } }
  }

  return { currentUser, query: ctx.query }
}

export default WelcomePage
