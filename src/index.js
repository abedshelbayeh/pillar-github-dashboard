// Module dependencies
import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

// Component dependencies
import Router from "./Router";

// Reducers
import * as reducers from "./redux/modules";

// Style defendencies
import "./styles/stylesheet.scss";

const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

ReactDOM.render(
	<Provider store={store}>
		<Router />
	</Provider>,
	document.getElementById("root")
);
