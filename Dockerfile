FROM node:12-alpine

ENV TZ=Asia/Shanghai

WORKDIR /question

COPY . .

EXPOSE 80

CMD ["node","question.js"]
