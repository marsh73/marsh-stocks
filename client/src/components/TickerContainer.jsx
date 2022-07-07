import React, { useState } from 'react';
import _throttle from 'lodash/throttle';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@apollo/client';
import { GET_TICKER_NAMES } from '../queries/stocks';


function TickerSearch({id}) {
  const [open, setOpen] = useState(false);
  const [tickers, setTickers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { error, refetch } = useQuery(GET_TICKER_NAMES, {
    onCompleted: (resp) => {
      console.log('resp', resp?.GetTickers);
      setIsSearching(false);
      if (resp?.GetTickers) {
        let Ts = resp.GetTickers.map(T => T.ticker);
        setTickers(Ts);
      }
    }
  });

  const throttledEventHandler = _throttle((e) => {
      setIsSearching(true);

      refetch({
        tickersRequest: { search: e.target.value },
      })
    }, 1000);




  return (
    <Autocomplete
      id={id}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      options={tickers}
      loading={isSearching}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={throttledEventHandler}
          label="Ticker"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default function Ticker() {
  return (
    <Grid item xs={12} sm={4}>
      <TickerSearch />
      <Box sx={{ p: 2 }}>
       Ticker
      </Box>
    </Grid>
  );
}