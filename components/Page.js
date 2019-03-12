import React, { Fragment } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import getPageContext from "../utils/getPageContext";
import "../static/scss/material-kit-pro-react.scss";
import Meta from "./Meta";

// const Page = ({ children }) => {
class Page extends React.Component {
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
	render() {
		return (
			<JssProvider
				registry={this.pageContext.sheetsRegistry}
				generateClassName={this.pageContext.generateClassName}
			>
				<MuiThemeProvider
					theme={this.pageContext.theme}
					sheetsManager={this.pageContext.sheetsManager}
				>
					<CssBaseline />
					<Meta />
					<div style={{ height: "100%" }}>{this.props.children}</div>
				</MuiThemeProvider>
			</JssProvider>
		);
	}
}

export default Page;
