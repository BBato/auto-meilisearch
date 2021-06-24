FROM node:alpine
RUN apk --no-cache add curl

RUN curl -L https://install.meilisearch.com | sh

CMD ["/meilisearch"]