var airtable = require('airtable');
airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_PRIVATE_KEY,
});

export const getAirtableTools = (featured: Boolean): Promise<Array<any>> => {
  return new Promise((resolve, reject) => {
    const airtableTools = [];
    airtable
      .base('appWncmqE0t1QIgX4')(featured ? 'Featured' : 'Companies')
      .select({
        // Selecting the first 3 records in Grid view:
        // maxRecords: 3,
        view: 'Grid view',
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          records.forEach(function(record) {
            airtableTools.push(record);
          });
          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        async function done(err) {
          const tools = airtableTools.map(record => {
            let extractedLogo = record.get('logoURL');
            if (extractedLogo?.length > 0) {
              extractedLogo = extractedLogo[0];
            } else {
              extractedLogo = '';
            }

            return {
              companyName: record.get('Company Name'),
              permalink: record.get('Permalink'),
              website: record.get('Website') || '',
              categories: record.get('Categories') || [],
              shortDescription: record.get('Short Description'),
              longDescription: record.get('Long Description') || '',
              githubURL: record.get('Github') || '',
              twitterURL: record.get('Twitter') || '',
              linkedinURL: record.get('Linkedin') || '',
              docsURL: record.get('Docs') || '',
              logoURL: extractedLogo,
              newTool: !!record.get('New'),
              // stars: record.get('Stars'),
              // funding: record.get('Funding'),
              // marketCap: record.get('Market Cap'),
              // other: record.get('Other'),
              // stage: record.get('Stage'),
            };
          });
          resolve(tools);

          if (err) {
            console.error(err);
            return;
          }
        },
      );
  });
};

export const addToolSubmission = async ({ email, name, url, category, description }): Promise<boolean> => {
  console.log('Adding new tool submission:', JSON.stringify({ email, name, url, category, description }));

  return new Promise(async resolve => {
    try {
      let Airtable = require('airtable');
      let base = new Airtable({ apiKey: process.env.AIRTABLE_PRIVATE_KEY }).base('appWncmqE0t1QIgX4');
      let currentDate = new Date();
      // Add email to airtable
      await base('Submissions').create([
        {
          fields: {
            Name: name,
            Added: currentDate.toUTCString(),
            URL: url,
            Category: category,
            Description: description,
            Email: email,
          },
        },
      ]);
      resolve(true);
    } catch (e) {
      console.error(e);
      resolve(false);
    }
  });
};
