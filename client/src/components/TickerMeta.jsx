import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import TickerDrawer from './TickerDrawer';
import { GET_TICKER_DATA } from '../queries/stocks';
import { tickerDataMap } from '../utils/ticker';

export default function TickerMeta({ticker}) {
  const [tickerData, setTickerData] = useState(null);
  const { refetch } = useQuery(GET_TICKER_DATA,  {
    variables: { ticker, NewsRequest: {ticker, limit: 3} },
    onCompleted: (resp) => {
      if (resp) {
        setTickerData(tickerDataMap(resp));
      }
    }
  })

  useEffect(() => {
    if (!ticker) {
      setTickerData(null);
    } else {
      refetch({ ticker })
    }
  }, [ticker, refetch]);

  return (
    <>
      {tickerData && (
        <>
          <Box bgColor="#fff">
            <TickerDrawer ticker={ticker} title="Daily" data={tickerData.daily} />
            <TickerDrawer ticker={ticker} title="Details" data={tickerData.details} />
            <TickerDrawer ticker={ticker} title="Financials" data={tickerData.financial} />
            <TickerDrawer ticker={ticker} news title="News" data={tickerData.news} />
          </Box>
        </>
      )}
    </>
  );
}