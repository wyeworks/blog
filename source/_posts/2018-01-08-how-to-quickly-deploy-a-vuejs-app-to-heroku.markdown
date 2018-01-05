---
layout: post
title: "How to quickly deploy a VueJS app to Heroku"
category: javascript
comments: true
author:
  name: Jorge Bejar
  email: jorge@wyeworks.com
  twitter_handle: jmbejar
  github_handle: jmbejar
  image: /images/team/jorge-bejar.jpg
  description: Love to explore and write about Ruby, Javascript, full-stack development and technology in general.
---

Recently, I was investing some time learning VueJS and I found that it is a very interesting framework to play with. In fact, I've been working on a new project prototype during a few days and wanted to show it to some people, so I wanted to publish it anywhere in the Internet.

I decided to put the project on Heroku so I started to research what is the best way to do that. To my surprise, I didn't find much about it apart from a few posts like [this](https://codeburst.io/quick-n-clean-way-to-deploy-vue-webpack-apps-on-heroku-b522d3904bc8) and [this](https://medium.com/netscape/deploying-a-vue-js-2-x-app-to-heroku-in-5-steps-tutorial-a69845ace489). 

<!-- more -->

Assuming that a Heroku account is already created and the VueJS project already exists, the approach explained in those articles could be sumarized in the following steps:

* Write a minimal NodeJS web server using Express
* Build the assets locally
* Add the `dist` folder to the Git repository, so it is included when pushing to Heroku

What I didn’t like of this solution was the need to build locally the site and check in the changes within the `dist` folder. I wanted to have this step handled by Heroku when pushing a new version of my application.

## Our solution
Let's assume we have a VueJS project generated using `vue-cli` with the `webpack` template. Just to be clear, the project was created using the following command:

```bash
vue init webpack <YOUR-PROJECT-NAME-HERE>
``` 

Of course, we also need a Heroku account and a new application created there. Heroku will use the NodeJS buildpack because our project contains a `package.json` in the root folder.

### Step 1: Add a minimal NodeJS server

This is a step borrowed from the mentioned blog posts. We have to add a `server.js` file in the project’s root folder with the following code:

```js
const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

let app = express();
app.use(serveStatic(__dirname + "/dist"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port ' + port)
});
```

Since this code uses Express, we need to add this dependency to our project:

```bash
npm install express --save
```

You can test this server locally by running the following commands:

```bash
npm run build
node server.js
```

### Step 2: Setup package.json scripts

We need to tweak the `scripts` section in the `package.json`. If package file provided by the Vue Webpack template was not modified, it should include two important tasks, `start` and `build`:

```json
"scripts": {
  ...
  "start": "npm run dev",
  ...
  "build": "node build/build.js"
},
```

By default, the `start` script will be executed by Heroku to start the server. For this reason, we will change the command associated to `start` to run our custom server script:

```json
"scripts": {
  ...
  "start": "node server.js",
  ...
},
```

Please note you can not use `npm run start` anymore to run the development server in your computer. I just decided to use `npm run dev` directly but you could add a new entry in the `scripts` section with an alias for that.

Now, we have to add something to make sure that the `dist` folder is built in our Heroku instance, once the code is deployed there. Otherwise, the server script is not going to work properly. We will use an special script called `heroku-postbuild` which is documented [here](https://devcenter.heroku.com/articles/nodejs-support#heroku-specific-build-steps). The idea is to build the site using this special hook, so let’s add it to our `package.json`:

```json
"scripts": {
  ...
  "heroku-postbuild": "npm install --only=dev --no-shrinkwrap && npm run build",
},
```

Let’s explain a bit the command. First of all, we need to install the dependencies that are used to build the assets. In a VueJS project created with the Webpack template, all the needed dependencies are in `devDependencies`, so we have to add the  `--only=dev` option.

The `—no-shrinkwrap` option is used to avoid possible conflicts with the packages installed by Heroku during the installation process (where the production dependencies were installed). However, it could be an unnecessary option in most cases.

And, of course, we are running `npm run build` to actually build the site before the server is started.

### Step 3: Try it and enjoy!

We're now ready to deploy to Heroku. Assuming we already have a Git repository, we need to add the Heroku remote repo:

```bash
heroku git:remote -a <YOUR-HEROKU-APP-NAME-HERE>
```

And the command to deploy our application is:

```bash
git push heroku master
```

It will push the code, trigger the build steps and start the NodeJS script that will serve our site made with VueJS

## Discussion

There might be some discussion around the decision of having a build step in Heroku instead of checking in the `dist` folder. Building the site locally would lead to a less complicated Heroku setup because we can just assume that the `dist` folder is there all the time. However, having the `dist` folder in our Git repository does not seem a good practice because it will make harder to read commit changes and deal with merge conflicts. Also, it will require some effort and discipline from every developer in the team to keep the right built version of the assets in the repository. For all these reasons, we prefer to build the site as a automated step into the deployment process.

Speaking of the `heroku-postbuild` hook, some people is actually using `post-install` which seems to also work on Heroku. The purpose of this npm hook is to be invoked when a package is installed and I think it should be used in the context of the library project, not in an application project. I'd rather use the most specific hook provided by Heroku.

Regarding the need to run `npm install` in the `heroku-postbuild`  hook to install our `devDependencies`, we could comment a few available alternatives to solve the problem:

### Do not use `devDependencies` 

The simplest approach would be to move everything to `dependencies` and do not use `devDependencies` at all.
In fact, I was comparing the process to deploy a React project created with [create-react-app]([GitHub - facebookincubator/create-react-app: Create React apps with no build configuration.](https://github.com/facebookincubator/create-react-app)) to Heroku and I realized that all the scripts and dependencies needed to build the site are actually in the `dependencies` section. This is what you find in the `package.json` file in such cases (the `react-scripts` package contains all the dependencies used to build the site):

```json
  "dependencies": {
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-scripts": "1.0.17"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    ...
  }
```

Note that there is no `devDependencies` there. Therefore, it is safe to just run `npm run build` in the `heroku-postbuild` hook, since all the necessary packages to build the site were already installed at that point by the default deployment process in Heroku.

In any case, I think it is a good practice to keep dependencies well-organized in both categories, `dependencies` and `depDependencies`. As a consequence, we opted for the inclusion of the additional `npm install` in the `heroku-postbuild` hook step instead of changing the default configuration provided by `vue-cli`.

### Set NPM_CONFIG_PRODUCTION to false

Setting the environment variable `NPM_CONFIG_PRODUCTION` to `false` causes that packages from `devDependencies` will also be installed by default in the deployment process in Heroku. The default value is `true` because the most common case would be to install only the items from the`dependencies` list.

It would be a valid solution to tweak this value and have the `heroku-postbuild` script just running `npm run build`.  Even so, note this change also affects the value of `NODE_ENV` as explained [here](https://devcenter.heroku.com/articles/nodejs-support#configuring-npm) . There is a chance that it could cause some side-effect in the build process but this is unlikely to happen using the default Webpack configuration for VueJS projects, as far I can tell.

<div style="width:100%;height:0;padding-bottom:71%;position:relative;"><iframe src="https://giphy.com/embed/7yojoQtevjOCI" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/profile-notoverthehill-tomdds-7yojoQtevjOCI">via GIPHY</a></p>

Hope you find this post useful and have your VueJS project finally deployed to Heroku! If you have any problem following the steps please leave a comment so we can find a solution together and improve this article.
