import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Container from "@mui/material/Container";
import StocksContainer from "./components/StocksContainer";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Container maxWidth="lg">
        <StocksContainer />
      </Container>
    </ApolloProvider>
  );
}

export default App;
