const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  console.log("cleared");

  for (const blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
    console.log("saved");
  }
  console.log("done");
});

test("a blog can be updated", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const updatedData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
});

test("blogs error when no title or url are missing ", async () => {
  const newBlog = {
    author: "An author",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Test Author",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const titles = response.body.map((r) => r.title);
  const author = response.body.map((r) => r.author);

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
  assert(titles.includes("async/await simplifies making async calls"));
  assert(author.includes("Test Author"));
});

test.only("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

  const titles = blogsAtEnd.map((b) => b.title);
  assert(!titles.includes(blogToDelete.title));
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((e) => e.title);
  assert(titles.includes("Canonical string reduction"));
});

test("correct amount of blog posts are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("likes defaults to zero", async () => {
  const newBlog = {
    title: "Blog without likes",
    author: "Test Author",
    url: "http://example.com",
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(201);

  // Check the returned blog has likes: 0
  assert.strictEqual(response.body.likes, 0);

  // Check the blog in the database has likes: 0
  const blogsInDb = await helper.blogsInDb();
  const savedBlog = blogsInDb.find((b) => b.title === "Blog without likes");
  assert.strictEqual(savedBlog.likes, 0);
});

after(async () => {
  await mongoose.connection.close();
});
