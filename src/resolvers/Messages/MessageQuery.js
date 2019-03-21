const moment = require("moment");

module.exports = {
	getChat(parent, args, { user, db }, info) {
		// this is to find a specific chat by id
		if (!user) throw new Error("You must be logged in to start a conversation!");

		return db.chat(
			{
				where: {
					id: args.id
				}
			},
			info
		);
	},
	getUserChats(parent, args, { user, db }, info) {
		// this gets all of the chats that involve the logged in user
		if (!user) throw new Error("You must be logged in to start a conversation!");

		return db.chats(
			{
				where: {
					users_some: { id: user.id }
				}
			},
			info
		);
	},
	async getMessages(parent, args, { user, db }, info) {
		if (!user) throw new Error("You must be logged in to start a conversation!");

		return db.chats(
			{
				where: {
					users_some: { id: user.id }
				}
			},
			`{messages {id text createdAt seen from { id firstName imageThumbnail dob gender}}}`
		);
	},
	async getConversation(parent, args, { user, db }, info) {
		// this is to check if there is already a convo between logged in user and someone else
		if (!user) throw new Error("You must be logged in to start a conversation!");

		const [chat] = await db.chats(
			{
				where: {
					AND: [{ users_some: { id: user.id } }, { users_some: { id: args.id } }]
				}
			},
			info
		);

		return chat;
	},
	async getMessageLeft(parent, args, { user, db }, info) {
		// must logged in to access this query
		if (!user) throw new Error("You must be logged in to start a conversation!");

		if (user.permissions !== "FREE") return 1000;
		const sentMessages = await db.directMessages({
			where: {
				AND: [{ from: { id: user.id } }, { createdAt_gte: moment().startOf("isoWeek") }]
			}
		});

		return 20 - sentMessages.length;
	}
};
