// Dependencies
import { Avatar, Empty, Spin, Icon as AntdIcon, Button, Input } from "antd";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Dialog, Card, Elevation, Icon } from "@blueprintjs/core";
import PropTypes from "prop-types";
import { QueryList } from "@blueprintjs/select";
import React, { useState } from "react";

// Components
import Repository from "./Repository";

// Action creators
import * as actionCreators from "../redux/modules/pillar";

// Filters repositories by name, in memory
const filterItems = (query, repositories) => {
	return repositories.filter(({ name }) => {
		return name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
	});
};

// Renders the repositories component
const renderer = ({ handleQueryChange, itemList }) => {
	return (
		<div>
			<Input.Search
				placeholder="Filter by repository name..."
				onChange={(e) => handleQueryChange(e)}
				style={{ width: 300, margin: 10 }}
			/>
			<div className="repositories-container">{itemList}</div>
		</div>
	);
};

renderer.propTypes = {
	handleQueryChange: PropTypes.func.isRequired,
	itemList: PropTypes.array.isRequired
};

// Renders a single repository card
const itemRenderer = (
	{ id, name, contributors, forks, watchers, owner: { avatar_url: avatar } },
	{ handleClick }
) => {
	return (
		<div
			id="card"
			key={id}
			onClick={handleClick}
			style={{ height: "100%", width: "100%" }}
		>
			<Card interactive elevation={Elevation.TWO}>
				<div className="repository">
					<div id="avatar">
						<Avatar size={64} src={avatar} />
					</div>
					<div id="details">{name}</div>
					<div id="metrics">
						<div>
							<Icon icon="user" /> {contributors}
						</div>
						<div>
							<Icon icon="fork" /> {forks}
						</div>
						<div>
							<Icon icon="star" /> {watchers}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

itemRenderer.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	contributors: PropTypes.string.isRequired,
	forks: PropTypes.string.isRequired,
	watchers: PropTypes.string.isRequired,
	owner: PropTypes.shape({ avatar_url: PropTypes.string.isRequired })
};

const Repositories = ({ loading, repositories = [], sortRepositories }) => {
	const [selectedRepository, selectRepository] = useState(null);
	const [selectedSort, selectSort] = useState(null);
	const { id, full_name: fullName } = selectedRepository || {};
	return (
		<div>
			<Dialog
				onClose={() => {
					selectRepository(null);
				}}
				title={fullName}
				isOpen={id}
			>
				<Repository repository={selectedRepository} />
			</Dialog>
			{loading && (
				<div className="loading-spinner">
					<Spin
						indicator={
							<AntdIcon type="loading" style={{ fontSize: "150px" }} />
						}
					/>
				</div>
			)}
			{!loading && repositories.length > 0 && (
				<div>
					<div className="toolbar">
						<div>
							<h1>Repositories</h1>
						</div>
						<div id="sort">
							<div>Sort by:</div>
							<div>
								<Button.Group>
									<Button
										type={selectedSort === "contributors" ? "primary" : null}
										onClick={() => {
											selectSort("contributors");
											sortRepositories("contributors");
										}}
									>
										Contributors
									</Button>
									<Button
										type={selectedSort === "forks" ? "primary" : null}
										onClick={() => {
											selectSort("forks");
											sortRepositories("forks");
										}}
									>
										Forks
									</Button>
									<Button
										type={selectedSort === "watchers" ? "primary" : null}
										onClick={() => {
											selectSort("watchers");
											sortRepositories("watchers");
										}}
									>
										Stars
									</Button>
								</Button.Group>
							</div>
						</div>
					</div>
					<QueryList
						items={repositories}
						renderer={renderer}
						itemRenderer={itemRenderer}
						itemListRenderer={({ filteredItems, renderItem }) => {
							return filteredItems
								.map(renderItem)
								.filter((item) => item != null);
						}}
						itemListPredicate={filterItems}
						popoverProps={{
							targetTagName: "div"
						}}
						onItemSelect={(item) => {
							selectRepository(item);
						}}
					/>
				</div>
			)}
			{!loading && repositories.length <= 0 && (
				<div className="no-data">
					<Empty description="To start browsing, type in an organization in the search bar above." />
				</div>
			)}
		</div>
	);
};

Repositories.propTypes = {
	repositories: PropTypes.array,
	loading: PropTypes.bool,
	sortRepositories: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

function mapStateToProps(state) {
	const {
		pillar: { loading, repositories }
	} = state;
	return {
		loading,
		repositories
	};
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Repositories);
