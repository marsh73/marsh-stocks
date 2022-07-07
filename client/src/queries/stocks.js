import { gql } from '@apollo/client';

export const GET_TICKER_NAMES = gql`
  query GET_TICKER_NAMES($tickersRequest: TickersRequest) {
    GetTickers(TickersRequest: $tickersRequest) {
      ticker
    }
  }
`;