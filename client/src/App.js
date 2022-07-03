import React from 'react';
import { ApolloProvider } from '@apollo/client'
import client from './Client';
import DestinationsContainer from './components/DestinationsContainer';

function App() {
  return (
    <ApolloProvider client={client}>
      <DestinationsContainer />
    </ApolloProvider>
  );
}

export default App;