// Dependencies
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Input } from "antd";
import PropTypes from "prop-types";
import React from "react";

// Components
import Repositories from "./Repositories";

// Action creators
import * as actionCreators from "../redux/modules/pillar";

const Dashboard = ({ getRepositories }) => {
	return (
		<div>
			<Input.Search
				placeholder="Find repositories by an organization's name..."
				enterButton="Search"
				size="large"
				onSearch={(organization) => getRepositories(organization)}
			/>
			<Repositories />
		</div>
	);
};

Dashboard.propTypes = {
	getRepositories: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

export default connect(
	null,
	mapDispatchToProps
)(Dashboard);
