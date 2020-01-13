---
layout: post
title: Deploying to Multiple AWS Accounts
description: Once you've configured the environments in your Serverless app across multiple AWS accounts, you'll want to deploy them. In this chapter, we look at how to create the AWS credentials and manage the environments using Seed.
date: 2019-09-30 00:00:00
comments_id: deploying-to-multiple-aws-accounts/1322
---

Now that you have a couple of AWS accounts created and your resources have been parameterized, let's look at how to deploy them. In this chapter, we'll deploy the following:

1. The [resources repo]({{ site.backend_ext_resources_github_repo }}) will be deployed in phases to the `dev` and `prod` stage. These two stages are configured in our `Development` and `Production` AWS accounts respectively.

2. Then we'll do the same with the [APIs repo]({{ site.backend_ext_api_github_repo }}).

### Configure AWS Profiles

Follow the [setup up IAM users]({% link _chapters/create-an-iam-user.md %}) chapter to create an IAM user in your `Development` AWS account. And take a note of the **Access key ID** and **Secret access key** for the user.

Next, set these credentials in your local machine using the AWS CLI:

``` bash
$ aws configure --profile default
```

This sets the default IAM credentials to those of the Development account. Meaning when you run `serverless deploy`, a service will get deployed into the Development account.

Repeat the step to create an IAM user in your `Production` account. And make a note of the credentials. We will not add the IAM credentials for the Production account on our local machine. This is because we do not want to be able to deploy code to the Production environment EVER from our local machine.

Production deployments should always go through our CI/CD pipeline.

Next we are going to deploy our two repos to our environments. We want you to follow along so you can get a really good sense of what the workflow is like.

So let's start by using the demo repo templates from GitHub.

### Create demo repos

Let's first create [the resources repo]({{ site.backend_ext_resources_github_repo }}). Click **Use this template**.

![Use demo resources repo template](/assets/best-practices/deploy-environments-to-multiple-aws-accounts/use-demo-resources-repo-template.png)

Enter Repository name **serverless-stack-demo-ext-resources** and click **Create repository from template**.

![Create demo resources repo on GitHub](/assets/best-practices/deploy-environments-to-multiple-aws-accounts/create-demo-resources-repo-on-github.png)

And do the same for [the API services repo]({{ site.backend_ext_api_github_repo }}).

![Create demo API services repo template](/assets/best-practices/deploy-environments-to-multiple-aws-accounts/use-demo-api-services-repo-template.png)

Enter Repository name **serverless-stack-demo-ext-api** and click **Create repository from template**.

![Create demo API services repo on GitHub](/assets/best-practices/deploy-environments-to-multiple-aws-accounts/create-demo-api-services-repo-on-github.png)

Now that we've forked these repos, let's deploy them to our environments. We are going to use [Seed](https://seed.run) to do this but you can set this up later with your favorite CI/CD tool.

## Deploy the Resources Repo

First, add the resources repo on Seed. If you haven't yet, you can create a free account [here](https://console.seed.run/signup).

Go in to your [Seed account](https://console.seed.run) and click **Add an App**, and select your Git provider.

![Select Add an App in Seed](/assets/best-practices/deploy-resources-repo-to-seed/select-add-an-app-in-seed.png)

After authenticating GitHub, search for the resources repo, and select it.

![Search for Git repository](/assets/best-practices/deploy-resources-repo-to-seed/search-for-git-repository.png)

Click **Select Repo**.

![Select Git repository to add](/assets/best-practices/deploy-resources-repo-to-seed/select-git-repository-to-add.png)

Seed will now automatically detect the Serverless services in the repo. After detection, select a service. Let's select the **auth** service. Then click **Add Service**.

![Select Serverless service to add](/assets/best-practices/deploy-resources-repo-to-seed/select-serverless-service-to-add.png)

By default, Seed lets you configure two stages out of the box, a **Development** and a **Production** stage. Serverless Framework has a concept of stages. They are synonymous with environments. Recall that in the previous chapter we used this stage name to parameterize our resource names.

Let's first configure the **Development** stage. Enter:
- **Stage Name**: dev
- **AWS IAM Access Key** and **AWS IAM Secret Key**: the IAM credentials of the IAM user you created in your **Development** AWS account above.

![Set dev stage IAM credentials](/assets/best-practices/deploy-resources-repo-to-seed/set-dev-stage-iam-credentials.png)

Next, let's configure the **Production** stage. Uncheck **Use the same IAM credentials as the dev stage** checkbox since we want to use a different AWS account for **Production**. Then enter:
- **Stage Name**: prod
- **AWS IAM Access Key** and **AWS IAM Secret Key**: the IAM credentials of the IAM user you created in your **Production** AWS account above.

Finally hit **Add a New App**.

![Create an App in Seed](/assets/best-practices/deploy-resources-repo-to-seed/create-an-app-in-seed.png)

Now, let's add the other services in the resources repo. Click **Add a Service**.

![Select Add a Service](/assets/best-practices/deploy-resources-repo-to-seed/select-add-a-service.png)

Enter the path to the **database** service `services/database`. Then hit **Search**.

![Set new service path](/assets/best-practices/deploy-resources-repo-to-seed/set-new-service-path.png)

Seed will search for the `serverless.yml` file in the path, to ensure you entered the right path. Hit **Add Service**.

![Search serverless.yml in new service](/assets/best-practices/deploy-resources-repo-to-seed/search-serverless.yml-in-new-service.png)

Now you have 2 services.

![Added a service in Seed](/assets/best-practices/deploy-resources-repo-to-seed/added-a-service-in-seed.png)

Repeat the process and add the **uploads** service in `services/uploads`.

![Added all services in Seed](/assets/best-practices/deploy-resources-repo-to-seed/added-all-services-in-seed.png)

Before we deploy, let's make sure the services will deploy in the desired order. Recall from the [Deploy a Serverless app with dependencies]({% link _chapters/deploy-a-serverless-app-with-dependencies.md %}) chapter that you can configure the phases by heading to the app settings.

![Select app settings in Seed](/assets/best-practices/deploy-resources-repo-to-seed/select-app-settings-in-seed.png)

Scroll down and select **Manage Deploy Phases**.

![Hit Manage Deploy Phases screenshot](/assets/best-practices/deploy-resources-repo-to-seed/hit-manage-deploy-phases-screenshot.png)

Here you'll notice that by default all the services are deployed concurrently.

![Default Deploy Phase screenshot](/assets/best-practices/deploy-resources-repo-to-seed/default-deploy-phase-screenshot.png)

Select **Add a phase** and move the **auth** service to **Phase 2**. And hit **Update Phases**.

![Edit Deploy Phase screenshot](/assets/best-practices/deploy-resources-repo-to-seed/edit-deploy-phase-screenshot.png)

Now let's make our first deployment. Click **Deploy** under the **dev** stage.

![Select Deploy in dev stage](/assets/best-practices/deploy-resources-repo-to-seed/select-deploy-in-dev-stage.png)

We are deploying the `master` branch here. Confirm this by clicking **Deploy**.

![Select master branch to deploy](/assets/best-practices/deploy-resources-repo-to-seed/select-master-branch-to-deploy.png)

You'll notice that all the services are being deployed.

![Show services are deploying in dev stage](/assets/best-practices/deploy-resources-repo-to-seed/show-services-are-deploying-in-dev-stage.png)

After all services are successfully deployed. Click the build **v1**.

![Select Build v1 in dev stage](/assets/best-practices/deploy-resources-repo-to-seed/select-build-v1-in-dev-stage.png)

You can see that the deployments are carried out in the order specified by the deploy phases.

![Deployed with Deploy Phase screenshot](/assets/best-practices/deploy-resources-repo-to-seed/deployed-with-deploy-phase-screenshot.png)

Go back to the app dashboard, and hit **Promote** to deploy this to the **prod** stage.

![Select Promote in dev stage](/assets/best-practices/deploy-resources-repo-to-seed/select-promote-in-dev-stage.png)

You will see a list of changes in resources. Since this is the first time we are deploying to the `prod` stage, the change list shows all the resources that will be created. We'll take a look at this in detail later in the [Promoting to production]({% link _chapters/promoting-to-production.md %}) chapter.

Click **Promote to Production**.

![Promote dev stage to prod stage](/assets/best-practices/deploy-resources-repo-to-seed/promote-dev-stage-to-prod-stage.png)

This will trigger the services to deploy in the same order we specified.

![Show services are deploying in prod stage](/assets/best-practices/deploy-resources-repo-to-seed/show-services-are-deploying-in-prod-stage.png)

Now our resources have been deployed to both **dev** and **prod**.

![Show services are deployed in prod stage](/assets/best-practices/deploy-resources-repo-to-seed/show-services-are-deployed-in-prod-stage.png)

Next, let's deploy our API services repo.

## Deploy the API Services Repo

Just as the previous chapter we'll add the API repo on Seed and deploy it to our environments.

Click **Add an App** again, and select your Git provider. This time, select the API repo.

![Select Add an App in Seed](/assets/best-practices/deploy-api-services-repo-to-seed/select-add-an-app-in-seed.png)

After detection, let's select the **notes-api** service.

![Select Serverless service to add](/assets/best-practices/deploy-api-services-repo-to-seed/select-serverless-service-to-add.png)

The environments for our API repo are identical to our resources repo. So instead of manually configuring them, we'll copy the settings.

Select **Copy Settings** tab, and select the resources app. Then hit **Add a New App**.

![Set app settings from resources](/assets/best-practices/deploy-api-services-repo-to-seed/set-app-settings-from-resources.png)

The API app has been created.

![Create an App in Seed](/assets/best-practices/deploy-api-services-repo-to-seed/create-an-app-in-seed.png)

Click **Add a service** to add the **billing-api** service at the `services/billing-api` path. And then repeat the step to add the **notify-job** service at the `services/notify-job` path.

![[Added all services in Seed](/assets/best-practices/deploy-api-services-repo-to-seed/[added-all-services-in-seed.png)

Head over to the app settings and click on **Manage Deploy Phases**.

![Hit Manage Deploy Phases screenshot](/assets/best-practices/deploy-api-services-repo-to-seed/hit-manage-deploy-phases-screenshot.png)

Again you'll notice that by default all the services are deployed concurrently.

![Default Deploy Phase screenshot](/assets/best-practices/deploy-api-services-repo-to-seed/default-deploy-phase-screenshot.png)

Since the **billing-api** service depends on the **notes-api** service, and in turn the **notify-job** service depends on the **billing-api** service, we are going too add 2 phases. And move the **billing-api** service to **Phase 2**, and the **notify-job** service to **Phase 3**. Finally, click **Update Phases**.

![Edit Deploy Phase screenshot](/assets/best-practices/deploy-api-services-repo-to-seed/edit-deploy-phase-screenshot.png)

Now let's make our first deployment.

![Show services are deploying in dev stage](/assets/best-practices/deploy-api-services-repo-to-seed/show-services-are-deploying-in-dev-stage.png)

You can see the deployments are carried out according to the deploy phases specified.

Just as before, promote **dev** to **prod**.

![Select Promote in dev stage](/assets/best-practices/deploy-api-services-repo-to-seed/select-promote-in-dev-stage.png)

Hit **Promote to Production**.

![Promote dev stage to prod stage](/assets/best-practices/deploy-api-services-repo-to-seed/promote-dev-stage-to-prod-stage.png)

Now we have the API deployed to both **dev** and **prod**.

![Show services are deployed in prod stage](/assets/best-practices/deploy-api-services-repo-to-seed/show-services-are-deployed-in-prod-stage.png)

Now that our entire app has been deployed, let's look at how we are sharing environment specific configs across our services.
