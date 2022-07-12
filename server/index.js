
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');
const { PologonApi } = require('./polygonApi');
const express = require('express');
const { mocks } = require('./mocks');
const PORT = process.env.PORT || 4000;
const MOCKS = process.env.MOCKS ? mocks : false;
async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    dataSources: () => {
      return {
        polygonApi: new PologonApi()
      };
    },
    mocks: MOCKS,
    typeDefs,
    resolvers
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise(resolve => app.listen({ port: PORT }, resolve));

  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)

};

startApolloServer();

