require('dotenv').config();
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

const withAssetsImport = require('next-assets-import');
const isProd = process.env.NODE_ENV === 'production';

module.exports = withSass(
	withImages({
		publicRuntimeConfig: {
			endpoint: process.env.ENDPOINT,
			wsEndpoint: process.env.WSENDPOINT,
			firebase_key: process.env.FIREBASE_KEY,
			firebase_domain: process.env.FIREBASE_DOMAIN,
			firebase_url: process.env.FIREBASE_URL,
			firebase_id: process.env.FIREBASE_ID,
			firebase_bucket: process.env.FIREBASE_BUCKET,
			firebase_msg_id: process.env.FIREBASE_MSG_ID,
		},
	})
);
