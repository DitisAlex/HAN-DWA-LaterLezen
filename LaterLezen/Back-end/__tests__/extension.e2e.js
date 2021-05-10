const mongoose = require("mongoose");
const User = require("../models/User");
const puppeteer = require("puppeteer");

describe("Laterlezer extension e2e tests", () => {
  let extensionBrowser, webBrowser, extensionPage, webPage;

  jest.setTimeout(100000);
  const testEmail = "extensietest@test.com";
  const testFirstName = "extensie";
  const testLastName = "tester";
  const testPassword = "extensievetest";

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
      tags: {
        tagName: "/",
        subTags: [],
      },
    });
    extensionBrowser = await puppeteer.launch({
      headless: false,
      slowMo: 5,
      defaultViewport: null,
      devtools: false,
      args: ["--window-size=700,800", "--window-position=0,0"],
    });
    extensionPage = await extensionBrowser.newPage();
    await extensionPage.goto("http://localhost:3001/");

    webBrowser = await puppeteer.launch({
      headless: false,
      slowMo: 5,
      defaultViewport: null,
      devtools: false,
      args: ["--window-size=700,800", "--window-position=730,0"],
    });
    webPage = await webBrowser.newPage();
    await webPage.goto("http://localhost:3000/login");
  });

  afterAll(async () => {
    await User.deleteOne({ email: testEmail });
    await mongoose.disconnect();

    await extensionBrowser.close();
    await webBrowser.close();
  });

  test("User logs in webapplication", async () => {
    await webPage.waitForTimeout(1500);
    await webPage.type("input[id=email]", testEmail);
    await webPage.type("input[id=password]", testPassword);
    await webPage.click('a[id="login"]');
  });

  test("User logs in with empty password", async () => {
    await extensionPage.type('input[class="email"]', testEmail);

    await extensionPage.click('button[id="ext-login-button"]');
    await extensionPage.waitForTimeout(3000);
  });

  test("User logs in with the correct credentials", async () => {
    await extensionPage.type('input[class="password"]', testPassword);
    await extensionPage.click('button[id="ext-login-button"]');
    await extensionPage.waitForTimeout(3000);
  });
  test("User tries to add an article with the wrong URL format", async () => {
    const wrongURL = "dit is geen geldige url!";

    await extensionPage.type('input[id="ext-url"]', wrongURL);
    await extensionPage.click('button[id="ext-save-article"]');
    await extensionPage.waitForTimeout(3000);
  });

  test("User tries to add an article with the correct URL format", async () => {
    await extensionPage.$eval(
      "input[id=ext-url]",
      (input, value) => (input.value = value),
      ""
    );
    await extensionPage.type(
      'input[id="ext-url"]',
      "https://www.nu.nl/verkiezingen-vs/6092489/trump-accepteert-verkiezingsuitslag-en-is-woedend-op-capitool-bestormers.html"
    );
    await extensionPage.type(
      'input[id="ext-title"]',
      "Trump is woedend op Capitool-bestormers"
    );
    await extensionPage.click('button[id="ext-save-article"]');
    await extensionPage.waitForTimeout(3500);
  });

  test("User scrolls down in Dasboard", async () => {
    for (let i = 0; i < 20; i++) {
      await webPage.keyboard.press("ArrowDown");
    }
  });

  test("User logs out", async () => {
    await extensionPage.click('button[id="ext-logout"]');
    await extensionPage.waitForTimeout(3000);
  });
});
