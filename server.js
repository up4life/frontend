// const next = require('next');
// const http = require('http');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handleNextRequests = app.getRequestHandler();

// app.prepare().then(() => {
// 	const server = new http.Server((req, res) => {
// 		// Add assetPrefix support based on the hostname
// 		console.log(req.headers);
// 		if (req.headers.host === 'my-app.com') {
// 			app.setAssetPrefix('http://cdn.com/myapp');
// 		} else {
// 			app.setAssetPrefix('');
// 		}

// 		handleNextRequests(req, res);
// 	});

// 	server.listen(port, err => {
// 		if (err) {
// 			throw err;
// 		}

// 		console.log(`> Ready on http://localhost:${port}`);
// 	});
// });

// const express = require('express');
// const next = require('next');
// const port = parseInt(process.env.PORT, 10) || 3000;
// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
// 	const server = express();
// 	server.get('/billing', (req, res) => app.render(req, res, '/billing'));
// 	server.get('/joinus', (req, res) => app.render(req, res, '/joinus'));
// 	server.get('/profile', (req, res) => {
// 		app.render(req, res, '/profile');
// 	});
// 	server.get('/home', (req, res) => app.render(req, res, '/'));
// 	server.get('/welcome', (req, res) => {
// 		const actualPage = Object.assign({ slug: req.params.slug }, req.query);

// 		app.render(req, res, '/welcome', actualPage);
// 	});

// 	server.get('/', (req, res) => app.render(req, res, '/'));

// 	server.get('*', (req, res) => {
// 		return handle(req, res);
// 	});

// 	server.listen(port, err => {
// 		if (err) throw err;
// 		console.log(`Listening on http://localhost:${port}`);
// 	});
// });

// let actualPage;
// const { slug } = req.params;
// let actualPage;
// switch (slug) {
// 	case "0":
// 		actualPage = "/profile/getstarted";
// 	case "1":
// 		actualPage = "/profile/gender";
// 	case "2":
// 		actualPage = "/profile/gender/preferences";
// 	case "4":
// 		actualPage = "/profile/age";
// 	case "5":
// 		actualPage = "/profile/age/preferences";
// 	case "6":
// 		actualPage = "/profile/location";
// 	case "7":
// 		actualPage = "/profile/images";
// 	case "8":
// 		actualPage = "/profile/about";
// 	case "9":
// 		actualPage = "/pro";
// }
// if (slug = "0") {
//   path = '/welcome/profile/getstarted'
// }
