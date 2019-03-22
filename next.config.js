const withSass = require("@zeit/next-sass");
const withImages = require("next-images");
const isProd = process.env.NODE_ENV === "production";

module.exports = withSass(
	withImages({
		assetPrefix: isProd ? "https://testup4.herokuapp.com" : ""
	})
);
