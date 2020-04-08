# Backend for our application

- [Backend for our application](#backend-for-our-application)
  - [Setting up MongoDB ATLAS](#setting-up-mongodb-atlas)
  - [Install dependencies & Basic express setup](#install-dependencies--basic-express-setup)
    - [Run a simple express server](#run-a-simple-express-server)
  - [Conecting to MongoDB with Mongoose](#conecting-to-mongodb-with-mongoose)
  - [Create the route files with express router](#create-the-route-files-with-express-router)
  - [Create the user model](#create-the-user-model)
  - [User registration and middleware for authentication](#user-registration-and-middleware-for-authentication)
    - [User registration logic and creating the jsonwebtoken](#user-registration-logic-and-creating-the-jsonwebtoken)
    - [auth middleware to authenticate with jsonwebtoken.](#auth-middleware-to-authenticate-with-jsonwebtoken)
  - [User login](#user-login)
  - [Create profile and get current profile](#create-profile-and-get-current-profile)

## Setting up MongoDB ATLAS

This setting is pretty straightforward as you only need to do the following things in the [Mongo DB Atlas website](https://account.mongodb.com/account/login):

- Register/Login
- Create a project
- Create a cluster
- Create a user 

## Install dependencies & Basic express setup

Create the directory for the project and change to that directory within our **terminal**.

```bash
mkdir ProjectName
cd ProjectName
```

Create the .gitignore file and include the following content:

.gitignore
```txt
node_modules/
config/default.json
```
This allows us to ignore the trace of this paths in our repository.
We don't need to track the node_modules as we are only reading and using them. In other words we are not changing them.
The default.json in the config directory is a file which we are using our tokens and passwords for connecting to API's. This is just for safety reasons as we are pushing our project to a public github repository.

Then we create the [git](https://git-scm.com/docs/git) **repository** and the [config.json](https://docs.npmjs.com/files/package.json) with the following commands:

> NOTE: when the npm init command ask for the **entrypoint**: normally you should set it as **server.js**. You can use whatever name you want server.js is just a convention as we are creating a backend project.

```bash
git init
npm init
```

Then we can now install all the basic dependencies for our project:

```bash
npm install express express-validator bcryptjs config gravatar jsonwebtoken mongoose request 
```

Now the development dependecies:

```bash
npm install -D nodemon concurrently
```

List of dependencies and their usage:

- express: fast, unopinionated, minimalist web framework for Node.js

- express-validator: a set of express.js **middlewares** that wraps validator.js (a library of **string validators** and sanitizers).


- bcryptjs: Optimized bcrypt (algorith for password encryption) in JavaScript with zero dependencies.


- config:  Node-config organizes hierarchical configurations for your app deployments. It allows us to create global variables that we can use through all of our files in the project.

- gravatar: A library to generate Gravatar URLs in Node.js Based on [gravatar](http://en.gravatar.com/support/what-is-gravatar/) specs

- jsonwebtoken: JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties. And this module allows us to use them for user authentication in our web app.
  
- mongoose: Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks. This allows us to work with a Mongo DB easily.


- request: Request is designed to be the simplest way possible to make http calls. It supports HTTPS and follows redirects by default.

- nodemon: Refresh server every time we change a file.

- concurrently: Run backend and frontend simultaneously with a single command.

### Run a simple express server

Create the **server.js** file:

server.js
```js
const express = require("express");
const app = express();

// This is the response of our API
app.get("/", (req, res) => res.send("API Running"));

// If there is no environment PORT variable that will be set on the future,
// use the local port 5000
const PORT = process.env.PORT || 5000;

// Putting the app to listen. With a console log callback indicating
// that the port was sucefully opened.
app.listen(PORT, () => console.log(`Server started on Port ${PORT}...`));
```

Configure some commands to call scripts in the **package.json** file.

package.json
```json
{
  "scripts": {
    "start": "node server",
    "server": "nodemon server"
  }
}
```

We run the server and test with POSTMAN or with our browser with the **localhost:5000** address

```bash
npm run server
```

And if everything was set good we should recieve the response of the callback set in our server.js file:

> API Running

## [Conecting to MongoDB with Mongoose](https://github.com/mxmghost/mern_app/commit/57198bf78181370a266483a1c980638a3a2b4ba1)

First we have to get the connection string from MongoDB Atlas. In our cluster created there should be an option to connect your application and inside this menu you should see the connection string. Copy it!

Then we create a directory to store all our configurations and manage them through the config module.
Inside the config directory we create the **default.json** file and add the connection string, just dont forget to replace the string where your user password is required.

Now, create a file named db.js inside the config directory, and use the exported function in server.js to connect the server with the database.

## [Create the route files with express router](https://github.com/mxmghost/mern_app/commit/9443e4484985b70677432a1ffde7698c5dfc2c1a)

For this we will create two directories the routes directory and the api dir embebed in it.
Here we should create one file per route of our application. In our case we create auth.js,posts.js,profile.js and the user.js

For example here I am providing the user.js file:

```js
const express = require("express");
const router = express.Router();

// @route   GET api/users
// @desc    Test Route
// @access  Public
router.get("/", (req, res) => res.send("users route"));

module.exports = router;
```

Then we update our **server.js** to use this routes.
```js
// Define routes for the API
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
```

We can test it with POSTMAN with some GET petitions.

## [Create the user model](https://github.com/mxmghost/mern_app/commit/c4a0a1d0cd95f1e13dd354a8de3e7c19e2a781ec)

Then we create a dir for the models of our database. Inside of it we create the file User.js

```js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("user", UserSchema);
```

## [User registration and middleware for authentication](https://github.com/mxmghost/mern_app/commit/fd94ef62c482030d0d8e473c3a4aaddda4bdfec1)

### User registration logic and creating the jsonwebtoken

Now in the user route of our api we will include the POST petition for user registration.
Then we should use the module jsonwebtoken to sign/create the token with the user id and return it to the client.

```js
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

// @route   POST api/users
// @desc    Register user
// @access  Public

// 1. Validate the user input with express-validator 
// 2. Check if it exists in the db
// 3. Get the gravatar profile pic
// 4. Encrypt the password
// 5. Create the jsonwebtoken and send it back to the client.

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Validating the data input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // Checking the existance of the user by it email
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User with that email already exists" }] });
      }
      // Getting the gravatar image for the email.
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encypting password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Saving user in the DB
      await user.save();

      // Payload to with user id from the mongoDB
      const payload = {
        user: {
          id: user.id,
        },
      };
      // Creating the jwt with the user id and sending it back to the client.
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

```

Now we can test the user registration with POSTMAN. We should see the token as successful response.

Then we should make the auth js as a private route so when it receive a get petition it will let you see the user data.

### auth middleware to authenticate with jsonwebtoken.

In this part of the project we are creating the middleware that will let us authenticate users with the jsonwebtoken generated using the npm module jsonwebtoken. In a nutshell, once the user successfully sign in or register within our website. The server should return a jsonwebtoken to the client this token will now always had to be in the header of the user petitions, the middleware will handle it and if the user id decoded from the token exists in our database, the client would now have access to the protected routes of our website.

Crate the dir middleware and the **auth.js** within it.

*middleware/auth.js*
```js
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
```

It is important for us to not forget to initialize the middleware in our **sever.js** with the following line.

```js
app.use(express.json({ extended: false }));
```

## [User login](https://github.com/mxmghost/mern_app/commit/73ae36511698b9a0acd80492aa5c2d8f8760e0ec)

For the user login we should make the jsonwebtoken auth in the **routes/api/auth.js** file to allow the user to sign in.
Just as we did in the registration with some simple variations.

## Create profile and get current profile


Required knowledge for this project:

- Basic node/npm usage.
- Basic git and github usage.
- Basic usage of POSTMAN
- Middleware

Interesting Knowledge:

- Importance of project guidelines
- How to make POSTMAN petitions
- IP whitelist of MongoDB

Words:

- claim