FROM amd64/node:12
RUN curl -L https://install.meilisearch.com | sh
EXPOSE 7700
CMD ["./meilisearch"]