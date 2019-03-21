"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Category",
    embedded: false
  },
  {
    name: "Permission",
    embedded: false
  },
  {
    name: "Gender",
    embedded: false
  },
  {
    name: "GenderPrefs",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "Chat",
    embedded: false
  },
  {
    name: "DirectMessage",
    embedded: false
  },
  {
    name: "ProfilePic",
    embedded: false
  },
  {
    name: "Event",
    embedded: false
  },
  {
    name: "Genre",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env["PRISMA_ENDPOINT"]}`,
  secret: `${process.env["PRISMA_SECRET"]}`
});
exports.prisma = new exports.Prisma();
