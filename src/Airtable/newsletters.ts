import axios from 'axios';
var airtable = require('airtable');

airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_PRIVATE_KEY,
});

interface Newsletter {
  title: string;
  description: string;
  date: string;
  markdownURL: string;
  iconURL: string;
  coverURL: string;
  permalink: string;
  alt: string;
}

export const getAirtableNewsletter = async (permalink: string) => {
  const newsletterIndex: Array<Newsletter> = await getAirtableNewsletters();
  const newsletter = newsletterIndex.find(n => n.permalink === permalink);
  if (!newsletter) return null;

  const markdown = await axios({
    method: 'get',
    url: `${encodeURI(newsletter.markdownURL)}`,
    headers: {},
  });

  return {
    ...newsletter,
    markdown: markdown.data,
  };
};

export const getAirtableNewsletters = (): Promise<Array<Newsletter>> => {
  const isGithubLink = `(?:https://github.com/sourced-dev/newsletters/blob/master/)(.+)`;

  return new Promise((resolve, reject) => {
    const airtableNewsletters = [];
    airtable
      .base('appqmbO7ZCmThvxS1')('Released')
      .select({
        // Selecting the first 3 records in Grid view:
        // maxRecords: 3,
        view: 'Grid view',
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          records.forEach(function (record) {
            airtableNewsletters.push(record);
          });
          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        async function done(err) {
          const newsletters = airtableNewsletters.map(newsletter => {
            let markdownURL = newsletter.get('Markdown URL');
            if (!markdownURL) throw new Error('Markdown has no URL!');
            const extractedGithubLink = markdownURL.match(isGithubLink);
            if (extractedGithubLink) {
              markdownURL = `https://raw.githubusercontent.com/sourced-dev/newsletters/master/${extractedGithubLink[1]}`;
            }

            return {
              title: newsletter.get('Title'),
              description: newsletter.get('Description'),
              date: newsletter.get('Date'),
              markdownURL: markdownURL,
              iconURL: newsletter.get('Icon URL'),
              coverURL: newsletter.get('Cover URL'),
              permalink: newsletter.get('Permalink'),
              alt: newsletter.get('Alt'),
            };
          });
          resolve(newsletters);
          if (err) {
            console.error(err);
            return;
          }
        },
      );
  });
};

export interface SubscriptionResponse {
  result: 'new' | 'exists' | 'error';
}

export interface CreateSubscriberOpts {
  email: string;
  source: string;
}

export const createSubscriberEntry = async (opts: CreateSubscriberOpts): Promise<SubscriptionResponse> => {
  console.log('Adding new subscriber:', opts.email, 'from', opts.source);
  return new Promise(async resolve => {
    try {
      let Airtable = require('airtable');
      let base = new Airtable({ apiKey: process.env.AIRTABLE_PRIVATE_KEY }).base('appqmbO7ZCmThvxS1');
      let currentDate = new Date();
      let emailFound = false;

      // Check if this email exists?
      await base('Subscribers')
        .select({
          view: 'Grid view',
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function (record) {
              if (record.get('Email') === opts.email) {
                resolve({ result: 'exists' });
                emailFound = true;
              }
            });
            if (!emailFound) fetchNextPage();
          },
          async function done(err) {
            if (err) {
              console.error(err);
              return;
            }
            if (!emailFound) {
              // Add email to airtable
              await base('Subscribers').create([
                {
                  fields: {
                    Email: opts.email,
                    'Date added': currentDate.toUTCString(),
                    'Subscription source': opts.source,
                  },
                },
              ]);

              resolve({ result: 'new' });
            }
          },
        );
    } catch (e) {
      console.log(e);
      resolve({ result: 'error' });
    }
  });
};
