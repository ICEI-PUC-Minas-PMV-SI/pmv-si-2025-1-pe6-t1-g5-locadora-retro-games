# Pull base image
FROM node:18-alpine

# Set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# Default to port 19006 for node, and 19001 and 19002 (tests) for debug
ARG PORT=19006
ENV PORT $PORT
EXPOSE 19006 19001 19002

# Add in your own IP that was assigned by your local machine network
# This should be your local Wi-Fi IP address
ENV REACT_NATIVE_PACKAGER_HOSTNAME="192.168.1.130"

# Install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH

# Update package list and install required packages
RUN apk add --no-cache \
    git \
    bash \
    curl

# Install global packages
RUN npm install -g @expo/cli@latest

# We need to install this in order to start a tunnel on the docker container
RUN npm install -g @expo/ngrok

# Install dependencies first, in a different location for easier app bind mounting for local development
# Due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/app && chown node:node /opt/app
WORKDIR /opt/app

# Set correct permissions for node user
USER node

# Copy package files
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm install

# Copy in our source code last, as it changes the most
COPY --chown=node:node . .

# Create expo directory in user home
RUN mkdir -p /home/node/.expo

# Expose metro bundler port
EXPOSE 8081

# Start expo
CMD ["npx", "expo", "start", "--tunnel"]
