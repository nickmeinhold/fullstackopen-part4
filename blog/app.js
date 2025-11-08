const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./api/blogsRouter");
const usersRouter = require("./controllers/user");

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

module.exports = app;
