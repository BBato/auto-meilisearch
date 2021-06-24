FROM amd64/node:12
RUN curl -L https://install.meilisearch.com | sh
CMD ["./meilisearch"]