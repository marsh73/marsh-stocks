import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TickerSearch from './TickerSearch';
import TickerMeta from './TickerMeta';
import Box from '@mui/material/Box';

export default function TickerContainer({id}) {
  const [ticker, setTicker] = useState(null);

  return (
    <Grid item xs={12} sm={4} >
      <Box>
        <TickerSearch id={id} setTicker={setTicker} />
        {ticker && <TickerMeta ticker={ticker} /> }
      </Box>
    </Grid>
  );
}