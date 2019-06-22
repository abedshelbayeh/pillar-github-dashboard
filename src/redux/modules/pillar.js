// Dependencies
import { sort } from "ramda";
import { getRepositoriesByOrganization } from "../../interfaces/github";

// Components
import Toaster from "../../components/Toaster";

// Action creators
export function getRepositories(organization) {
	return async (dispatch) => {
		try {
			dispatch({ type: "FETCHING_REPOSITORIES" });
			const repositories = await getRepositoriesByOrganization(organization);
			dispatch({
				type: "DONE_FETCHING_REPOSITORIES",
				repositories
			});
		} catch (error) {
			const { message } = error;
			Toaster.show({
				intent: "danger",
				icon: "warning-sign",
				message:
					message === "Request failed with status code 404"
						? "Organization not found. A typo, maybe?"
						: message
			});
			dispatch({
				type: "ERROR_FETCHING_REPOSITORIES",
				errors: [error]
			});
		}
	};
}

export function sortRepositories(criterion) {
	return (dispatch) => {
		dispatch({ type: "SORT_REPOSITORIES", criterion });
	};
}

// Reducer
const initialState = {
	loading: false,
	repositories: undefined,
	errors: undefined
};

export default function studio(state = initialState, action) {
	switch (action.type) {
		case "FETCHING_REPOSITORIES": {
			return {
				...state,
				loading: true
			};
		}

		case "DONE_FETCHING_REPOSITORIES": {
			const { repositories } = action;
			return {
				...state,
				repositories,
				loading: false
			};
		}

		case "ERROR_FETCHING_REPOSITORIES": {
			const { errors } = action;
			return {
				...state,
				loading: false,
				errors
			};
		}

		case "SORT_REPOSITORIES": {
			const { criterion } = action;
			const comparator = (a, b) => b[criterion] - a[criterion];
			const { repositories } = state;
			return {
				...state,
				repositories: sort(comparator, repositories)
			};
		}

		default:
			return state;
	}
}
