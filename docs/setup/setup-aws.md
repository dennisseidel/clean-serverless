---
id: setup-aws
title: Setup AWS
---

## Create an AWS Account

Let's first get started by creating an AWS (Amazon Web Services) account. Of course you can skip this if you already have one. Head over to the [AWS homepage](https://aws.amazon.com) and hit the **Create a Free Account** and follow the steps to create your account.

![Create an aws account Screenshot](/assets/create-an-aws-account.png)

Next let's configure your account so it's ready to be used for the rest of our guide.

## Create an IAM User

Amazon IAM (Identity and Access Management) enables you to manage users and user permissions in AWS. You can create one or more IAM users in your AWS account. You might create an IAM user for someone who needs access to your AWS console, or when you have a new application that needs to make API calls to AWS. This is to add an extra layer of security to your AWS account.

In this chapter, we are going to create a new IAM user for a couple of the AWS related tools we are going to be using later.

### Create User

First, log in to your [AWS Console](https://console.aws.amazon.com) and select IAM from the list of services.

![Select IAM Service Screenshot](/assets/iam-user/select-iam-service.png)

Select **Users**.

![Select IAM Users Screenshot](/assets/iam-user/select-iam-users.png)

Select **Add User**.

![Add IAM User Screenshot](/assets/iam-user/add-iam-user.png)

Enter a **User name** and check **Programmatic access**, then select **Next: Permissions**.

This account will be used by our [AWS CLI](https://aws.amazon.com/cli/) and [Serverless Framework](https://serverless.com). They'll be connecting to the AWS API directly and will not be using the Management Console.

![Fill in IAM User Info Screenshot](/assets/iam-user/fill-in-iam-user-info.png)

Select **Attach existing policies directly**.

![Add IAM User Policy Screenshot](/assets/iam-user/add-iam-user-policy.png)

Search for **AdministratorAccess** and select the policy, then select **Next: Tags**.

We can provide a more fine-grained policy here and we cover this later in the [Customize the Serverless IAM Policy]({% link _chapters/customize-the-serverless-iam-policy.md %}) chapter. But for now, let's continue with this.

![Added Admin Policy Screenshot](/assets/iam-user/added-admin-policy.png)

We can optionally add some info to our IAM user. But we'll skip this for now. Click **Next: Review**.

![Skip IAM tags Screenshot](/assets/iam-user/skip-iam-tags.png)

Select **Create user**.

![Reivew IAM User Screenshot](/assets/iam-user/review-iam-user.png)

Select **Show** to reveal **Secret access key**.

![Added IAM User Screenshot](/assets/iam-user/added-iam-user.png)

Take a note of the **Access key ID** and **Secret access key**. We will be needing this later.

![IAM User Credentials Screenshot](/assets/iam-user/iam-user-credentials.png)

The concept of IAM pops up very frequently when working with AWS services. So it is worth taking a better look at what IAM is and how it can help us secure our serverless setup.

## What is IAM

In the last chapter, we created an IAM user so that our AWS CLI can operate on our account without using the AWS Console. But the IAM concept is used very frequently when dealing with security for AWS services, so it is worth understanding it in a bit more detail. Unfortunately, IAM is made up of a lot of different parts and it can be very confusing for folks that first come across it. In this chapter we are going to take a look at IAM and its concepts in a bit more detail.

Let's start with the official definition of IAM.

> AWS Identity and Access Management (IAM) is a web service that helps you securely control access to AWS resources for your users. You use IAM to control who can use your AWS resources (authentication) and what resources they can use and in what ways (authorization).

The first thing to notice here is that IAM is a service just like all the other services that AWS has. But in some ways it helps bring them all together in a secure way. IAM is made up of a few different parts, so let's start by looking at the first and most basic one.

### What is an IAM User

When you first create an AWS account, you are the root user. The email address and password you used to create the account is called your root account credentials. You can use them to sign in to the AWS Management Console. When you do, you have complete, unrestricted access to all resources in your AWS account, including access to your billing information and the ability to change your password.

![IAM Root user diagram](/assets/iam/iam-root-user.png)

Though it is not a good practice to regularly access your account with this level of access, it is not a problem when you are the only person who works in your account. However, when another person needs to access and manage your AWS account, you definitely don't want to give out your root credentials. Instead you create an IAM user.

An IAM user consists of a name, a password to sign into the AWS Management Console, and up to two access keys that can be used with the API or CLI.

![IAM user diagram](/assets/iam/iam-user.png)

By default, users can't access anything in your account. You grant permissions to a user by creating a policy and attaching the policy to the user. You can grant one or more of these policies to restrict what the user can and cannot access.

### What is an IAM Policy

An IAM policy is a rule or set of rules defining the operations allowed/denied to be performed on an AWS resource.

Policies can be granted in a number of ways:

- Attaching a *managed policy*. AWS provides a list of pre-defined policies such as *AmazonS3ReadOnlyAccess*.
- Attaching an *inline policy*. An inline policy is a custom policy created by hand.
- Adding the user to a group that has appropriate permission policies attached. We'll look at groups in detail below.
- Cloning the permission of an existing IAM user.

![IAM policy diagram](/assets/iam/iam-policy.png)

As an example, here is a policy that grants all operations to all S3 buckets.

``` json
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": "s3:*",
    "Resource": "*"
  }
}
```

And here is a policy that grants more granular access, only allowing retrieval of files prefixed by the string `Bobs-` in the bucket called `Hello-bucket`.

``` json
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::Hello-bucket/*",
    "Condition": {"StringEquals": {"s3:prefix": "Bobs-"}}
}
```

We are using S3 resources in the above examples. But a policy looks similar for any of the AWS services. It just depends on the resource ARN for `Resource` property. An ARN is an identifier for a resource in AWS and we'll look at it in more detail in the next chapter. We also add the corresponding service actions and condition context keys in `Action` and `Condition` property. You can find all the available AWS Service actions and condition context keys for use in IAM Policies [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_actionsconditions.html). Aside from attaching a policy to a user, you can attach them to a role or a group.

### What is an IAM Role

Sometimes your AWS resources need to access other resources in your account. For example, you have a Lambda function that queries your DynamoDB to retrieve some data, process it, and then send Bob an email with the results. In this case, we want Lambda to only be able to make read queries so it does not change the database by mistake. We also want to restrict Lambda to be able to email Bob so it does not spam other people. While this could be done by creating an IAM user and putting the user’s credentials to the Lambda function or embed the credentials in the Lambda code, this is just not secure. If somebody was to get hold of these credentials, they could make those calls on your behalf. This is where IAM role comes in to play.

An IAM role is very similar to a user, in that it is an *identity* with permission policies that determine what the identity can and cannot do in AWS. However, a role does not have any credentials (password or access keys) associated with it. Instead of being uniquely associated with one person, a role can be taken on by anyone who needs it. In this case, the Lambda function will be assigned with a role to temporarily take on the permission.

![AWS service with IAM Role diagram](/assets/iam/service-as-iam-role.png)

Roles can be applied to users as well. In this case, the user is taking on the policy set for the IAM role. This is useful for cases where a user is wearing multiple "hats" in the organization. Roles make this easy since you only need to create these roles once and they can be re-used for anybody else that wants to take it on.

![IAM User with IAM Role diagram](/assets/iam/iam-user-as-iam-role.png)

You can also have a role tied to the ARN of a user from a different organization. This allows the external user to assume that role as a part of your organization. This is typically used when you have a third party service that is acting on your AWS Organization. You'll be asked to create a Cross-Account IAM Role and add the external user as a *Trust Relationship*. The *Trust Relationship* is telling AWS that the specified external user can assume this role.

![External IAM User with IAM Role diagram](/assets/iam/external-user-with-iam-role.png)

### What is an IAM Group

An IAM group is simply a collection of IAM users. You can use groups to specify permissions for a collection of users, which can make those permissions easier to manage for those users. For example, you could have a group called Admins and give that group the types of permissions that administrators typically need. Any user in that group automatically has the permissions that are assigned to the group. If a new user joins your organization and should have administrator privileges, you can assign the appropriate permissions by adding the user to that group. Similarly, if a person changes jobs in your organization, instead of editing that user's permissions, you can remove him or her from the old groups and add him or her to the appropriate new groups.

![Complete IAM Group, IAM Role, IAM User, and IAM Policy diagram](/assets/iam/complete-iam-concepts.png)

This should give you a quick idea of IAM and some of its concepts. We will be referring to a few of these in the coming chapters. Next let's quickly look at another AWS concept; the ARN.

## What is an ARN

In the last chapter while we were looking at IAM policies we looked at how you can specify a resource using its ARN. Let's take a better look at what ARN is.

Here is the official definition:

> Amazon Resource Names (ARNs) uniquely identify AWS resources. We require an ARN when you need to specify a resource unambiguously across all of AWS, such as in IAM policies, Amazon Relational Database Service (Amazon RDS) tags, and API calls.

ARN is really just a globally unique identifier for an individual AWS resource. It takes one of the following formats.

```bash
arn:partition:service:region:account-id:resource
arn:partition:service:region:account-id:resourcetype/resource
arn:partition:service:region:account-id:resourcetype:resource
```

Let's look at some examples of ARN. Note the different formats used.

```bash
<!-- Elastic Beanstalk application version -->
arn:aws:elasticbeanstalk:us-east-1:123456789012:environment/My App/MyEnvironment

<!-- IAM user name -->
arn:aws:iam::123456789012:user/David

<!-- Amazon RDS instance used for tagging -->
arn:aws:rds:eu-west-1:123456789012:db:mysql-db

<!-- Object in an Amazon S3 bucket -->
arn:aws:s3:::my_corporate_bucket/exampleobject.png
```

Finally, let's look at the common use cases for ARN.

1. Communication

   ARN is used to reference a specific resource when you orchestrate a system involving multiple AWS resources. For example, you have an API Gateway listening for RESTful APIs and invoking the corresponding Lambda function based on the API path and request method. The routing looks like the following.

   ```bash
   GET /hello_world => arn:aws:lambda:us-east-1:123456789012:function:lambda-hello-world
   ```

2. IAM Policy

   We had looked at this in detail in the last chapter but here is an example of a policy definition.

   ``` json
   {
     "Version": "2012-10-17",
     "Statement": {
       "Effect": "Allow",
       "Action": ["s3:GetObject"],
       "Resource": "arn:aws:s3:::Hello-bucket/*"
   }
   ```

   ARN is used to define which resource (S3 bucket in this case) the access is granted for. The wildcard `*` character is used here to match all resources inside the *Hello-bucket*.

Next let's configure our AWS CLI. We'll be using the info from the IAM user account we created previously.

## Configure the AWS CLI

To make it easier to work with a lot of the AWS services, we are going to use the [AWS CLI](https://aws.amazon.com/cli/).

### Install the AWS CLI

AWS CLI needs Python 2 version 2.6.5+ or Python 3 version 3.3+ and [Pip](https://pypi.python.org/pypi/pip). Use the following if you need help installing Python or Pip.

- [Installing Python](https://www.python.org/downloads/)
- [Installing Pip](https://pip.pypa.io/en/stable/installing/)

<img class="code-marker" src="/assets/s.png" />Now using Pip you can install the AWS CLI (on Linux, macOS, or Unix) by running:

``` bash
$ sudo pip install awscli
```

Or using [Homebrew](https://brew.sh) on macOS:

``` bash
$ brew install awscli
```

If you are having some problems installing the AWS CLI or need Windows install instructions, refer to the [complete install instructions](http://docs.aws.amazon.com/cli/latest/userguide/installing.html).

### Add Your Access Key to AWS CLI

We now need to tell the AWS CLI to use your Access Keys from the previous chapter.

It should look something like this:

- Access key ID **AKIAIOSFODNN7EXAMPLE**
- Secret access key **wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY**

<img class="code-marker" src="/assets/s.png" />Simply run the following with your Secret Key ID and your Access Key.

``` bash
$ aws configure
```

You can leave the **Default region name** and **Default output format** the way they are.

Next let's get started with setting up our backend.