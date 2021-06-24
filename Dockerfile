FROM node:alpine
RUN apk --no-cache add curl

RUN curl -L https://install.meilisearch.com | sh
RUN ls
RUN ls home
RUN ls bin
RUN ls var
RUN ls lib
CMD ["./meilisearch"]