# grab the latest node image
FROM node:onbuild

# maintained by
MAINTAINER sepmein <sepmein@gmail.com>

# install pm2 first
RUN npm install -g bower

# define work directory
WORKDIR /root/app

# Copy the current files into container
# ADD cmd could perform the same function
# ADD could also grab from remote url
# remember to add a .dockerignore file to the source folder
COPY . .

# npm install dependencies
RUN ["npm","install"]
RUN ["bower","install"]
