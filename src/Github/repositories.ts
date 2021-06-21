import axios, { AxiosRequestConfig } from 'axios';

export const getTopRepositoriesByGithubURL = async (githubURL: String) => {
  if (!githubURL || githubURL === '') return;
  return new Promise(async (resolve, reject) => {
    const githubHandle = githubURL.match(/(?:https?\:\/\/)?(?:www\.)?github\.com\/([^\/]+)/)?.[1];
    if (!githubHandle) resolve([]);

    const config: AxiosRequestConfig = {
      method: 'get',
      url: `https://api.github.com/orgs/${githubHandle}/repos?type=public&per_page=100`,
      headers: {
        Authorization: `Basic ${process.env.GITHUB_TOKEN}`,
      },
    };

    try {
      const response = await axios(config);
      if (!response.data) resolve([]);

      const simplifiedRepositories = response.data.map(o => {
        return {
          name: o.name,
          description: o.description,
          stargazers_count: o.stargazers_count,
        };
      });

      // Sort each array of repos by stargazers
      const sortedRepositories = simplifiedRepositories.sort((a, b) => b.stargazers_count - a.stargazers_count);

      // Get top six (or if less than six, that amount)
      const topRepositories = sortedRepositories?.slice(0, 6) || [];

      resolve(topRepositories);
    } catch (e) {
      console.log(`Could not locate github repositories from ${githubHandle}: ${e?.response?.status || e}`);
      resolve([]);
    }
  });
};
