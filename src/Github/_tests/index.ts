import { getTopRepositoriesByGithubURL } from '../repositories';

(async () => {
  const response = await getTopRepositoriesByGithubURL('https://github.com/Airtable');
  console.log(JSON.stringify(response));
})();
