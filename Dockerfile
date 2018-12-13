FROM node:10.14.2-alpine as builder

COPY . /snake

WORKDIR /snake

RUN npm install
RUN $(npm bin)/ng build


FROM nginx:1.14-alpine

COPY --from=builder /snake/dist/* /usr/share/nginx/html/

EXPOSE 80
