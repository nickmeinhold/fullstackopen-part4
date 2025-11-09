const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const blogsRouter = express.Router();

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  console.log("operation returned the following blogs", blogs);
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const getTokenFrom = (request) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
      return authorization.replace("Bearer ", "");
    }
    return null;
  };

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({
      message: "Missing title or url",
      data: result,
    });
  }

  try {
    // Get the first user from the database to designate as creator
    const user = await User.findOne({});

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes ?? 0,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    const populatedBlog = await savedBlog.populate("user", {
      username: 1,
      name: 1,
    });

    response.status(201).json(populatedBlog);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "There was a problem saving the blog",
      data: error,
    });
  }
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

module.exports = blogsRouter;
