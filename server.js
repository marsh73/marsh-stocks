
const { empty } = require('@apollo/client/core');
const { ApolloServer, gql, PubSub } = require('apollo-server-express');
const express = require('express');
const http = require('http');
const Data = require('./data/challenge_data.json');
const PORT = process.env.PORT || 4000;
const app = express();
const pubsub = new PubSub();
const DESTINATION_ADDED = 'DESTINATION_ADDED';
let lastInterval = null;

const typeDefs = gql`
  type Destination {
    destination: String
    event_name: String
    id: ID
    name: String
    sent_at_second: Int
  }

  input DestinationInput {
    destination: String
    event_name: String
    id: ID
    name: String
  }

  type Mutation {
    UpdateDestination(DestinationInput: DestinationInput): Boolean
  }

  type Query {
    GetDestinations: Boolean
  }

  type Subscription {
    destinationAdded: Destination
  }
`;

function cycleDestinations() {
  let last = -Infinity;
  let map = new Map();

  Data.destinations.slice().forEach(dest => {
    if (dest.sent_at_second > last) last = dest.sent_at_second;

    if (!map.has(dest.sent_at_second)) {
      map.set(dest.sent_at_second, []);
    }

    map.get(dest.sent_at_second).push(dest);
  });

  let second = 0;
  let interval = setInterval(() => {
    second ++;

    if (second > last) {
      clearInterval(interval);
    } else if (map.has(second)) {
      let next = map.get(second);
      for (const D of next) {
        pubsub.publish(DESTINATION_ADDED, {destinationAdded: D});
      }
    }
  }, 1000);
  lastInterval = interval;
}

const resolvers = {
  Query: {
    GetDestinations()  {
      if (lastInterval) {
        clearInterval(lastInterval);
      }

      cycleDestinations();
      return true;
    }
  },
  Mutation: {
    UpdateDestination (_, { DestinationInput })  {
      pubsub.publish(DESTINATION_ADDED, {destinationAdded: DestinationInput});
      return true;
    }
  },
  Subscription: {
    destinationAdded: {
      subscribe: () => pubsub.asyncIterator([DESTINATION_ADDED]),
    },
  },
};

function connectToSocket(token) {
  const wsUrl =
    getEnv() === ENV.stage
      ? 'wss://push.s2r1.internal.digitalocean.com/ws-notifications'
      : 'wss://push.digitalocean.com/ws-notifications';

      const socket = io(wsUrl);
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: () => console.log('Connected to websocket'),
  }
});

server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})