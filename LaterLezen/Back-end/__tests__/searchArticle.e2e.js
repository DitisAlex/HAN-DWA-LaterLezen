const fetch = require("node-fetch");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const User = require("../models/User");
jest.setTimeout(250000);

xdescribe("Laterlezer e2e tests", () => {
  it("Test Search Article component", () => {});
  let theBrowser, thePage;
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
      email: "b@b.nl",
      firstname: "a",
      lastname: "b",
      password: "12345678",
      tags: {
        tagName: "/",
        subTags: [],
      },
    });
    theBrowser = await puppeteer.launch({
      headless: false,
      slowMo: 1,
      defaultViewport: null,
      args: [`--window-size=1920,1080`],
    });
    thePage = await theBrowser.newPage();
    await thePage.goto("http://localhost:3000/login");
  });

  afterAll(async () => {
    await User.deleteOne({ email: "b@b.nl" });
    await mongoose.disconnect();
    await fetch("http://localhost:4000/testing/reset");
    await theBrowser.close();
  });

  test("User logs into his account", async () => {
    let email = "b@b.nl";
    let password = "12345678";

    await thePage.waitForTimeout(1500);
    await thePage.waitForTimeout("input[name=register]");
    await thePage.type("input[id=email]", email);
    await thePage.type("input[id=password]", password);
    await thePage.click('a[id="login"]');
  });

  test("User saves article", async () => {
    let url =
      "https://nos.nl/artikel/2364047-belgie-voerde-wel-avondklok-in-effect-moeilijk-vast-te-stellen.html";
    let title = "Belgie voert avondklok in";
    let tags = [
      ["Nieuws", "Belgie", "Avondklok"],
      ["Nieuws", "Corona", "Maatregelen"],
      ["Overheid", "Effect", "Moeilijk"],
    ];
    await thePage.waitForTimeout(2500);
    await thePage.click('a[id="hamburger"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('i[id="saveArticle"]');
    await thePage.waitForTimeout(1500);
    await thePage.type("input[id=url]", url);
    await thePage.type("input[id=title]", title);
    await thePage.type("input[class=input]", tags[0][0]);
    await thePage.type("input[class=input]", String.fromCharCode(13));
    await thePage.type("input[class=input]", tags[0][1]);
    await thePage.type("input[class=input]", String.fromCharCode(13));
    await thePage.type("input[class=input]", tags[0][2]);
    await thePage.type("input[class=input]", String.fromCharCode(13));
    await thePage.click("button[id=addTag");
    await thePage.waitForTimeout(500);
    await thePage.type("input[class=input]", tags[1][0]);
    await thePage.type("input[class=input]", String.fromCharCode(13));
    await thePage.type("input[class=input]", tags[1][1]);
    await thePage.type("input[class=input]", String.fromCharCode(13));
    await thePage.type("input[class=input]", tags[1][2]);
    await thePage.type("input[class=input]", String.fromCharCode(13));
    await thePage.click("button[id=addTag");
    await thePage.waitForTimeout(500);
    await thePage.type("input[class=input]", tags[2][0]);
    await thePage.type("input[class=input]", String.fromCharCode(13));
    await thePage.type("input[class=input]", tags[2][1]);
    await thePage.type("input[class=input]", String.fromCharCode(13));
    await thePage.type("input[class=input]", tags[2][2]);
    await thePage.type("input[class=input]", String.fromCharCode(13));
    await thePage.click("button[id=addTag");
    await thePage.waitForTimeout(500);
    await thePage.click('button[id="saveArticle"]');
    await thePage.waitForTimeout(2000);
  });

  test("User searches article by tags", async () => {
    await thePage.waitForTimeout(1500);
    await thePage.click('a[id="hamburger"]');
    await thePage.waitForTimeout(1500);
    await thePage.goto("http://localhost:3000/search");
    await thePage.waitForTimeout(2500);
    await thePage.click('button[id="searchByTags"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('input[name="Nieuws"]');
    await thePage.waitForTimeout(500);
    await thePage.click('input[name="Belgie"]');
    await thePage.waitForTimeout(500);
    await thePage.click('button[id="clearTag"]');
    await thePage.waitForTimeout(500);
    await thePage.click('input[name="Nieuws"]');
    await thePage.waitForTimeout(500);
    await thePage.click('button[id="searchTag"]');
    await thePage.waitForTimeout(1000);
    for (let i = 0; i < 70; i++) {
      await thePage.keyboard.press("ArrowDown");
      await thePage.keyboard.press("ArrowDown");
      await thePage.keyboard.press("ArrowDown");
    }
    await thePage.waitForTimeout(2500);
    await thePage.click('button[id="clearTag"]');
    await thePage.waitForTimeout(500);
    await thePage.click('input[name="Nieuws"]');
    await thePage.waitForTimeout(500);
    await thePage.click('input[name="Corona"]');
    await thePage.waitForTimeout(500);
    await thePage.click('input[name="Maatregelen"]');
    await thePage.waitForTimeout(500);
    await thePage.click('button[id="searchTag"]');
    await thePage.waitForTimeout(500);
    for (let i = 0; i < 70; i++) {
      await thePage.keyboard.press("ArrowDown");
      await thePage.keyboard.press("ArrowDown");
      await thePage.keyboard.press("ArrowDown");
    }
    await thePage.waitForTimeout(5000);
  });
});
