const { RESTDataSource } = require('apollo-datasource-rest');
const { format } = require('date-fns');
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

    const { results } = await this.get(`/v1/open-close/${ticker}/${format(new Date(), "yyyy-MM-dd")}`);
    return results;
  }

  async getNews(args) {
    const { results } = await this.get(`/v2/reference/news`, args);
    return results;
  }
}

module.exports = {PologonApi};
