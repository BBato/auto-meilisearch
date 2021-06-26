FROM amd64/node:12
RUN curl -L https://install.meilisearch.com | sh
CMD ./meilisearch --http-addr 127.0.0.1:$PORT