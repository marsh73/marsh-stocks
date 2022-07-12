const { RESTDataSource } = require('apollo-datasource-rest');
const { format, subDays } = require('date-fns');
require('dotenv').config();

class PologonApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.POLYGON_API;
  }

  willSendRequest(request) {
    request.headers.set('Authorization', `Bearer ${process.env.POLYGON_KEY}`);
  }

  async getTickers(args) {
    const { results } = await this.get('/v3/reference/tickers', args);
    return results;
  }

  async getTicker({ticker}) {
    const { results } = await this.get(`/v3/reference/tickers/${ticker}`);
    return results;
  }

  async getDaily({ticker}) {
    const results = await this.get(`/v1/open-close/${ticker}/${format(subDays(new Date(), 1), "yyyy-MM-dd")}`);
    return results;
  }

  async getFinancials(args) {
    const data = await this.get(`/vX/reference/financials`, args);
    const income_statement = await data.results[0]?.financials?.income_statement;
    const financials = {
      revenue: income_statement?.revenues?.value,
      operating_expenses: income_statement?.operating_expenses.value,
      gross_profit: income_statement?.gross_profit.value,
      basic_eps: income_statement?.basic_earnings_per_share.value
    };


    console.log('financials', financials);
    return financials;
  }

  async getNews(args) {
    const { results } = await this.get(`/v2/reference/news`, args);
    return results;
  }
}

module.exports = {PologonApi};
