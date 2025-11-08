const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/helper_functions");
const { listWithOneBlog, listWithSixBlogs } = require("./data");

describe("most blogs", () => {
  test("when list has only one blog, equals that", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });

  test("when list has six blogs, equals the author with the most blogs", () => {
    const result = listHelper.mostBlogs(listWithSixBlogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});
