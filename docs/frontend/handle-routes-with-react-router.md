---
layout: post
title: Handle Routes with React Router
date: 2017-01-10 00:00:00
lang: en
ref: handle-routes-with-react-router
description: Create React App does not ship with a way to set up routes in your app. To do so, we are going to use React Router. The latest version of React Router, React Router v4 embraces the composable nature of React’s components and makes it easy to work with routes in our single page app.
comments_id: handle-routes-with-react-router/116
---

Create React App sets a lot of things up by default but it does not come with a built-in way to handle routes. And since we are building a single page app, we are going to use [React Router](https://reacttraining.com/react-router/) to handle them for us.


Let's start by installing React Router. We are going to be using the React Router v4, the newest version of React Router. React Router v4 can be used on the web and in native. So let's install the one for the web.

### Installing React Router v4

<img class="code-marker" src="/assets/s.png" />Run the following command in your working directory.

``` bash
$ npm install react-router-dom@5.0.1 @types/react-router-dom --save
```

This installs the NPM package and adds the dependency to your `package.json`.

### Setting up React Router

Even though we don't have any routes set up in our app, we can get the basic structure up and running. Our app currently runs from the `App` component in `src/App.tsx`. We are going to be using this component as the container for our entire app. To do that we'll encapsulate our `App` component within a `Router`.

<img class="code-marker" src="/assets/s.png" />Replace the following code in `src/index.tsx`:

``` coffee
ReactDOM.render(<App />, document.getElementById('root'));
```

<img class="code-marker" src="/assets/s.png" />With this:

``` coffee
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
```

<img class="code-marker" src="/assets/s.png" />And import this in the header of `src/index.js`.

``` coffee
import { BrowserRouter as Router } from 'react-router-dom';
```

We've made two small changes here.

1. Use `BrowserRouter` as our router. This uses the browser's [History](https://developer.mozilla.org/en-US/docs/Web/API/History) API to create real URLs.
2. Use the `Router` to render our `App` component. This will allow us to create the routes we need inside our `App` component.

Now if you head over to your browser, your app should load just like before. The only difference being that we are using React Router to serve out our pages.

Next we are going to look into how to organize the different pages of our app.


## Create Containers

Currently, our app has a single component that renders our content. For creating our note taking app, we need to create a few different pages to load/edit/create notes. Before we can do that we will put the outer chrome of our app inside a component and render all the top level components inside them. These top level components that represent the various pages will be called containers.

### Add a Navbar

Let's start by creating the outer chrome of our application by first adding a navigation bar to it. We are going to use the [Navbar](https://react-bootstrap.github.io/components/navbar/) React-Bootstrap component.

<img class="code-marker" src="/assets/s.png" />To start, you can go remove the `src/logo.svg` that is placed there by Create React App.

``` bash
$ rm src/logo.svg
```

<img class="code-marker" src="/assets/s.png" />And go ahead and remove the code inside `src/App.tsx` and replace it with the following.

``` coffee
import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import "./App.css";

const App = (): JSX.Element => {
  return (
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
      </Navbar>
    </div>
  );
};

export default App;
```

We are doing a few things here:

1. Creating a fixed width container using Bootstrap in `div.container`.
2. Adding a Navbar inside the container that fits to its container's width using the attribute `fluid`.
3. Using `Link` component from the React-Router to handle the link to our app's homepage (without forcing the page to refresh).

Let's also add a couple of line of styles to space things out a bit more.

<img class="code-marker" src="/assets/s.png" />Remove all the code inside `src/App.css` and replace it with the following:

``` css
.App {
  margin-top: 15px;
}

.App .navbar-brand {
  font-weight: bold;
}
```

### Add the Home container

Now that we have the outer chrome of our application ready, let's add the container for the homepage of our app.  It'll respond to the `/` route.

<img class="code-marker" src="/assets/s.png" />Create a `src/containers/` directory by running the following in your working directory.

``` bash
$ mkdir src/containers/
```

We'll be storing all of our top level components here. These are components that will respond to our routes and make requests to our API. We will be calling them *containers* through the rest of this tutorial.

<img class="code-marker" src="/assets/s.png" />Create a new container and add the following to `src/containers/Home.tsx`.

``` coffee
import React from "react";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="Home">
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    </div>
  );
};

export default Home;
```

This simply renders our homepage given that the user is not currently signed in.

Now let's add a few lines to style this.

<img class="code-marker" src="/assets/s.png" />Add the following into `src/containers/Home.css`.

``` css
.Home .lander {
  padding: 80px 0;
  text-align: center;
}

.Home .lander h1 {
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
}

.Home .lander p {
  color: #999;
}
```

### Set up the Routes

Now we'll set up the routes so that we can have this container respond to the `/` route.

<img class="code-marker" src="/assets/s.png" />Create `src/Routes.tsx` and add the following into it.

``` coffee
import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
    </Switch>
  );
};

export default Routes;
```

This component uses this `Switch` component from React-Router that renders the first matching route that is defined within it. For now we only have a single route, it looks for `/` and renders the `Home` component when matched. We are also using the `exact` prop to ensure that it matches the `/` route exactly. This is because the path `/` will also match any route that starts with a `/`.

### Render the Routes

Now let's render the routes into our App component.

<img class="code-marker" src="/assets/s.png" />Add the following to the header of your `src/App.js`.

``` coffee
import Routes from "./Routes";
```

<img class="code-marker" src="/assets/s.png" />And add the following line below our `Navbar` component inside the `render` of `src/App.js`.

``` coffee
<Routes />
```

So the `App` function component of our `src/App.tsx` should now look like this.

``` coffee
import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";

const App = (): JSX.Element => {
  return (
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
      </Navbar>
      <Routes />
    </div>
  );
};

export default App;
```

This ensures that as we navigate to different routes in our app, the portion below the navbar will change to reflect that.

Finally, head over to your browser and your app should show the brand new homepage of your app.

![New homepage loaded screenshot](/assets/new-homepage-loaded.png)

Next we are going to add login and signup links to our navbar.


## Adding Links in the Navbar

Now that we have our first route set up, let's add a couple of links to the navbar of our app. These will direct users to login or signup for our app when they first visit it.

<img class="code-marker" src="/assets/s.png" />Replace the `App` function component in `src/App.tsx` with the following.

``` coffee
function App(props) {
  return (
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href="/signup">Signup</NavItem>
            <NavItem href="/login">Login</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
    </div>
  );
}
```

This adds two links to our navbar using the `NavItem` Bootstrap component. The `Navbar.Collapse` component ensures that on mobile devices the two links will be collapsed.

And let's include the necessary components in the header.

Replace the `react-router-dom` and `react-bootstrap` import in `src/App.tsx` with this.

``` coffee
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
```

Now if you flip over to your browser, you should see the two links in our navbar.

![Navbar links added screenshot](/assets/navbar-links-added.png)

Unfortunately, when you click on them they refresh your browser while redirecting to the link. We need it to route it to the new link without refreshing the page since we are building a single page app.

To fix this we need a component that works with React Router and React Bootstrap called [React Router Bootstrap](https://github.com/react-bootstrap/react-router-bootstrap). It can wrap around your `Navbar` links and use the React Router to route your app to the required link without refreshing the browser.

Run the following command in your working directory.

``` bash
$ npm install react-router-bootstrap @types/react-router-bootstrap --save
```

And include it at the top of your `src/App.tsx`.

``` coffee
import { LinkContainer } from "react-router-bootstrap";
```

We will now wrap our links with the `LinkContainer`. Replace the `App` function component in your `src/App.tsx` with this.

``` coffee
const App = (): JSX.Element => {
  return (
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <LinkContainer to="/signup">
              <NavItem>Signup</NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
              <NavItem>Login</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
    </div>
  );
};

export default App;
```

And that's it! Now if you flip over to your browser and click on the login link, you should see the link highlighted in the navbar. Also, it doesn't refresh the page while redirecting.

![Navbar link highlighted screenshot](/assets/navbar-link-highlighted.png)

You'll notice that we are not rendering anything on the page because we don't have a login page currently. We should handle the case when a requested page is not found.

Next let's look at how to tackle handling 404s with our router.

## Handle 404s

Now that we know how to handle the basic routes; let's look at handling 404s with the React Router.

### Create a Component

Let's start by creating a component that will handle this for us.

Create a new component at `src/containers/NotFound.tsx` and add the following.

``` coffee
import React from "react";
import "./NotFound.css";

const NotFound: React.FC = () => {
  return (
    <div className="NotFound">
      <h3>Sorry, page not found!</h3>
    </div>
  );
};

export default NotFound;
```

All this component does is print out a simple message for us.

Let's add a couple of styles for it in `src/containers/NotFound.css`.

``` css
.NotFound {
  padding-top: 100px;
  text-align: center;
}
```

### Add a Catch All Route

Now we just need to add this component to our routes to handle our 404s.

Find the `<Switch>` block in `src/Routes.tsx` and add it as the last line in that section.

``` coffee
{ /* Finally, catch all unmatched routes */ }
<Route component={NotFound} />
```

This needs to always be the last line in the `<Route>` block. You can think of it as the route that handles requests in case all the other routes before it have failed.

And include the `NotFound` component in the header by adding the following:

``` javascript
import NotFound from "./containers/NotFound";
```

And that's it! Now if you were to switch over to your browser and try clicking on the Login or Signup buttons in the Nav you should see the 404 message that we have.

![Router 404 page screenshot](/assets/router-404-page.png)

Next up, we are going to configure our app with the info of our backend resources.
