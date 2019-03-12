import React, { Fragment } from "react";
import "../static/scss/material-kit-pro-react.scss";
import Meta from "./Meta";

const Page = ({ children }) => (
	// class Page extends React.Component {
	// 	constructor() {
	// 		super();
	// 		this.pageContext = getPageContext();
	// 	}
	// 	componentDidMount() {
	// 		const jssStyles = document.querySelector("#jss-server-side");
	// 		if (jssStyles && jssStyles.parentNode) {
	// 			jssStyles.parentNode.removeChild(jssStyles);
	// 		}
	// 	}
	// 	render() {
	// return (
	<Fragment>
		<Meta />
		<div style={{ height: "100%" }}>{children}</div>
	</Fragment>
	// );
);

export default Page;
