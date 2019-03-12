import React, { Fragment } from "react";
import "../static/scss/material-kit-pro-react.scss";
import Meta from "./Meta";

const Page = ({ children }) => (
	<Fragment>
		<Meta />
		<div style={{ height: "100%" }}>{children}</div>
	</Fragment>
);

export default Page;
