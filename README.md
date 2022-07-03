## HELLO

I built an app to display a list of orders... enjoy. I used Create React App to quickly get the bones up, using [https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/](https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/) as a super simple setup.

## Setup

### `yarn install`
### `yarn start`

This should be from the root dir. Will load both server and client dependencies. It should open [http://localhost:3000](http://localhost:3000) in your browser.

This server should be running on http://localhost:4000.

## Tests

### `yarn test`

Only unit tests for util functionality.

## App Details

I took this opportunity to use Apollo Subscriptions for the web sockets on the server. I had not used them and wanted to see how friendly they were on the client.

For this App I relied only on useState hooks for any state management. Would probably move this to useContext or add Redux if the app grew beyond what is there now.

## Future ideas

Next thing I would have done if I had more time would be to add better empty states and error messages. 
