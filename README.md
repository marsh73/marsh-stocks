## HELLO

I built a thing to fetch your favorite stock data.

Notes:

1. Rename .env.sample file to .env and add polygon key. If using a free account, only 5 requests per minute are allowed.. Which means if you load too many tickers, it will def start to break.
2. The free account does not show open/close data for the current day so I'm pulling the previous day.
3. Not all data shows up for all Tickers...

## Setup

### `yarn install`
### `yarn start` - will run both server and client with live data
### `MOCKS=true yarn start` - will run the app with mocks if live data is failing.

This should be from the root dir. Will load both server and client dependencies. It should open [http://localhost:3000](http://localhost:3000) in your browser.

This server should be running on http://localhost:4000.

## App Details

Simple React app with an Apollo Graphql Proxy layer to access the https://polygon.io/ API

