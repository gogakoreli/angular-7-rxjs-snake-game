FROM node:10.14.2-alpine as builder

COPY . /app

WORKDIR /app

RUN npm install
RUN $(npm bin)/ng build


FROM nginx:1.14-alpine

COPY --from=builder /app/dist/* /usr/share/nginx/html/

EXPOSE 80
