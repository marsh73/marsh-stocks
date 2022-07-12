import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { ThemeProvider } from '@mui/material/styles';
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import blueGrey from '@mui/material/colors/blueGrey';
import theme from './theme';
import StocksContainer from "./components/StocksContainer";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{backgroundColor: blueGrey[100]}}>
          <Box sx={{ my: 4 }}>
            <StocksContainer />
          </Box>
        </Container>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
