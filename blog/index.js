const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const config = require("./models/config");

const app = express();

const mongoUrl = "mongodb://localhost:27017/bloglist";
mongoose.connect(mongoUrl);

app.use(express.json());

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
