const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB();

// This is the response of our API
app.get("/", (req, res) => res.send("API Running"));

// Define routes for the API
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// If there is no environment PORT variable that will be set on the future,
// use the local port 5000
const PORT = process.env.PORT || 5000;

// Putting the app to listen. With a console log callback indicating
// that the port was sucefully opened.
app.listen(PORT, () => console.log(`Server started on Port ${PORT}...`));
