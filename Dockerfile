FROM node:23-alpine3.21

RUN mkdir /usr/local/botgw
WORKDIR /usr/local/botgw
RUN npm init -y
RUN npm i @slack/bolt@3

COPY bot.js /usr/local/botgw/
COPY entrypoint.sh /

CMD ["node", "bot.js"]

ENTRYPOINT ["/entrypoint.sh"]
