FROM node:23.9.0
WORKDIR /app
COPY . /app
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
