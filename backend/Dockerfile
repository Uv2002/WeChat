FROM node:latest

WORKDIR /server

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
EXPOSE 5000

CMD ["/bin/bash"]