import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import focusGuild from "./reducer/focusGuild";
import focusChannel from './reducer/focusChannel'
import getUser from "./reducer/getUser"
import passwd from "./reducer/passwd"
import gatewayWS from "./reducer/ws"

const env = process.env.NODE_ENV;

const middlewares = [thunk];

if (env === 'development') {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

const reducer = combineReducers({
  focusGuild,
  focusChannel,
  getUser,
  passwd,
  gatewayWS
  // routing: routerReducer,
});

let store;

if (env === "development") {
  store = initialState =>
    createStore(reducer,
    composeWithDevTools(applyMiddleware(...middlewares)));
} else {
  store = initialState => createStore(reducer, applyMiddleware(...middlewares));
}

export default store();