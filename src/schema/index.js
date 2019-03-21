require("dotenv").config({ path: "./.env" });
const { makeExecutableSchema } = require("apollo-server");
const { importSchema } = require("graphql-import");

const typeDefs = importSchema("./src/schema/schema.graphql");
const { resolvers } = require("../resolvers");

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
