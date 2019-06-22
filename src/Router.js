// Module dependencies
import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from "react";

// Component dependencies
import App from "./components/App";

export default function Router() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={App} />
			</Switch>
		</BrowserRouter>
	);
}
