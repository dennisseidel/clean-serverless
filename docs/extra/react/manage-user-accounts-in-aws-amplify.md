---
layout: post
title: Manage User Accounts in AWS Amplify
description: In the next series of chapters we will look at how to manage user accounts for our Serverless React app with Cognito and AWS Amplify.
date: 2018-04-13 00:00:00
code: user-management
comments_id: manage-user-accounts-in-aws-amplify/505
---

If you've followed along with [the first part of Serverless Stack](/#the-basics) guide, you might be looking to add ways your users can better manage their accounts. This includes the ability to:

- Reset their password in case they forget it
- Change their password once they are logged in
- And change the email they are logging in with

As a quick refresher, we are using [AWS Cognito](https://aws.amazon.com/cognito/) as our authentication and user management provider. And on the frontend we are using [AWS Amplify](https://aws-amplify.github.io/) with our [Create React App](https://github.com/facebook/create-react-app).

In the next few chapters we are going to look at how to add the above functionality to our [Serverless notes app](https://demo.serverless-stack.com). For these chapters we are going to use a forked version of the notes app. You can [view the hosted version here](https://demo-user-mgmt.serverless-stack.com) and the [source is available in a repo here]({{ site.frontend_user_mgmt_github_repo }}).

Let's get started by allowing users to reset their password in case they have forgotten it.

## Handle Forgot and Reset Password

In our [Serverless notes app](https://demo.serverless-stack.com) we've used [Cognito User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) to sign up and login our users. In the frontend we've used [AWS Amplify](https://aws-amplify.github.io/) in our React app. However, if our users have forgotten their passwords, we need to have a way for them to reset their password. In this chapter we will look at how to do this.

The version of the notes app used in this chapter is hosted in a:

- Separate GitHub repository: [**{{ site.frontend_user_mgmt_github_repo }}**]({{ site.frontend_user_mgmt_github_repo }})
- And can be accessed through: [**https://demo-user-mgmt.serverless-stack.com**](https://demo-user-mgmt.serverless-stack.com)

Let's look at the main changes we need to make to allow users to reset their password.

### Add a Reset Password Form

<img class="code-marker" src="/assets/s.png" />We are going to create a `src/containers/ResetPassword.js`.

``` coffee
import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import {
  HelpBlock,
  FormGroup,
  Glyphicon,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./ResetPassword.css";

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: "",
      password: "",
      codeSent: false,
      confirmed: false,
      confirmPassword: "",
      isConfirming: false,
      isSendingCode: false
    };
  }

  validateCodeForm() {
    return this.state.email.length > 0;
  }

  validateResetForm() {
    return (
      this.state.code.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSendCodeClick = async event => {
    event.preventDefault();

    this.setState({ isSendingCode: true });

    try {
      await Auth.forgotPassword(this.state.email);
      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isSendingCode: false });
    }
  };

  handleConfirmClick = async event => {
    event.preventDefault();

    this.setState({ isConfirming: true });

    try {
      await Auth.forgotPasswordSubmit(
        this.state.email,
        this.state.code,
        this.state.password
      );
      this.setState({ confirmed: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isConfirming: false });
    }
  };

  renderRequestCodeForm() {
    return (
      <form onSubmit={this.handleSendCodeClick}>
        <FormGroup bsSize="large" controlId="email">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          loadingText="Sending…"
          text="Send Confirmation"
          isLoading={this.state.isSendingCode}
          disabled={!this.validateCodeForm()}
        />
      </form>
    );
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmClick}>
        <FormGroup bsSize="large" controlId="code">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.code}
            onChange={this.handleChange}
          />
          <HelpBlock>
            Please check your email ({this.state.email}) for the confirmation
            code.
          </HelpBlock>
        </FormGroup>
        <hr />
        <FormGroup bsSize="large" controlId="password">
          <ControlLabel>New Password</ControlLabel>
          <FormControl
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="confirmPassword">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type="password"
            onChange={this.handleChange}
            value={this.state.confirmPassword}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          text="Confirm"
          loadingText="Confirm…"
          isLoading={this.state.isConfirming}
          disabled={!this.validateResetForm()}
        />
      </form>
    );
  }

  renderSuccessMessage() {
    return (
      <div className="success">
        <Glyphicon glyph="ok" />
        <p>Your password has been reset.</p>
        <p>
          <Link to="/login">
            Click here to login with your new credentials.
          </Link>
        </p>
      </div>
    );
  }

  render() {
    return (
      <div className="ResetPassword">
        {!this.state.codeSent
          ? this.renderRequestCodeForm()
          : !this.state.confirmed
            ? this.renderConfirmationForm()
            : this.renderSuccessMessage()}
      </div>
    );
  }
}
```

Let's quickly go over the flow here:

- We ask the user to put in the email address for their account in the `this.renderRequestCodeForm()`.
- Once the user submits this form, we start the process by calling `Auth.forgotPassword(this.state.email)`. Where `Auth` is a part of the AWS Amplify library.
- This triggers Cognito to send a verification code to the specified email address.
- Then we present a form where the user can input the code that Cognito sends them. This form is rendered in `this.renderConfirmationForm()`. And it also allows the user to put in their new password.
- Once they submit this form with the code and their new password, we call `Auth.forgotPasswordSubmit(this.state.email, this.state.code, this.state.password)`. This resets the password for the account.
- Finally, we show the user a sign telling them that their password has been successfully reset. We also link them to the login page where they can login using their new details.

Let's also add a couple of styles.

<img class="code-marker" src="/assets/s.png" />Add the following to `src/containers/ResetPassword.css`.

``` css
@media all and (min-width: 480px) {
  .ResetPassword {
    padding: 60px 0;
  }

  .ResetPassword form {
    margin: 0 auto;
    max-width: 320px;
  }

  .ResetPassword .success {
    max-width: 400px;
  }
}

.ResetPassword .success {
  margin: 0 auto;
  text-align: center;
}
.ResetPassword .success .glyphicon {
  color: grey;
  font-size: 30px;
  margin-bottom: 30px;
}
```

### Add the Route

Finally, let's link this up with the rest of our app.

<img class="code-marker" src="/assets/s.png" />Add the route to `src/Routes.js`.

``` html
<UnauthenticatedRoute
  path="/login/reset"
  exact
  component={ResetPassword}
  props={childProps}
/>
```

<img class="code-marker" src="/assets/s.png" />And import it in the header.

``` coffee
import ResetPassword from "./containers/ResetPassword";
```

### Link from the Login Page

Now we want to make sure that our users are directed to this page when they are trying to login.

<img class="code-marker" src="/assets/s.png" />So let's add a link in our `src/containers/Login.js`. Add it above our login button.

``` coffee
<Link to="/login/reset">Forgot password?</Link>
```

<img class="code-marker" src="/assets/s.png" />And import the `Link` component in the header.

``` coffee
import { Link } from "react-router-dom";
```

That's it! We should now be able to navigate to `/login/reset` or go to it from the login page in case we need to reset our password.

![Login page forgot password link screenshot](/assets/user-management/login-page-forgot-password-link.png)

And from there they can put in their email to reset their password.

![Forgot password page screenshot](/assets/user-management/forgot-password-page.png)

Next, let's look at how our logged in users can change their password.

## Allow Users to Change Passwords

For our [Serverless notes app](https://demo.serverless-stack.com), we want to allow our users to change their password. Recall that we are using Cognito to manage our users and AWS Amplify in our React app. In this chapter we will look at how to do that.

For reference, we are using a forked version of the notes app with:

- A separate GitHub repository: [**{{ site.frontend_user_mgmt_github_repo }}**]({{ site.frontend_user_mgmt_github_repo }})
- And it can be accessed through: [**https://demo-user-mgmt.serverless-stack.com**](https://demo-user-mgmt.serverless-stack.com)

Let's start by creating a settings page that our users can use to change their password.

### Add a Settings Page

<img class="code-marker" src="/assets/s.png" />Add the following to `src/containers/Settings.js`.

``` coffee
import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Settings.css";

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className="Settings">
        <LinkContainer to="/settings/email">
          <LoaderButton
            block
            bsSize="large"
            text="Change Email"
          />
        </LinkContainer>
        <LinkContainer to="/settings/password">
          <LoaderButton
            block
            bsSize="large"
            text="Change Password"
          />
        </LinkContainer>
      </div>
    );
  }
}
```

All this does is add two links to a page that allows our users to change their password and email.

<img class="code-marker" src="/assets/s.png" />Let's also add a couple of styles for this page.

``` css
@media all and (min-width: 480px) {
  .Settings {
    padding: 60px 0;
    margin: 0 auto;
    max-width: 320px;
  }
}
.Settings .LoaderButton:last-child {
  margin-top: 15px;
}
```

<img class="code-marker" src="/assets/s.png" />Add a link to this settings page to the navbar of our app by changing `src/App.js`.

``` coffee
<Navbar fluid collapseOnSelect>
  <Navbar.Header>
    <Navbar.Brand>
      <Link to="/">Scratch</Link>
    </Navbar.Brand>
    <Navbar.Toggle />
  </Navbar.Header>
  <Navbar.Collapse>
    <Nav pullRight>
      {this.state.isAuthenticated
        ? <Fragment>
            <LinkContainer to="/settings">
              <NavItem>Settings</NavItem>
            </LinkContainer>
            <NavItem onClick={this.handleLogout}>Logout</NavItem>
          </Fragment>
        : <Fragment>
            <LinkContainer to="/signup">
              <NavItem>Signup</NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
              <NavItem>Login</NavItem>
            </LinkContainer>
          </Fragment>
      }
    </Nav>
  </Navbar.Collapse>
</Navbar>
```

<img class="code-marker" src="/assets/s.png" />Also, add the route to our `src/Routes.js`.

``` html
<AuthenticatedRoute
  path="/settings"
  exact
  component={Settings}
  props={childProps}
/>
```

<img class="code-marker" src="/assets/s.png" />And don't forget to import it.

``` coffee
import Settings from "./containers/Settings";
```

This should give us a settings page that our users can get to from the app navbar.

![Settings page screenshot](/assets/user-management/settings-page.png)

### Change Password Form

Now let's create the form that allows our users to change their password. 

<img class="code-marker" src="/assets/s.png" />Add the following to `src/containers/ChangePassword.js`.

``` coffee
import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./ChangePassword.css";

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      oldPassword: "",
      isChanging: false,
      confirmPassword: ""
    };
  }

  validateForm() {
    return (
      this.state.oldPassword.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleChangeClick = async event => {
    event.preventDefault();

    this.setState({ isChanging: true });

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(
        currentUser,
        this.state.oldPassword,
        this.state.password
      );

      this.props.history.push("/settings");
    } catch (e) {
      alert(e.message);
      this.setState({ isChanging: false });
    }
  };

  render() {
    return (
      <div className="ChangePassword">
        <form onSubmit={this.handleChangeClick}>
          <FormGroup bsSize="large" controlId="oldPassword">
            <ControlLabel>Old Password</ControlLabel>
            <FormControl
              type="password"
              onChange={this.handleChange}
              value={this.state.oldPassword}
            />
          </FormGroup>
          <hr />
          <FormGroup bsSize="large" controlId="password">
            <ControlLabel>New Password</ControlLabel>
            <FormControl
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup bsSize="large" controlId="confirmPassword">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              type="password"
              onChange={this.handleChange}
              value={this.state.confirmPassword}
            />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            text="Change Password"
            loadingText="Changing…"
            disabled={!this.validateForm()}
            isLoading={this.state.isChanging}
          />
        </form>
      </div>
    );
  }
}
```

Most of this should be very straightforward. The key part of the flow here is that we ask the user for their current password along with their new password. Once they enter it, we can call the following:

``` coffee
const currentUser = await Auth.currentAuthenticatedUser();
await Auth.changePassword(
  currentUser,
  this.state.oldPassword,
  this.state.password
);
```

The above snippet uses the `Auth` module from Amplify to get the current user. And then uses that to change their password by passing in the old and new password. Once the `Auth.changePassword` method completes, we redirect the user to the settings page.

<img class="code-marker" src="/assets/s.png" />Let's also add a couple of styles.

``` css
@media all and (min-width: 480px) {
  .ChangePassword {
    padding: 60px 0;
  }

  .ChangePassword form {
    margin: 0 auto;
    max-width: 320px;
  }
}
```

<img class="code-marker" src="/assets/s.png" />Let's add our new page to `src/Routes.js`.

``` html
<AuthenticatedRoute
  path="/settings/password"
  exact
  component={ChangePassword}
  props={childProps}
/>
```

<img class="code-marker" src="/assets/s.png" />And import it.

``` coffee
import ChangePassword from "./containers/ChangePassword";
```

That should do it. The `/settings/password` page should allow us to change our password.

![Change password page screenshot](/assets/user-management/change-password-page.png)

Next, let's look at how to implement a change email form for our users.

## Allow Users to Change Their Email

We want the users of our [Serverless notes app](https://demo.serverless-stack.com) to be able to change their email. Recall that we are using Cognito to manage our users and AWS Amplify in our React app. In this chapter we will look at how to do that.

For reference, we are using a forked version of the notes app with:

- A separate GitHub repository: [**{{ site.frontend_user_mgmt_github_repo }}**]({{ site.frontend_user_mgmt_github_repo }})
- And it can be accessed through: [**https://demo-user-mgmt.serverless-stack.com**](https://demo-user-mgmt.serverless-stack.com)

In the previous chapter we created a settings page that links to `/settings/email`. Let's implement that.

### Change Email Form

<img class="code-marker" src="/assets/s.png" />Add the following to `src/containers/ChangeEmail.js`.

``` coffee
import React, { Component } from "react";
import { Auth } from "aws-amplify";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./ChangeEmail.css";

export default class ChangeEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: "",
      codeSent: false,
      isConfirming: false,
      isSendingCode: false
    };
  }

  validatEmailForm() {
    return this.state.email.length > 0;
  }

  validateConfirmForm() {
    return this.state.code.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleUpdateClick = async event => {
    event.preventDefault();

    this.setState({ isSendingCode: true });

    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, { email: this.state.email });

      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isSendingCode: false });
    }
  };

  handleConfirmClick = async event => {
    event.preventDefault();

    this.setState({ isConfirming: true });

    try {
      await Auth.verifyCurrentUserAttributeSubmit("email", this.state.code);

      this.props.history.push("/settings");
    } catch (e) {
      alert(e.message);
      this.setState({ isConfirming: false });
    }
  };

  renderUpdateForm() {
    return (
      <form onSubmit={this.handleUpdateClick}>
        <FormGroup bsSize="large" controlId="email">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          text="Update Email"
          loadingText="Updating…"
          disabled={!this.validatEmailForm()}
          isLoading={this.state.isSendingCode}
        />
      </form>
    );
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmClick}>
        <FormGroup bsSize="large" controlId="code">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.code}
            onChange={this.handleChange}
          />
          <HelpBlock>
            Please check your email ({this.state.email}) for the confirmation
            code.
          </HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          text="Confirm"
          loadingText="Confirm…"
          isLoading={this.state.isConfirming}
          disabled={!this.validateConfirmForm()}
        />
      </form>
    );
  }

  render() {
    return (
      <div className="ChangeEmail">
        {!this.state.codeSent
          ? this.renderUpdateForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
```

The flow for changing a user's email is pretty similar to how we sign a user up.

1. We ask a user to put in their new email.
2. Cognito sends them a verification code.
3. They enter the code and we confirm that their email has been changed.

We start by rendering a form that asks our user to enter their new email in `this.renderUpdateForm()`. Once the user submits this form, we call:

``` js
const user = await Auth.currentAuthenticatedUser();
Auth.updateUserAttributes(user, { email: this.state.email });
```

This gets the current user and updates their email using the `Auth` module from Amplify. Next we render the form where they can enter the code in `this.renderConfirmationForm()`. Upon submitting this form we call:

``` js
Auth.verifyCurrentUserAttributeSubmit("email", this.state.code);
```

This confirms the change on Cognito's side. Finally, we redirect the user to the settings page.

<img class="code-marker" src="/assets/s.png" />Let's add a couple of styles to `src/containers/ChangeEmail.css`.

``` css
@media all and (min-width: 480px) {
  .ChangeEmail {
    padding: 60px 0;
  }

  .ChangeEmail form {
    margin: 0 auto;
    max-width: 320px;
  }
}
```

<img class="code-marker" src="/assets/s.png" />Finally, let's add our new page to `src/Routes.js`.

``` html
<AuthenticatedRoute
  path="/settings/email"
  exact
  component={ChangeEmail}
  props={childProps}
/>
```

<img class="code-marker" src="/assets/s.png" />And import it in the header.

``` coffee
import ChangeEmail from "./containers/ChangeEmail";
```

That should do it. Our users should now be able to change their email.

![Change email page screenshot](/assets/user-management/change-email-page.png)

### Finer Details

You might notice that the change email flow is interrupted if the user does not confirm the new email. In this case, the email appears to have been changed but Cognito marks it as not being verified. We will let you handle this case on your own but here are a couple of hints on how to do so.

- You can get the current user's Cognito attributes by calling `Auth.userAttributes(currentUser)`. Looking for the email attribute and checking if it is not verified using `attributes["email_verified"] !== "false"`.

- In this case show a simple sign that allows users to resend the verification code. You can do this by calling `Auth.verifyCurrentUserAttribute("email")`.

- Next you can simply display the confirm code form from above and follow the same flow by calling `Auth.verifyCurrentUserAttributeSubmit("email", this.state.code)`.

This can make your change email flow more robust and handle the case where a user forgets to verify their new email.