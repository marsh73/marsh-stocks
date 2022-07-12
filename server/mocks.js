const tickers = ['AA', 'BB', 'CC', 'DD', 'ABC', 'HELLO', "OTR"];
const mocks = {
  BigNumber: () => 1000000000,
  Query: () =>({
    GetTickers: () => tickers.map(d => {
      return {ticker: d}
    })
  }),
};

module.exports = { mocks };