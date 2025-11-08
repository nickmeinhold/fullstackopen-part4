const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/helper_functions");
const { listWithOneBlog, listWithSixBlogs } = require("./data");

describe("favourite", () => {
  test("when list has only one blog, favourite is the likes of that", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    assert.deepStrictEqual(result, {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
    });
  });

  test("when list has six blogs, favourite is the blog with the most likes", () => {
    const result = listHelper.mostLikes(listWithSixBlogs);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
    });
  });
});
