import React, { useState } from 'react';
import _debounce from 'lodash/debounce';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@apollo/client';
import { GET_TICKER_NAMES } from '../queries/stocks';
import { Box } from '@mui/material';

export default function TickerSearch({id, setTicker}) {
  const [open, setOpen] = useState(false);
  const [tickers, setTickers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { refetch } = useQuery(GET_TICKER_NAMES, {
    onCompleted: (resp) => {

      setIsSearching(false);

      if (resp?.GetTickers) {
        let Ts = resp.GetTickers.map(T => T.ticker);
        setTickers(Ts);
      }
    }
  });

  const throttledEventHandler = _debounce((e) => {
      setIsSearching(true);

      refetch({
        tickersRequest: { search: e.target.value },
      })
    }, 1000);

  return (
    <Box>
      <Autocomplete
        id={id}
        open={open}
        onChange={(_event, value) => {
          setTicker(value);
        }}
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
            sx={{bgcolor: "#fff"}}
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
    </Box>
  );
}