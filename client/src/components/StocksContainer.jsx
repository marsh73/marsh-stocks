import React from 'react';
import Grid from '@mui/material/Grid';
import TickerContainer from './TickerContainer';

export default function StocksContainer() {
  return (
    <Grid container spacing={1} padding={2}>
      <TickerContainer id="1" />
      <TickerContainer id="2" />
      <TickerContainer id="3" />
    </Grid>
  );
}