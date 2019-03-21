const moment = require("moment");

module.exports = {
	async createChat(parent, args, { user, db }, info) {
		// User should logged in to create chat
		if (!user) throw new Error("You must be logged in to start a conversation!");

		// FREE users can only send 10 messages per week
		if (user.permissions === "FREE") {
			const sentMessages = await db.directMessages({
				where: {
					AND: [{ from: { id: user.id } }, { createdAt_gte: moment().startOf("isoWeek") }]
				}
			});

			if (sentMessages.length > 20)
				throw new Error("You have reached 20 DMs per week for FREE account.");
		}

		// check to see if chat between users already exists
		let [chat] = await db.chats(
			{
				where: {
					AND: [{ users_some: { id: user.id } }, { users_some: { id: args.id } }]
				}
			},
			info
		);
		if (chat) throw new Error("Conversation between these users already exists");

		// create new chat
		chat = await db.createChat(
			{
				data: {
					users: {
						connect: [{ id: user.id }, { id: args.id }]
					},
					messages: {
						create: [{ text: args.message, from: { connect: { id: user.id } } }]
					}
				}
			},
			info
		);

		return chat;
	},
	async sendMessage(parent, { id, message }, { user, db }, info) {
		// User should logged in to create chat
		if (!user) throw new Error("You must be logged in to send a message!");

		// FREE users can only send 20 messages per week
		if (user.permissions === "FREE") {
			const sentMessages = await db.directMessages({
				where: {
					AND: [{ from: { id: user.id } }, { createdAt_gte: moment().startOf("isoWeek") }]
				}
			});

			if (sentMessages.length >= 20)
				throw new Error("You have reached 20 DMs per week for FREE account.");
		}

		let [chat] = await db.chats({
			where: {
				AND: [{ users_some: { id: user.id } }, { users_some: { id } }]
			}
		});

		if (!chat) {
			return db.createChat(
				{
					data: {
						users: { connect: [{ id: user.id }, { id }] },
						messages: {
							create: [
								{
									text: message,
									from: { connect: { id: user.id } },
									to: { connect: { id } }
								}
							]
						}
					}
				},
				info
			);
		} else {
			return db.updateChat(
				{
					where: {
						id: chat.id
					},
					data: {
						messages: {
							create: [
								{
									text: message,
									from: { connect: { id: user.id } },
									to: { connect: { id } }
								}
							]
						}
					}
				},
				info
			);
		}
	},
	async deleteChat(parent, { id }, { user, db }, info) {
		// simple chat delete to erase entire conversation
		if (!user) throw new Error("You must be logged in to start a conversation!");

		await db.deleteChat({
			where: { id }
		});

		return { message: "Chat successfully erased" };
	},
	async updateSeenMessage(parent, { chatId }, { userId, db }, info) {
		let updated = await db.updateManyDirectMessages({
			where: {
				chat: {
					id: chatId
				},
				seen: false,
				from: {
					id_not: userId
				}
			},
			data: {
				seen: true
			}
		});
		return db.query.chat(
			{
				where: { id: chatId }
			},
			info
		);
	},
	async markAllAsSeen(parent, args, { userId, user, db }, info) {
		if (!user) throw new Error("You must be logged in to start a conversation!");

		const chat = db.chat({
			where: {
				id: args.chatId
			}
		});

		if (!chat) throw new Error("Chat does not exist");

		await db.updateManyDirectMessages({
			where: {
				AND: [{ chat: { id: args.chatId } }, { from: { id_not: userId } }, { seen: false }]
			},
			data: {
				seen: true
			}
		});

		return db.updateChat({
			where: {
				id: args.chatId
			},
			data: {}
		});
	}
};
