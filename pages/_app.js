import App, { Container } from "next/app";
import Router from "next/router";
import Page from "../components/Page";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import withData from "../utils/withData";
import redirect from "../utils/redirect";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import getPageContext from "../utils/getPageContext";
import "../static/scss/material-kit-pro-react.scss";
class MyApp extends App {
	constructor() {
		super();
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
									<Component {...pageProps} />
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
