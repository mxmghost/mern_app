# Frontend TODO Introduction

# React and concurrently setup

In the root folder of our project we use the tool create-react-app for an easy and quick setup.

```shell
npx create-react-app client
```

In the package.json file we add two scripts so we can use the tool concurrently to run at the same time the back and the frontend servers.

The scripts in the package.json file now should look like these:

```json
  "scripts": {
    "start": "node server",
    "server": "nodemon server",
    "client": "npm start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  },
```

## Delete Git repo from the client

If we want we go and delete the .git repository in the client directory so we control everything only with the main repository.
For that in the **client** folder we delete the .git directory and also the .gitignore file and if we also don't want a readme.MD we should delete it.

## Add a proxy

In the client/package.json file we should add a proxy setup so we can run the localhost:5000 in an easier way .-.

```json
  "proxy": "http://localhost:5000"
```

# Installing Dependencies

We set our position to the client root react directory and install the required dependencies.

```shell
cd client
npm i  axios react-router-dom redux react-redux redux-thunk redux-devtools-extension moment react-moment
```

# Quick clean up some react files

From the client folder we should delete the following files:

- App.test.js
- index.css
- serviceWorker.js
- logo.svg

# Change the following files

## client/src/index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

## client/public/index.html

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
      integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
      crossorigin="anonymous"
    />
    <title>Welcome To DevConnector</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

## client/src/App.js

```js
import React from "react";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import "./App.css";

const App = () => (
  <div>
    <Navbar />
    <Landing />
  </div>
);

export default App;
```

## client/App.css

In this file just add all your css if you have one.

# Navbar and Landing

Create the folder /client/components/layout and add within the Navbar.js and the Landing.js

# React router
