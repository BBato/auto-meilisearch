FROM node:alpine

RUN curl -L https://install.meilisearch.com | sh
CMD ["./meilisearch"]