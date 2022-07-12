import { gql } from '@apollo/client';

export const GET_TICKER_NAMES = gql`
  query GET_TICKER_NAMES($tickersRequest: TickersRequest) {
    GetTickers(TickersRequest: $tickersRequest) {
      ticker
    }
  }
`;

export const GET_TICKER_DATA = gql`
  query GET_TICKER_DATA($ticker: String, $NewsRequest: NewsRequest) {
    GetTicker(ticker: $ticker) {
      total_employees
      market_cap
      share_class_shares_outstanding
    }
    GetDailyOpenClose(ticker: $ticker) {
      close
      open
      volume
      high
      low
    }
    GetFinancials(ticker: $ticker) {
      revenue
      operating_expenses
      gross_profit
      basic_eps
    }
    GetNews(NewsRequest: $NewsRequest) {
      title
      article_url
      published_utc
    }
  }
`;