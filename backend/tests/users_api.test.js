const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
//
// const jwt = require("jsonwebtoken");
// const config = require("../utils/config");
const bcrypt = require("bcrypt");
//
const testHelper = require("./test-helper");
const User = require("../models/userModel");

describe("api/blogs/ Add new user", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("password123", 10);
    await new User({ username: "johnisdoe", passwordHash }).save();
  });

  test("new user is added to db", async () => {
    const usersAtStart = await testHelper.usersInDb();

    expect(usersAtStart[0].username).toBe("johnisdoe");
  });

  test("add new valid user", async () => {
    // TODO
    const usersAtStart = await testHelper.usersInDb();

    const validUser = {
      username: "jukka7887",
      name: "Poikola",
      password: "secret8888",
    };

    await api
      .post("/api/users")
      .send(validUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const allUsernames = usersAtEnd.map((user) => user.username);
    expect(allUsernames).toContain(validUser.username);
  });

  test("already existing user cannot be added, return error code 400", async () => {
    const usersAtStart = await testHelper.usersInDb();

    const existingUser = {
      username: "johnisdoe",
      name: "John Doe",
      password: "password123",
    };

    const res = await api
      .post("/api/users")
      .send(existingUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);

    expect(res.body.error).toBeTruthy();
  });

  test("the password length needs to be greater than 3", async () => {
    const usersAtStart = await testHelper.usersInDb();
    // console.log(`USERS AT START -----: ${JSON.stringify(usersAtStart)} `);

    const userWithInvalidPassword = {
      username: "hellourser",
      name: "Susan Joe",
      password: "pas",
    };

    const res = await api
      .post("/api/users")
      .send(userWithInvalidPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
    expect(res.body.error).toBeTruthy();
  });

  test("the username length needs to be greater than 3", async () => {
    const usersAtStart = await testHelper.usersInDb();

    const userWithInvalidPassword = {
      username: "hel",
      name: "Susan Hello",
      password: "password123",
    };

    const res = await api
      .post("/api/users")
      .send(userWithInvalidPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
    expect(res.body.error).toBeTruthy();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
