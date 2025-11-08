const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const config = require("./models/config");

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(express.json());

const blogsRouter = express.Router();

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  console.log("operation returned the following blogs", blogs);
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  if (!blog.likes) {
    blog.likes = 0;
  }
  if (!blog.title || !blog.url) {
    return response.status(400).end();
  }
  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id);
  if (result) {
    response.status(204).end();
  } else {
    response.status(404).json({ error: "blog not found" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true }
  );

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).json({ error: "blog not found" });
  }
});

app.use("/api/blogs", blogsRouter);

module.exports = app;
