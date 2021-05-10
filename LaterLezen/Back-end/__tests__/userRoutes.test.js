/**
 * @jest-environment node
 * */

"use strict";
const User = require("../models/User");
const mongoose = require("mongoose");
const fetch = require("node-fetch");

describe("User auth integration testing", () => {
  beforeAll(async () => {
    await mongoose.connect(
      "mongodb+srv://Glenn:LaterLezen@laterlezen.tkmyn.mongodb.net/LaterLezen?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
  });

  afterAll(async () => {
    await User.deleteOne({ email: "test1@gmail.com" });
    mongoose.disconnect();
  });

  test("Register without password", async () => {
    const body = {
      email: "test1@gmail.com",
      password: "",
      firstname: "glenn",
      lastname: "steven",
    };
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(body),
    };
    await fetch("http://localhost:4000/user/register", fetchOptions)
      .then((response) => response.json())
      .then((response) => {
        expect(response.message.msgError).toBe(true);
      });
  });

  test("Register user", async () => {
    const body = {
      email: "test1@gmail.com",
      password: "12345678",
      firstname: "glenn",
      lastname: "steven",
    };
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(body),
    };
    await fetch("http://localhost:4000/user/register", fetchOptions)
      .then((response) => response.json())
      .then((response) => {
        expect(response.message.msgError).toBe(false);
      });
  });

  test("Register user with duplicate emailaddress", async () => {
    const body = {
      email: "test1@gmail.com",
      password: "12345678",
      firstname: "glenn",
      lastname: "steven",
    };
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(body),
    };
    await fetch("http://localhost:4000/user/register", fetchOptions)
      .then((response) => response.json())
      .then((response) => {
        expect(response.message.msgError).toBe(true);
      });
  });

  test("Logout without logging in", async () => {
    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    };
    await fetch("http://localhost:4000/user/logout", fetchOptions).then(
      (response) => {
        expect(response.status).toBe(401);
      }
    );
  });

  test("Login with wrong email", async () => {
    const body = {
      email: "test2@gmail.com",
      password: "12345678",
    };
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(body),
    };
    await fetch("http://localhost:4000/user/login", fetchOptions).then(
      (response) => {
        expect(response.status).toBe(401);
      }
    );
  });

  test("Login with wrong password", async () => {
    const body = {
      email: "test1@gmail.com",
      password: "12345",
    };
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(body),
    };
    await fetch("http://localhost:4000/user/login", fetchOptions).then(
      (response) => {
        expect(response.status).toBe(401);
      }
    );
  });

  test("Login with right email and password", async () => {
    const body = {
      email: "test1@gmail.com",
      password: "12345678",
    };
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(body),
    };
    await fetch("http://localhost:4000/user/login", fetchOptions)
      .then((response) => response.json())
      .then((response) => {
        expect(response.isAuthenticated).toBe(true);
      });
  });
});
