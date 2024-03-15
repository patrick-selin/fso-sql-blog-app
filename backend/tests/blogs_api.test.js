// eslint-disable-next-line no-unused-vars
const config = require("../utils/config");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
//
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const testHelper = require("./test-helper");
const Blog = require("../models/blogPostModel");
const User = require("../models/userModel");

describe("api/blogs GET testing", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(testHelper.initialBlogPosts);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("the first note is about HTTP methods", async () => {
    const res = await api.get("/api/blogs");
    // console.log(`Response body is ${JSON.stringify(res.body)}`);
    expect(res.body[0].title).toBe("React patterns");
  });

  test("all blogposts are returned", async () => {
    const res = await api.get("/api/blogs");
    expect(res.body).toHaveLength(testHelper.initialBlogPosts.length);
  });

  test("blogpost has id property named id, not _id", async () => {
    const res = await api.get("/api/blogs");

    const blogIds = res.body.map((blog) => blog.id);
    // console.log(blogIds);

    for (const id of blogIds) {
      expect(id).toBeDefined();
    }
  });
});

describe("api/blogs POST testing", () => {
  let token = null;
  beforeAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    await Blog.insertMany(testHelper.initialBlogPosts);

    const passwordHash = await bcrypt.hash("salasana", 10);
    const user = await new User({ username: "name", passwordHash }).save();

    const userForToken = { username: "myname", id: user.id };
    return (token = jwt.sign(userForToken, process.env.SECRET));
  });

  test("POST to /api/blogs creates a new blog post, as auth user", async () => {
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(testHelper.oneBlogPost)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const allBlogPosts = await testHelper.blogsInDb();
    expect(allBlogPosts).toHaveLength(testHelper.initialBlogPosts.length + 1);

    const authors = allBlogPosts.map((blogPost) => blogPost.author);
    expect(authors).toContain("Ms Tester");
  });

  test("POST to /api/blogs fails if a token is not provide, error 401", async () => {
    const invalidToken = "aljfwfjalwe";

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${invalidToken}`)
      .send(testHelper.oneBlogPost)
      .expect(401)
      .expect("Content-Type", /application\/json/);

  });

  test("if likes property is missting, it will default to 0", async () => {
    const onePost = {
      title: "Test Man Title",
      author: "Ms Tester",
      url: "https:/test.com/",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(onePost)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
  });
});

describe("api/blogs/:id DELETE", () => {
  let token = null;
  beforeAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    await Blog.insertMany(testHelper.initialBlogPosts);

    const passwordHash = await bcrypt.hash("salasana", 10);
    const user = await new User({ username: "name", passwordHash }).save();

    const userForToken = { username: "myname", id: user.id };
    token = jwt.sign(userForToken, process.env.SECRET);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(testHelper.oneBlogPost)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    return token;
  });

  test.skip("DELETE post with id and get code 204 and the length is -1", async () => {
    // ok
    const blogsAtStart = await testHelper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    console.log(`blogs TO DELETE: ${JSON.stringify(blogToDelete)}`);
    console.log(`this is TOKEN: ${JSON.stringify(token)}`);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAfterDeletion = await testHelper.blogsInDb();
    expect(blogsAfterDeletion).toHaveLength(
      testHelper.initialBlogPosts.length - 1
    );

    const author = blogsAfterDeletion.map((r) => r.author);
    expect(author).not.toContain(blogToDelete.author);
  });
});

describe("api/blogs/:id PUT", () => {
  // eslint-disable-next-line no-unused-vars
  let token = null;
  beforeAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    await Blog.insertMany(testHelper.initialBlogPosts);

    const passwordHash = await bcrypt.hash("salasana", 10);
    const user = await new User({ username: "name", passwordHash }).save();

    const userForToken = { username: "myname", id: user.id };
    return (token = jwt.sign(userForToken, process.env.SECRET));
  });

  test("update the author and likes with PUT", async () => {
    const blogsAtStart = await testHelper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ author: "Update Me", likes: 55 })
      .expect(200);

    const blogsAfterPut = await testHelper.blogsInDb();
    const updatedBlogPost = blogsAfterPut[0];
    expect(blogsAfterPut).toHaveLength(testHelper.initialBlogPosts.length);
    expect(updatedBlogPost.likes).toBe(55);
    expect(updatedBlogPost.author).toBe("Update Me");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
