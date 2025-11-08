const blogsRouter = express.Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  console.log("operation returned the following blogs", blogs);
  for (const blog in blogs) {
    blog.populate();
  }
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
    console.log("title or url missing");
    return response
      .status(400)
      .json({
        message: "Blog created successfully",
        data: result,
      })
      .end();
  }
  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({
        message: "There was a problem saving the blog",
        data: error,
      })
      .end();
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
