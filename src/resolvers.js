const { extractFragmentReplacements } = require("prisma-binding");

const resolvers = {
	Query: require("./resolvers/Query"),
	Mutation: require("./resolvers/Mutation"),
	Subscription: require("./resolvers/Subscription"),
	Node: require("./resolvers/Node")
};

module.exports = {
	resolvers,
	fragmentReplacements: extractFragmentReplacements(resolvers)
};
