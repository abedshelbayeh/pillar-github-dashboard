// Dependencies
import { PageHeader, Avatar } from "antd";
import React from "react";

// Components
import Dashboard from "./Dashboard";

const App = () => {
	return (
		<div className="app">
			<div className="header">
				<PageHeader
					title="Pillar: GitHub Dashboard"
					extra={<Avatar style={{ backgroundColor: "#7265e6" }} icon="user" />}
				/>
			</div>
			<div className="page">
				<Dashboard />
			</div>
		</div>
	);
};

export default App;
