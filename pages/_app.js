import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import getPageContext from "../utils/getPageContext";
import JssProvider from "react-jss/lib/JssProvider";
import { ApolloProvider } from "react-apollo";
import App, { Container } from "next/app";
import nextCookie from "next-cookies";
// import Router from "next/router";
// import redirect from "../utils/redirect";
import "../static/scss/material-kit-pro-react.scss";
import withData from "../utils/withData";
import Page from "../components/Page";

class MyApp extends App {
	constructor(props) {
		super(props);
		this.pageContext = getPageContext();
	}
	componentDidMount() {
		const jssStyles = document.querySelector("#jss-server-side");
		if (jssStyles && jssStyles.parentNode) {
			jssStyles.parentNode.removeChild(jssStyles);
		}
	}
	static async getInitialProps({ Component, ctx }) {
		let pageProps = {};
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}
		const tokenObj = nextCookie(ctx);
		console.log(ctx.req.headers);
		console.log(ctx.req.cookies);
		console.log(tokenObj);
		// this exposes the query to the user
		pageProps.query = ctx.query;
		return { pageProps };
	}

	render() {
		const { Component, apollo, pageProps } = this.props;

		return (
			<Container>
				<ApolloProvider client={apollo}>
					<ApolloHooksProvider client={apollo}>
						<JssProvider
							registry={this.pageContext.sheetsRegistry}
							generateClassName={this.pageContext.generateClassName}
						>
							<MuiThemeProvider
								theme={this.pageContext.theme}
								sheetsManager={this.pageContext.sheetsManager}
							>
								<CssBaseline />
								<Page>
									<Component {...pageProps} pageContext={this.pageContext} />
								</Page>
							</MuiThemeProvider>
						</JssProvider>
					</ApolloHooksProvider>
				</ApolloProvider>
			</Container>
		);
	}
}

export default withData(MyApp);
