import { dbConnect, ToolMongooseModel, getAirtableTools, getTopRepositoriesByGithubURL } from '../index';
import MeiliSearch from 'meilisearch';
import { v4 as uuidv4 } from 'uuid';

export const refreshMarketMap = async () => {
  try {
    // Generate update UID
    const updateId: string = uuidv4();

    // Establish connection to MongoDB
    await dbConnect();

    // Read current set of tools from Mongo
    const existingTools = await ToolMongooseModel.find({});

    // Read up-to-date tool data from Airtable
    let airtableTools: Array<any> = await getAirtableTools(false);
    const meilisearchTools = [];

    console.log(`[Mongo] Saving new and updated tools: ${airtableTools.length}`);

    await Promise.all(
      airtableTools.map(async (obj, index) => {
        await new Promise(resolve => setTimeout(resolve, index * 200));

        let updatedTool = existingTools.find(existing => existing.permalink === obj.permalink);

        if (updatedTool) {
          console.log(`=> Updating tool - ${updatedTool.permalink}`);
          Object.keys(obj).forEach(key => {
            updatedTool[key] = obj[key];
          });
        } else {
          console.log(`=> Saving new tool - ${obj.permalink}`);
          updatedTool = new ToolMongooseModel(obj);
        }

        updatedTool.updateId = updateId;

        if (!updatedTool.githubRepositories) {
          // || updatedTool.githubRepositories.length === 0
          if (updatedTool.githubURL && updatedTool.githubURL !== '') {
            console.log('Retrieving Github repositories...');
            updatedTool.githubRepositories = await getTopRepositoriesByGithubURL(updatedTool.githubURL);
          }
        } else {
          console.log('Found existing repositories.');
        }
        await updatedTool.save();

        // Pass selected properties to meilisearch
        meilisearchTools.push({
          id: updatedTool._id,
          permalink: updatedTool.permalink,
          companyName: updatedTool.companyName,
          website: updatedTool.website,
          categories: updatedTool.categories,
          shortDescription: updatedTool.shortDescription,
          longDescription: updatedTool.longDescription,
          githubURL: updatedTool.githubURL,
          twitterURL: updatedTool.twitterURL,
          linkedinURL: updatedTool.linkedinURL,
          docsURL: updatedTool.docsURL,
          logoURL: updatedTool.logoURL,
          priority: updatedTool.newTool ? 1 : 0,
          newTool: updatedTool.newTool,
        });
      }),
    );

    // Delete all un-updated tools in Mongo
    console.log('[Mongo] Clearing unreferenced tools');
    await ToolMongooseModel.deleteMany({ updateId: { $not: { $eq: updateId } } });

    console.log('[Meilisearch] Initializing index');
    const client = new MeiliSearch({
      host: process.env.NEXT_PUBLIC_MEILI_HOST_URL,
      apiKey: process.env.MEILI_PRIVATE_KEY,
    });

    // Prepare index
    const toolsIndex = client.index('tools');
    await toolsIndex.updateDocuments([], { primaryKey: 'id' });

    // Clear Meilisearch Index
    console.log('[Meilisearch] Clearing tools index');
    toolsIndex.deleteAllDocuments();

    console.log('[Meilisearch] Uploading new documents');
    await toolsIndex.updateDocuments(meilisearchTools, { primaryKey: 'id' });

    console.log('[Meilisearch] Updating attributes for faceting');
    await toolsIndex.updateAttributesForFaceting(['categories']);

    console.log('[Meilisearch] Updating ranking rules');
    await toolsIndex.updateRankingRules([
      "typo",
      "words",
      "proximity",
      "attribute",
      "wordsPosition",
      "exactness",
      "desc(priority)"
    ])
  } catch (e) {
    console.error(e);
  }
};
