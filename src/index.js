// Module dependencies
import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

// Component dependencies
import Router from "./Router";

// Reducers
import * as reducers from "./redux/modules";

// Style defendencies
import "./styles/stylesheet.scss";

const store = createStore(
	combineReducers(reducers),
	compose(
		applyMiddleware(thunk),
		// eslint-disable-next-line no-underscore-dangle
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);

ReactDOM.render(
	<Provider store={store}>
		<Router />
	</Provider>,
	document.getElementById("root")
);
