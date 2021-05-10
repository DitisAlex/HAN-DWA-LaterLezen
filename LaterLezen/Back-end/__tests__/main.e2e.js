const fetch = require("node-fetch");

const puppeteer = require("puppeteer");
jest.setTimeout(250000);

xdescribe("Laterlezer e2e tests", () => {
  let theBrowser, thePage;

  beforeAll(async () => {
    await fetch("http://localhost:4000/testing/set");

    theBrowser = await puppeteer.launch({
      headless: false,
      slowMo: 3,
      defaultViewport: null,
      args: [`--window-size=1920,1080`],
    });
    thePage = await theBrowser.newPage();
    await thePage.goto("http://localhost:3000/");
  });

  afterAll(async () => {
    await fetch("http://localhost:4000/testing/reset");
    await theBrowser.close();
  });

  test("User tries to register a new account, where the passwords do not match", async () => {
    let email = "donaldtrump@americagreatagain.com";
    let firstname = "donald";
    let lastname = "trump";
    let password = "ditiseenwachtwoord";
    let password2 = "ditishettweedewachtwoord";
    await thePage.goto("http://localhost:3000/register");
    await thePage.waitForTimeout(1000);

    await thePage.waitForTimeout("input[name=register]");
    await thePage.type("input[name=email]", email);
    await thePage.type("input[name=firstname]", firstname);
    await thePage.type("input[name=lastname]", lastname);
    await thePage.type("input[name=password]", password);
    await thePage.type("input[name=confirmpassword]", password2);
    await thePage.click('input[name="register"]');
  });

  test("User registers a new account that already exists", async () => {
    const password = "ditiseenwachtwoord";

    await thePage.waitForTimeout(1500);
    await thePage.$eval(
      "input[name=password]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.$eval(
      "input[name=confirmpassword]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type("input[name=password]", password);
    await thePage.type("input[name=confirmpassword]", password);
    await thePage.click('input[name="register"]');
  });

  test("User registers a new account that does not exist yet", async () => {
    let email = "joebiden@usa.com";
    await thePage.waitForTimeout(1500);
    await thePage.waitForTimeout("input[name=register]");
    await thePage.$eval(
      "input[name=email]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type("input[name=email]", email);
    await thePage.click('input[name="register"]');
  });

  test("User clicks the hamburger menu and selects the option to save an article", async () => {
    let url =
      "https://www.nu.nl/politiek/6102049/wilders-gaf-donatie-van-175000-euro-voor-rechtszaak-niet-door-aan-kamer.html";
    let title = "horeca krijgt wellicht extra steun";
    let title2 =
      "Kamer laakt vaccinatiechaos, oppositie wil meer betrokkenheid van Rutte";
    let title3 =
      "Rutte: Theaters, bioscopen en musea mogen donderdag weer open";
    let url2 =
      "https://www.nu.nl/politiek/6100271/kamer-laakt-vaccinatiechaos-oppositie-wil-meer-betrokkenheid-van-rutte.html";
    let url3 =
      "https://www.nu.nl/cultuur-overig/6090311/rutte-theaters-bioscopen-en-musea-mogen-donderdag-weer-open.html?redirect=1";
    await thePage.waitForTimeout(1500);
    await thePage.click('a[id="hamburger"]');
    await thePage.waitForTimeout(1000);
    await thePage.click('i[id="saveArticle"]');
    await thePage.waitForTimeout(1500);
    await thePage.type('input[id="url"]', url);
    await thePage.type('input[id="title"]', title);
    await thePage.waitForTimeout(2500);

    await thePage.click('#chipsDiv [class="input"]');
    await thePage.type('#chipsDiv [class="input"]', "Horeca");
    await thePage.keyboard.press("Enter");
    await thePage.click('#chipsDiv [class="input"]');
    await thePage.type('#chipsDiv [class="input"]', "Steun");
    await thePage.keyboard.press("Enter");
    await thePage.waitForTimeout(3000);
    await thePage.click('button[id="addTag"]');
    await thePage.click('button[id="saveArticle"]');
    await thePage.waitForTimeout(5000);
    await thePage.$eval(
      "input[id=url]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type('input[id="url"]', url2);
    await thePage.$eval(
      "input[id=title]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type('input[id="title"]', title2);
    await thePage.click('i[id="deleteTag"]');
    await thePage.click('#chipsDiv [class="input"]');
    await thePage.type('#chipsDiv [class="input"]', "Rutte");
    await thePage.keyboard.press("Enter");
    await thePage.click('#chipsDiv [class="input"]');
    await thePage.type('#chipsDiv [class="input"]', "Vaccinatiechaos");
    await thePage.keyboard.press("Enter");
    await thePage.waitForTimeout(3000);
    await thePage.click('button[id="addTag"]');
    await thePage.click('button[id="saveArticle"]');
    await thePage.waitForTimeout(5000);
    await thePage.$eval(
      "input[id=url]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type('input[id="url"]', url3);
    await thePage.$eval(
      "input[id=title]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type('input[id="title"]', title3);
    await thePage.click('i[id="deleteTag"]');
    await thePage.click('#chipsDiv [class="input"]');
    await thePage.type('#chipsDiv [class="input"]', "Rutte");
    await thePage.keyboard.press("Enter");
    await thePage.click('#chipsDiv [class="input"]');
    await thePage.type('#chipsDiv [class="input"]', "bioscopen");
    await thePage.keyboard.press("Enter");
    await thePage.type('#chipsDiv [class="input"]', "musea");
    await thePage.keyboard.press("Enter");
    await thePage.waitForTimeout(3000);
    await thePage.click('button[id="addTag"]');
    await thePage.click('button[id="saveArticle"]');
    await thePage.waitForTimeout(5000);
    await thePage.click('a[id="hamburger"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('i[id="dashboard"]');
    await thePage.waitForTimeout(3000);
  });

  test("user clicks an article to read", async () => {
    let title = "Horeca wordt gered door het parlement";
    let source = "www.nu.nl";
    let author = "Jan Kooiman";
    let description =
      "2020. Het jaar waarin corona alles veranderde. We hebben met elkaar veel bereikt, maar zijn er nog lang niet. We moeten samen nog veel meer voor elkaar krijgen, dus we blijven ons hard maken voor het herstel van de horeca";
    for (let i = 0; i < 12; i++) {
      await thePage.keyboard.press("ArrowDown");
    }
    await thePage.click('a[id="seeArticle"]');
    await thePage.waitForTimeout(2500);
    await thePage.waitForTimeout(1500);
    await thePage.click('i[id="editArticle"]');
    await thePage.waitForTimeout(1500);
    await thePage.$eval(
      "input[id=title-input]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.waitForTimeout(1500);
    await thePage.type('input[id="title-input"]', "");
    await thePage.waitForTimeout(5000);
    await thePage.click('i[id="editArticle"]');
    await thePage.waitForTimeout(1500);
    await thePage.type('input[id="title-input"]', title);
    await thePage.$eval(
      "input[id=author-input]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type('input[id="author-input"]', author);
    await thePage.$eval(
      "input[id=source-input]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type('input[id="source-input"]', source);
    await thePage.$eval(
      "textarea[id=description-input]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type('textarea[id="description-input"]', description);
    await thePage.click('#chipsDiv [class="input"]');
    await thePage.type('#chipsDiv [class="input"]', "Amsterdam");
    await thePage.keyboard.press("Enter");
    await thePage.click('#chipsDiv [class="input"]');
    await thePage.type('#chipsDiv [class="input"]', "klanten");
    await thePage.keyboard.press("Enter");
    await thePage.click('#chipsDiv [class="input"]');
    await thePage.type('#chipsDiv [class="input"]', "hebberig");
    await thePage.keyboard.press("Enter");
    await thePage.waitForTimeout(3500);
    await thePage.click('button[id="addTag"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('i[id="editArticle"]');
    await thePage.waitForTimeout(1500);
    for (let i = 0; i < 20; i++) {
      await thePage.keyboard.press("ArrowDown");
    }
    await thePage.waitForTimeout(3000);
    await thePage.click('button[id="preferenceButton"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('div[id="typewriter"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('div[id="dark"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('div[id="cancelPreferences"]');
    await thePage.waitForTimeout(1500);
    await thePage.focus('div[id="root"]');
    await thePage.click('div[id="root"]');
    await thePage.click('div[id="root"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('button[id="preferenceButton"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('div[id="darkblue"]');
    await thePage.waitForTimeout(1000);
    await thePage.click('div[id="savePreferences"]');
    await thePage.waitForTimeout(1000);
    await thePage.click('div[id="root"]');
    await thePage.focus('div[id="root"]');
    await thePage.click('div[id="root"]');
    await thePage.click('div[id="root"]');
    await thePage.waitForTimeout(1000);
    for (let i = 0; i < 60; i++) {
      await thePage.keyboard.press("ArrowDown");
    }
    await thePage.waitForTimeout(5000);
    await thePage.focus('a[id="originalArticle"]');
    await thePage.waitForTimeout(2500);
    await thePage.click('a[id="originalArticle"]');
    await thePage.waitForTimeout(2500);
    await thePage.goBack();
    await thePage.waitForTimeout(2500);
    await thePage.click('a[id="hamburger"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('i[id="dashboard"]');
  });

  test("User logs out of the LaterLezer app", async () => {
    await thePage.waitForTimeout(1500);
    await thePage.click('a[id="hamburger"]');
    await thePage.waitForTimeout(1000);
    await thePage.click('i[id="logout"]');
    await thePage.waitForTimeout(2500);
  });

  test("User logs in the webpage with wrong password", async () => {
    let email = "joebiden@usa.com";
    let password = "ditiseenwachtwoord1";
    await thePage.type('input[id="email"]', email);
    await thePage.type('input[id="password"]', password);
    await thePage.waitForTimeout(1500);
    await thePage.click('a[id="login"]');
    await thePage.waitForTimeout(4000);
  });

  test("User logs in the webpage with right password", async () => {
    let email = "joebiden@usa.com";
    let password = "ditiseenwachtwoord";
    await thePage.$eval(
      "input[id=email]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type('input[id="email"]', email);
    await thePage.waitForTimeout(500);
    await thePage.$eval(
      "input[id=password]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type('input[id="password"]', password);
    await thePage.waitForTimeout(1500);
    await thePage.click('a[id="login"]');
    await thePage.waitForTimeout(4000);
  });

  test("User searches for an article", async () => {
    await thePage.click('a[id="hamburger"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('i[id="search"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('button[id="metaData"]');
    await thePage.waitForTimeout(7500);
    await thePage.type('input[id="searchArticle"]', "rutte");
    await thePage.waitForTimeout(1500);
    await thePage.click('button[id="searchButton"]');
    await thePage.waitForTimeout(3500);
    await thePage.waitForTimeout(1000);
    for (let i = 0; i < 60; i++) {
      await thePage.keyboard.press("ArrowDown");
    }
    await thePage.waitForTimeout(2500);
    for (let i = 0; i < 60; i++) {
      await thePage.keyboard.press("ArrowUp");
    }
    await thePage.waitForTimeout(2000);
    await thePage.$eval(
      "input[id=searchArticle]",
      (input, value) => (input.value = value),
      ""
    );
    await thePage.type('input[id="searchArticle"]', "coalitie");
    await thePage.waitForTimeout(1500);
    await thePage.click('input[id="contentSearch"]');
    await thePage.waitForTimeout(1500);
    await thePage.click('button[id="searchButton"]');
    await thePage.waitForTimeout(3500);
    for (let i = 0; i < 60; i++) {
      await thePage.keyboard.press("ArrowDown");
    }
    await thePage.waitForTimeout(5000);
    for (let i = 0; i < 60; i++) {
      await thePage.keyboard.press("ArrowUp");
    }
  });
});
