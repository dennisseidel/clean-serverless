---
layout: post
title: Give Feedback While Logging In
date: 2017-01-18 00:00:00
lang: en
ref: give-feedback-while-logging-in
description: We should give users some feedback while we are logging them in to our React.js app. To do so we are going to create a component that animates a Glyphicon refresh icon inside a React-Bootstrap Button component. We’ll do the animation while the log in call is in progress.
comments_id: give-feedback-while-logging-in/46
---

It's important that we give the user some feedback while we are logging them in. So they get the sense that the app is still working, as opposed to being unresponsive.

### Use an isLoading Flag

To do this we are going to add an `isLoading` flag to the state of our `src/containers/Login.tsx`. Add the following to the top of our `Login` function component.

```javascript
const [isLoading, setIsLoading] = useState(false);
```

And we'll update it while we are logging in. So our `handleSubmit` function now looks like so:

```javascript
const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();
  setIsLoading(true);
  try {
    await Auth.signIn(email, password);
    props.userHasAuthenticated(true);
    props.history.push("/");
  } catch (e) {
    alert(e.message);
    setIsLoading(false);
  }
};
```

### Create a Loader Button

Now to reflect the state change in our button we are going to render it differently based on the `isLoading` flag. But we are going to need this piece of code in a lot of different places. So it makes sense that we create a reusable component out of it.

Create a new file and add the following in `src/components/LoaderButton.tsx`.

```coffee
import React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "./LoaderButton.css";

interface LoaderButton extends Button.ButtonProps {
  isLoading: boolean;
  className?: string;
  disabled?: boolean;
}

const LoaderButton: React.FC<LoaderButton> = ({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
      {props.children}
    </Button>
  );
};

export default LoaderButton;
```

This is a really simple component that takes an `isLoading` flag and the text that the button displays in the two states (the default state and the loading state). The `disabled` prop is a result of what we have currently in our `Login` button. And we ensure that the button is disabled when `isLoading` is `true`. This makes it so that the user can't click it while we are in the process of logging them in.

And let's add a couple of styles to animate our loading icon.

Add the following to `src/components/LoaderButton.css`.

```css
.LoaderButton .spinning.glyphicon {
  margin-right: 7px;
  top: 2px;
  animation: spin 1s infinite linear;
}
@keyframes spin {
  from {
    transform: scale(1) rotate(0deg);
  }
  to {
    transform: scale(1) rotate(360deg);
  }
}
```

This spins the refresh Glyphicon infinitely with each spin taking a second. And by adding these styles as a part of the `LoaderButton` we keep them self contained within the component.

### Render Using the isLoading Flag

Now we can use our new component in our `Login` container.

In `src/containers/Login.tsx` find the `<Button>` component in the `return` statement.

```html
<button block bsSize="large" disabled="{!validateForm()}" type="submit">
  Login
</button>
```

And replace it with this.

```html
<LoaderButton
  block
  type="submit"
  bsSize="large"
  isLoading="{isLoading}"
  disabled="{!validateForm()}"
>
  Login
</LoaderButton>
```

Also, import the `LoaderButton` in the header. And remove the reference to the `Button` component.

```javascript
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
```

And now when we switch over to the browser and try logging in, you should see the intermediate state before the login completes.

![Login loading state screenshot](/assets/login-loading-state.png)

If you would like to add _Forgot Password_ functionality for your users, you can refer to our [Extra Credit series of chapters on user management]({% link _chapters/manage-user-accounts-in-aws-amplify.md %}).

Next let's implement the sign up process for our app.
