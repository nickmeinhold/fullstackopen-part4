const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/helper_functions");
const { listWithOneBlog, listWithSixBlogs } = require("./data");

describe("total likes", () => {
  test("when list has only one blog, equals that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has six blogs, equals the total likes", () => {
    const result = listHelper.totalLikes(listWithSixBlogs);
    assert.strictEqual(result, 36);
  });
});
