const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/User");
const Article = require("../models/Article");

describe("user related unit tests", () => {
  const testArticle = {
    tags: [],
    url:
      "https://nos.nl/artikel/2358829-d66-en-vvd-willen-opheldering-over-blokkering-lid-euthanasiecommissie.html",
    title: "Dit is een titel",
    excerpt: "Dit is een beschrijving",
    image: "https://cdn.nos.nl/image/2020/11/05/689236/xxl.jpg",
    content: "Lorum ipson",
    author: "peter",
    source: "nos.nl",
  };
  const testEmail = "tester1212@test.com";
  const testFirstName = "test";
  const testLastName = "tester";
  const testPassword = "test";

  beforeAll(async () => {
    await mongoose.connect(
      "mongodb+srv://Glenn:LaterLezen@laterlezen.tkmyn.mongodb.net/LaterLezen?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
    await User.create({
      email: testEmail,
      firstname: testFirstName,
      lastname: testLastName,
      password: testPassword,
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: testEmail });
    await mongoose.disconnect();
  });

  test("email format", async () => {
    let testUser = await User.findOne({
      email: testEmail,
    }).lean();
    let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    expect(testUser.email).toMatch(emailFormat);
  });

  test("password hashing", async () => {
    let testUser = await User.findOne({
      email: testEmail,
    }).lean();
    expect(testUser.password).not.toBe("test");
  });

  test("add correct article object to user", async () => {
    let testUser = await User.findOne({
      email: testEmail,
    });
    let newArticle = new Article(testArticle);
    testUser.articles.push(newArticle);
    testUser.save();
    expect(testUser.articles[0].title).toBe("Dit is een titel");
  });

  test("add tag to user", async () => {
    await User.findOne(
      {
        email: testEmail,
      },
      (err, user) => {
        if (err) {
          console.log(err);
        } else {
          let testTags = {
            tagName: "/",
            subTags: [
              {
                tagName: "Test",
                parent: "/",
                index: 1,
                subTags: [
                  {
                    tagName: "Corona",
                    parent: "Test",
                    index: 2,
                  },
                ],
              },
              {
                tagName: "Nieuws",
                parent: "/",
                index: 1,
              },
            ],
          };
          user.tags = testTags;
          user.save();
          expect(user.tags).toEqual(testTags);
        }
      }
    );
  });

  test("check for duplicate tags", async () => {
    let inputTags = [
      "bt",
      "cd",
      "ab",
      "ba",
      "ac",
      "ac",
      "ac",
      "cd",
      "ba",
      "bt",
    ];
    let concatTags = inputTags.concat(inputTags);
    const allUniqueTags = new Set(concatTags);
    concatTags = [...allUniqueTags];
    expect(concatTags).toEqual(["bt", "cd", "ab", "ba", "ac"]);
  });

  test("add new theme to user", async () => {
    let testUser = await User.findOne({
      email: testEmail,
    }).lean();
    let preference = "dark";
    if (
      preference === "default" ||
      preference === "typewriter" ||
      preference === "dark" ||
      preference === "bluegrey" ||
      preference === "darkblue"
    ) {
      testUser.preferences = preference;
    }
    expect(testUser.preferences).toEqual(preference);
  });

  test("theme stays on the current theme when changing it to a invalid theme", async () => {
    let testUser = await User.findOne({
      email: testEmail,
    }).lean();
    let preference = "orange";
    if (
      preference === "default" ||
      preference === "typewriter" ||
      preference === "dark" ||
      preference === "bluegrey" ||
      preference === "darkblue"
    ) {
      testUser.preferences = preference;
    }
    expect(testUser.preferences).toEqual("default");
  });
});
