FROM node:alpine

RUN curl -L https://install.meilisearch.com | sh
RUN ls home
RUN ls bin
CMD ["./meilisearch"]