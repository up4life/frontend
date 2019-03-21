const axios = require("axios");
const { forwardTo } = require("prisma-binding");
const { transformEvents, fetchEvents, setDates, getScore } = require("../utils");
const stripe = require("../stripe");
const moment = require("moment");
const MessageQuery = require("./Messages/MessageQuery");
const UserQuery = require("./User/UserQuery");

const Query = {
	...MessageQuery,
	...UserQuery,
	genres(parent, args, { db }, info) {
		return db.genres();
	},
	async userEvents(parent, args, { user, db }, info) {
		if (!user) throw new Error("You must be logged in to use this feature!");

		return db.events(
			{
				where: {
					attending_some: {
						id: user.id
					}
				}
			},
			info
		);
	},
	async currentUser(parent, args, { userId, db }, info) {
		// check if there is a current user ID
		if (!userId) {
			return null;
		}

		return db.user(
			{
				where: { id: userId }
			},
			info
		);
	},
	async user(parent, args, { userId, db }, info) {
		let score = 0;
		if (args.where.id) {
			score = await getScore(userId, args.where.id, db);
		}

		const user = await db.user(
			{
				...args
			},
			`{
				id
				firstName
				dob
				img {
					id
					default
					img_url
				}
				biography
				events {
					id
				}
				interests {
					id
				}
			}`
		);

		return {
			...user,
			score
		};
	},
	async getEvents(parent, { location, alt, page, ...args }, { user, db }, info) {
		location = location.split(",")[0].toLowerCase();
		let cats =
			!args.categories || !args.categories.length
				? ["KZFzniwnSyZfZ7v7nJ", "KZFzniwnSyZfZ7v7na", "KZFzniwnSyZfZ7v7n1"]
				: args.categories;

		const dates = !args.dates || !args.dates.length ? undefined : setDates(args.dates.toString());

		let events;
		let { data } = await fetchEvents(location, cats, dates, page, 26, args.genres);

		events = data._embedded.events;

		let uniques = events.reduce((a, t) => {
			if (!a.includes(t.name)) a.push(t.name);
			return a;
		}, []);
		let pageNumber = data.page.number;

		if (data.page.totalElements > 26) {
			while (uniques.length < 26) {
				page = page + 1;

				let res = await fetchEvents(location, cats, dates, page, 26, args.genres);
				pageNumber = res.data.page.number;
				if (!res.data._embedded) break;
				else {
					events = [...events, ...res.data._embedded.events];
					uniques = res.data._embedded.events.reduce((a, t) => {
						if (!a.includes(t.name)) a.push(t.name);
						return a;
					}, uniques);
				}
			}
		}

		const eventList = await transformEvents(user, events, db);

		return {
			events: eventList,
			page_count: data.page.size,
			total_items: data.page.totalElements,
			page_total: data.page.totalPages,
			page_number: pageNumber,
			location: location
		};
	},

	async getEvent(parent, args, ctx, info) {
		const {
			data: { _embedded, dates, images, name, id }
		} = await axios.get(
			`https://app.ticketmaster.com/discovery/v2/events/${args.id}.json?apikey=${
				process.env.TKTMSTR_KEY
			}`
		);

		const [img] = images.filter(img => img.width > 500);
		return {
			id,
			title: name,
			city: _embedded ? _embedded.venues[0].city.name : "",
			venue: _embedded ? _embedded.venues[0].name : "",
			image_url: img.url,
			times: [dates.start.dateTime]
		};
	},
	async getLocation(parent, { latitude, longitude }, ctx, info) {
		const { data } = await axios.get(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude}, ${longitude}&key=${
				process.env.GOOGLE_API_KEY
			}`
		);
		let city = data.results[0].address_components[3].long_name;
		let state = data.results[0].address_components[5].short_name;
		let county = data.results[0].address_components[4].long_name;

		return {
			city: `${city}, ${state}`,
			county: `${county}, ${state}`
		};
	},
	async locationSearch(parent, args, { db }, info) {
		const { data } = await axios(
			`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${
				args.city
			}&types=(cities)&key=${process.env.GOOGLE_API_KEY}`
		);
		const results = data.predictions;
		const city = results.map(result => {
			return { city: result.description };
		});
		return city;
	},
	async getRemainingDates(parent, args, { userId, db }, info) {
		if (!userId) throw new Error("You must be signed in to access this app.");

		const user = await db.user(
			{ where: { id: userId } },
			`
				{id permissions events {id}}
			`
		);
		// TO DO: define subscription level and benefit!!!
		let datesCount = 5;
		if (user.permissions === "MONTHLY") datesCount += 3;
		if (user.permissions === "YEARLY") datesCount += 5;

		return { count: datesCount - user.events.length };
	},
	async invoicesList(parent, args, { userId, user }, info) {
		if (!userId) throw new Error("You must be signed in to access this app.");

		const invoices = await stripe.invoices.list({
			customer: user.stripeCustomerId
		});

		return invoices.data;
	},

	async remainingMessages(parent, args, { user, db }, info) {
		const sentMessages = await db.directMessages({
			where: {
				AND: [{ from: { id: user.id } }, { createdAt_gte: moment().startOf("isoWeek") }]
			}
		});

		return 20 - sentMessages.length;
	}
};

module.exports = Query;
