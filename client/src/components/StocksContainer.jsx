import React from 'react';
import Grid from '@mui/material/Grid';
import TickerContainer from './TickerContainer';
// import { useQuery } from '@apollo/client';
// import styled from 'styled-components';

export default function StocksContainer() {
  // const [Tickers, updateTickets] = useState();


  // Used only to trigger mocked badkend
  // useQuery(TRIGGER_DESTINATIONS);


  return (
    <Grid container spacing={1}>
      <TickerContainer id="1" />
      <TickerContainer id="2" />
      <TickerContainer id="3" />

    </Grid>
  );
}