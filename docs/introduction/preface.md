---
id: preface
title: Preface
---
import useBaseUrl from '@docusaurus/useBaseUrl';

## Who Is This Guide For

This guide is meant for full-stack developers or developers that would like to build full stack serverless applications **in an enterprise setting**. An enterprise setting requires the long term maintenance of the codebase as well as the adoption to regulatory requirements. By providing a step-by-step guide for both the frontend and the backend we hope that it addresses all the different aspects of building serverless applications in those settings.

We use JavaScript (Typescript) for now. It is beneficial as a full-stack developer to use a single language (JavaScript) and environment (Node.js) to build your entire application.

## What Does This Guide Cover

<!-- TODO: **This fork uses Typescript instead of Javascript. As well as adding clean code & charictecture practices. Incuding Test driven development.** -->

To step through the major concepts involved in building web applications, we are going to be building a simple note taking app called [**Scratch**](https://demo2.serverless-stack.com).

<img alt="Completed app desktop screenshot" src={useBaseUrl('/assets/completed-app-desktop.png')} />

It is a single page application powered by a serverless API written completely in Typescript. Here is the complete source for the [backend](https://github.com/d10lde/serverless-stack-api) and the [frontend](https://github.com/denseidel/serverless-stack-client). It is a relatively simple application but we are going to address the following requirements.

- Should allow users to signup and login to their accounts
- Users should be able to create notes with some content
- Each note can also have an uploaded file as an attachment
- Allow users to modify their note and the attachment
- Users can also delete their notes
- The app should be able to process credit card payments
- App should be served over HTTPS on a custom domain
- The backend APIs need to be secure
- The app needs to be responsive

We'll be using the AWS Platform to build it. Further we look at the following non-functional requirements:

- Clean Code Characteristics & Best Practices (Simplicity, Modularity, Test Driven Developpment)
- Cloud Portability
- Extensibility - technologies need to be extensible e.g. due to changes in regulartory requirements / as well as we want to understand the basics not frameworks to improve understanding of the technology in the guide

### Technologies & Services

We'll be using the following set of technologies and services to build our serverless application.

- [Lambda][Lambda] & [API Gateway][APIG] for our serverless API
- [DynamoDB][DynamoDB] for our database
- [Cognito][Cognito] for user authentication and securing our APIs
- [S3][S3] for hosting our app and file uploads
- [CloudFront][CF] for serving out our app
- [Route 53][R53] for our domain
- [Certificate Manager][CM] for SSL
- [React.js][React] for our single page app
- [React Router][RR] for routing
- [Bootstrap][Bootstrap] for the UI Kit
- [Stripe][Stripe] for processing credit card payments
- [GitHub][GitHub] for hosting our project repos and automating deployments.

> We are going to be using the **free tiers** for the above services. So you should be able to sign up for them for free. This of course does not apply to purchasing a new domain to host your app. Also for AWS, you are required to put in a credit card while creating an account. So if you happen to be creating resources above and beyond what we cover in this tutorial, you might end up getting charged.

While the list above might look daunting, we are trying to ensure that upon completing the guide you'll be ready to build **real-world**, **secure**, and **fully-functional** web apps.

### Requirements

You just need a couple of things to work through this guide:

<!-- TODO: Add Typescript, Jest or later? -->

- [Node v8.10+ and NPM v5.5+](https://nodejs.org/en/) installed on your machine.
- A free [GitHub account](https://github.com/join).
- And basic knowledge of how to use the command line.

### How This Guide Is Structured

The guide is split roughly into a couple of parts:

1. **The Basics**

   Create your first full-stack Serverless application. These chapters are roughly split up between the backend (Serverless) and the frontend (React). We also talk about how to deploy your serverless app and React app into production.

   This section of the guide is carefully designed to be completed in its entirety. We go into all the steps in detail and have tons of screenshots to help you build your first app.

2. **The Best Practices**

   <!-- TODO: Add migration to Azure and GCP as a section. -->
   We cover the best practices of running production applications. These really begin to matter once your application codebase grows or when you add more folks to your team.

   The chapters in this section are relatively standalone and tend to revolve around specific topics.

3. **Reference**

   Finally, we have a collection of standalone chapters on various topics. We either refer to these in the guide or we use this to cover topics that don't necessarily belong to either of the two above sections.

[Cognito]: https://aws.amazon.com/cognito/
[CM]: https://aws.amazon.com/certificate-manager
[R53]: https://aws.amazon.com/route53/
[CF]: https://aws.amazon.com/cloudfront/
[S3]: https://aws.amazon.com/s3/
[Bootstrap]: http://getbootstrap.com
[RR]: https://github.com/ReactTraining/react-router
[React]: https://facebook.github.io/react/
[DynamoDB]: https://aws.amazon.com/dynamodb/
[APIG]: https://aws.amazon.com/api-gateway/
[Lambda]: https://aws.amazon.com/lambda/
[Stripe]: https://stripe.com
[GitHub]: https://github.com
