---
layout: post
title: Set up the Serverless Framework
date: 2016-12-29 00:00:00
lang: en
id: setup-the-serverless-framework
description: To create our serverless backend API using AWS Lambda and API Gateway, we are going to use the Serverless Framework (https://serverless.com). Serverless Framework helps developers build and manage serverless apps on AWS and other cloud providers. We can install the Serverless Framework CLI from it’s NPM package and use it to create a new Serverless Framework project.
comments_id: set-up-the-serverless-framework/145
---

We are going to be using [AWS Lambda](https://aws.amazon.com/lambda/) and [Amazon API Gateway](https://aws.amazon.com/api-gateway/) to create our backend. AWS Lambda is a compute service that lets you run code without provisioning or managing servers. You pay only for the compute time you consume - there is no charge when your code is not running. And API Gateway makes it easy for developers to create, publish, maintain, monitor, and secure APIs. Working directly with AWS Lambda and configuring API Gateway can be a bit cumbersome; so we are going to use the [Serverless Framework](https://serverless.com) to help us with it.

The Serverless Framework enables developers to deploy backend applications as independent functions that will be deployed to AWS Lambda. It also configures AWS Lambda to run your code in response to HTTP requests using Amazon API Gateway.

In this chapter, we are going to set up the Serverless Framework on our local development environment.

### Install Serverless

<img class="code-marker" src="/assets/s.png" />Install Serverless globally.

``` bash
$ npm install serverless -g
```

The above command needs [NPM](https://www.npmjs.com), a package manager for JavaScript. Follow [this](https://docs.npmjs.com/getting-started/installing-node) if you need help installing NPM.

<img class="code-marker" src="/assets/s.png" />In your working directory; create a project using a Node.js starter. We'll go over some of the details of this starter project in the next chapter.

<!-- TODO: Update to create own serverless-starter based on typescript, and update serverless-bundle. For the time being not the extra steps doing it with the typescript template provided by serverless framework. -->

<!-- ``` bash
$ serverless install --url https://github.com/AnomalyInnovations/serverless-nodejs-starter --name notes-app-api
``` -->

``` bash
$ mkdir notes-app-api && cd notes-app-api && serverless create --template aws-nodejs-typescript
```

<img class="code-marker" src="/assets/s.png" />Go into the directory for our backend api project.

``` bash
$ cd notes-app-api
```

Now the directory should contain a few files including, the **handler.ts** and **serverless.yml**.

- **handler.ts** file contains actual code for the services/functions that will be deployed to AWS Lambda.
- **serverless.yml** file contains the configuration on what AWS services Serverless will provision and how to configure them.

We also have a `tests/` directory where we can add our unit tests.

Currently `__tests__/` need to be created for Typescript manually and [setup](https://serverless.com/blog/unit-testing-nodejs-serverless-jest/) unit testing with Jest for serverless.

``` bash
$ mkdir __tests__/
$ npm install --save-dev jest @types/jest ts-jest
```


### Install Node.js packages

The starter project relies on a few dependencies that are listed in the `package.json`.

<img class="code-marker" src="/assets/s.png" />At the root of the project, run.

``` bash
$ npm install
```

<img class="code-marker" src="/assets/s.png" />Next, we'll install a couple of other packages specifically for our backend.

``` bash
$ npm install aws-sdk --save-dev
$ npm install uuid --save
```

- **aws-sdk** allows us to talk to the various AWS services.
- **uuid** generates unique ids. We need this for storing things to DynamoDB.

The starter project that we are using allows us to use the version of JavaScript that we'll be using in our frontend app later. Let's look at exactly how it does this.


## Add Support for ES6/ES7 JavaScript

<!-- TODO: Migrate this section to my own typescript starter after it is created. -->

AWS Lambda recently added support for Node.js v8.10 and v10.x. The supported syntax is a little different when compared to the frontend React app we'll be working on a little later. It makes sense to use similar ES features across both parts of the project – specifically, we'll be relying on ES imports/exports in our handler functions. To do this we will be transpiling our code using [Babel](https://babeljs.io) and [Webpack 4](https://webpack.github.io). Also, Webpack allows us to generate optimized packages for our Lambda functions by only including the code that is used in our function. This helps keep our packages small and reduces cold start times. Serverless Framework supports plugins to do this automatically. We are going to use an extension of the popular [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) plugin, [serverless-bundle](https://github.com/AnomalyInnovations/serverless-bundle).

All this has been added in the previous chapter using the [`serverless-nodejs-starter`]({% link _chapters/serverless-nodejs-starter.md %}). We created this starter for a couple of reasons:

- Generate optimized packages for our Lambda functions
- Use a similar version of JavaScript in the frontend and backend
- Ensure transpiled code still has the right line numbers for error messages
- Lint our code and add support for unit tests
- Allow you to run your backend API locally
- Not have to manage any Webpack or Babel configs

If you recall we installed this starter using the `serverless install --url https://github.com/AnomalyInnovations/serverless-nodejs-starter --name my-project` command. This is telling Serverless Framework to use the [starter](https://github.com/AnomalyInnovations/serverless-nodejs-starter) as a template to create our project.

In this chapter, let's quickly go over how it's doing this so you'll be able to make changes in the future if you need to.

### Serverless Webpack

The transpiling process of converting our ES code to Node v10.x JavaScript is done by the `serverless-bundle` plugin. This plugin was added in our `serverless.yml`.

<img class="code-marker" src="/assets/s.png" />Open `serverless.yml` and replace the default with the following.

``` yaml
service: notes-app-api

# Create an optimized package for our functions
package:
  individually: true

plugins:
  - serverless-bundle # Package our functions with Webpack
  - serverless-offline
  - serverless-dotenv-plugin # Load .env as environment variables

provider:
  name: aws
  runtime: nodejs10.x
  stage: prod
  region: us-east-1
```

The `service` option is pretty important. We are calling our service the `notes-app-api`. Serverless Framework creates your stack on AWS using this as the name. This means that if you change the name and deploy your project, it will create a completely new project.

You'll notice the plugins — `serverless-bundle`, `serverless-offline`, and `serverless-dotenv-plugin`, that we have included. The first plugin we talked about above, while the [serverless-offline](https://github.com/dherault/serverless-offline) is helpful for local development and [serverless-dotenv-plugin](https://github.com/colynb/serverless-dotenv-plugin) that we'll use later loads the `.env` files as Lambda environment variables.

We are also using this option:

``` yml
# Create an optimized package for our functions
package:
  individually: true
```

By default, Serverless Framework creates one large package for all the Lambda functions in your app. Large Lambda function packages can cause longer cold starts. By setting `individually: true`, we are telling Serverless Framework to create a single package per Lambda function. This in combination with serverless-bundle (and Webpack) will generate optimized packages. Note that, this'll slow down our builds but the performance benefit is well worth it.

Now we are ready to write our backend code. But before that, let's create a GitHub repo to store our code.

