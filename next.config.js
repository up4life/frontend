const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const withAssetsImport = require('next-assets-import');
const isProd = process.env.NODE_ENV === 'production';

module.exports = withSass(withImages(withAssetsImport({})));
