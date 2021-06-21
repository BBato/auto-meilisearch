FROM getmeili/meilisearch:v0.21.0-alpha.5
COPY . .
RUN node app.js
