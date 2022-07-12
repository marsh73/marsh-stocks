const { gql } = require('apollo-server');
const { BigNumber } = require('./types/BigNumber');

const typeDefs = gql`
  scalar BigNumber

  type Ticker {
    ticker: String
    name: String
    market: String
    locale: String
    primary_exchange: String
    type: String
    active: Boolean
    currency_name: String
    cik: String
    composite_figi: String
    share_class_figi: String
    share_class_shares_outstanding: BigNumber
    market_cap: String
    total_employees: Int
    phone_number: String
    address: TickerAddress
  }

  type TickerFinancials {
    revenue: BigNumber
    operating_expenses: BigNumber
    gross_profit: BigNumber
    basic_eps: Float
  }

  type TickerAddress {
    address1: String
    city: String
    state: String
    postal_code: String
  }

  type Publisher {
    name: String
    homepage_url: String
    logo_url: String
    favicon_url: String
  }

  type TickerNews {
    id: String
    title: String
    author: String
    published_utc: String
    article_url: String
    amp_url: String
    image_url: String
    description: String
    keywords: [String ]
    tickers: [String ]
    publisher: Publisher
  }

  type DailyOpenClose {
    afterHours: Float
    close: Float
    from: String
    high: Float
    low: Float
    open: Float
    preMarket: Float
    status: String
    symbol: String
    volume: Int
  }

  input TickersRequest {
    search: String
    limit: Int
  }

  input NewsRequest {
    ticker: String
    limit: Int
  }


  type Query {
    GetTickers(TickersRequest: TickersRequest): [Ticker]
    GetTicker(ticker: String): Ticker
    GetNews(NewsRequest: NewsRequest) : [TickerNews]
    GetDailyOpenClose(ticker: String) : DailyOpenClose
    GetFinancials(ticker: String) : TickerFinancials
  }
`;

const resolvers = {
  Query: {
    GetTickers(_source, { TickersRequest }, { dataSources })  {
      return dataSources.polygonApi.getTickers(TickersRequest);
    },
    GetTicker(_source, args, { dataSources })  {
      return dataSources.polygonApi.getTicker(args);
    },
    GetNews(_source, { NewsRequest }, { dataSources })  {
      return dataSources.polygonApi.getNews(NewsRequest);
    },
    GetDailyOpenClose(_source, args, { dataSources })  {
      return dataSources.polygonApi.getDaily(args);
    },
    GetFinancials(_source, args, { dataSources })  {
      return dataSources.polygonApi.getFinancials(args);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}