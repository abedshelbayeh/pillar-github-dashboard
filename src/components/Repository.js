// Dependencies
import { Avatar, Button } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";

const Repository = ({
	repository: {
		owner: { avatar_url: avatar },
		created_at: createdAt,
		description,
		homepage,
		html_url: htmlUrl,
		language,
		pushed_at: pushedAt
	}
}) => {
	return (
		<div className="repository-modal">
			<div id="avatar">
				<Avatar size={64} src={avatar} />
			</div>
			<div>
				<div>
					<p>{description}</p>
					<p>
						This {language} repository was created on{" "}
						{moment(createdAt).format("MMMM Do, YYYY")} and last pushed into on{" "}
						{moment(pushedAt).format("MMMM Do, YYYY")}
					</p>
				</div>
				<div id="links">
					<div>
						<Button
							shape="circle"
							icon="link"
							onClick={() => window.open(homepage, "_blank")}
						/>
					</div>
					<div>
						<Button
							shape="circle"
							icon="github"
							onClick={() => window.open(htmlUrl, "_blank")}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

Repository.propTypes = {
	repository: PropTypes.object
};
export default Repository;
