// Dependencies
import axios from "axios";
import parse from "parse-link-header";
import { range, flatten } from "ramda";

// Constants
const GITHUB_BASE_URL = "https://api.github.com";
const API_TOKEN = "11ac6a83cc80e871f70ce8a2bc35d3db934df702";

// Wrapper for axios.get() with authorization header
const get = (url) => {
	return axios.get(url, {
		headers: {
			Authorization: `token ${API_TOKEN}`
		}
	});
};

// eslint-disable-next-line import/prefer-default-export
export async function getRepositoriesByOrganization(organization) {
	try {
		const repositories = await get(
			`${GITHUB_BASE_URL}/orgs/${organization}/repos`
		);
		let { data } = repositories;

		const { headers: { link } = {} } = repositories;
		const { last: { page: lastPage } = {} } = link ? parse(link) : {};
		if (lastPage) {
			/* 
            Builds an array with the numbers of pages still needed to build a full list of repositories
			We've already fetched the first page, so we start from page 2 (inclusive) and until the last page
			Provided as a Hypermedia link in the headers of the initial request
            Ramda's range function is end exclusive. Hence, we add 1 to the last page
            I do this instead of following the link to the next page after every call is to be able to parallalize the calls
            Making all the calls at once will reduce end-user wait time 
            */
			data = [
				...data,
				...flatten(
					await Promise.all(
						range(2, parseInt(lastPage, 10) + 1).map(async (pageNumber) => {
							const { data: paginatedData } = await get(
								`${GITHUB_BASE_URL}/orgs/${organization}/repos?page=${pageNumber}`
							);
							return paginatedData;
						})
					)
				)
			];
		}

		/*
        Number of contributors is not readily available through the Github API
        However, a seperate endpoint will return a paginated list of a repos contributors
        I make a single call to that endpoint with a items per page limit set to 1 
        And use the number of pages as the total number of contributors
        */
		return Promise.all(
			data.map(async (repository) => {
				const { contributors_url: contributorsUrl } = repository;
				const { headers: { link: contributorsLink } = {} } = await get(
					`${contributorsUrl}?per_page=1`
				);
				const { last: { page: contributors } = {} } = contributorsLink
					? parse(contributorsLink)
					: {};
				return {
					...repository,
					contributors: contributors || 1
				};
			})
		);
	} catch (error) {
		throw error;
	}
}
