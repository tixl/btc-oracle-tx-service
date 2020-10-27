FROM node:12
ARG GITHUB_TOKEN
WORKDIR /usr/src/app
ADD package.json yarn.lock ./
RUN echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> ~/.npmrc
RUN echo '"@tixl:registry" "https://npm.pkg.github.com/"' >> .yarnrc

RUN yarn --pure-lockfile
RUN rm -f ~/.npmrc
RUN rm -f .yarnrc

ADD tsconfig.json ./
ADD src ./src
ADD typings ./typings
RUN yarn build
RUN mkdir lib/tmp
RUN mkdir tmp
CMD yarn start
