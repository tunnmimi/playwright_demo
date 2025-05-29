const { Given, When, Then, setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { expect, chromium } = require('@playwright/test');
const fs = require('fs');

class CustomWorld {
  async init() {
    this.browser = await chromium.launch({ headless: true }); // Chạy browser không headless để debug
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }
  async cleanup() {
    await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  await this.init();
});

After(async function () {
  await this.cleanup();
});

Given('I open the admin login page', async function () {
  await this.page.goto('https://dev-admin.onpoint.vn/sign_in');
});

When('I log in with valid credentials', async function () {
  const envConfig = JSON.parse(fs.readFileSync('./playwright.env.json', 'utf-8'));
  await this.page.getByPlaceholder('Email').fill(envConfig.opollo_username);
  await this.page.getByPlaceholder('Password').fill(envConfig.opollo_password);
  await this.page.getByRole('button', { name: 'Login' }).click();
  await this.page.waitForTimeout(1000);
});

Then('I should see the dashboard', async function () {
  await expect(this.page).toHaveURL(/orders/);
});

// Export các bước cần thiết
module.exports = { 
  Given,
  When,
  Then,
  setWorldConstructor,
  Before,
  After,
};
