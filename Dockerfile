FROM getmeili/meilisearch:v0.21.0-alpha.5
COPY . .
RUN npm install
RUN npm run build

RUN node ./dist/JobConfigurations/refreshMarketMap.js