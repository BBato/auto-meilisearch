FROM getmeili/meilisearch:v0.21.0-alpha.5
COPY . .
RUN yarn install --pure-lockfile --non-interactive
RUN yarn build

RUN node ./dist/JobConfigurations/refreshMarketMap.js