const { Given, When, Then, setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { expect, chromium } = require('@playwright/test');
const fs = require('fs');
const path = './data.json'; // Define the path to your JSON file



class CustomWorld {
  async init() {
    this.browser = await chromium.launch({ headless: false }); // Chạy browser không headless để debug
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }
  async cleanup() {
    await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  try {
    await this.init();
  } catch (err) {
    console.error('Error launching browser:', err);
  }
});


After(async function () {
  await this.cleanup();
});

Given('I navigate to the Nestle Vietnam product page', async ({ page }) => {
  await page.goto('https://dev-landing.onpoint.vn/nestle-vietnam?type=1691036226384');
  await orderConfirmation.waitFor({ state: 'visible', timeout: 60000 }); // 60 seconds
});

When('I add products to the cart and fill in the order details', async ({ page }) => {
  await page.locator('#p-41137nestle-2').getByRole('button', { name: 'MUA NGAY' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.locator('input[name="full_name"]').click();
  await page.locator('input[name="full_name"]').fill('test');
  await page.locator('input[name="email"]').click();
  await page.locator('input[name="email"]').fill('123@gmail.com');
  await page.locator('input[name="phone"]').click();
  await page.locator('input[name="phone"]').fill('0326720266');
  await page.locator('select[name="order\\[province_id\\]"]').selectOption('2');
  await page.locator('#js-district').selectOption('1');
  await page.locator('select[name="order\\[ward_id\\]"]').selectOption('2');
  await page.locator('input[name="address"]').click();
  await page.locator('input[name="address"]').fill('27B Nguyen Dinh Chieu');
});

When('I select the shipping method and payment method', async ({ page }) => {
  await page.getByText('Giao Hàng Nhanh').click();
  await page.getByText('COD').click();
});

Then('I should be able to successfully place the order', async ({ page }) => {
  await page.getByRole('button', { name: 'Đặt hàng' }).click();

  // Wait for the order confirmation to appear
  const orderConfirmation = await page.locator('text=LDPNES-'); // This assumes the order code starts with 'LDPNES-'
  await orderConfirmation.waitFor({ state: 'visible' });

  // Extract the order code (this is just an example; modify it as needed to match the actual pattern)
  const orderCode = await orderConfirmation.textContent();

  // Log the order code (optional)
  console.log('Order code:', orderCode);

  // Read the existing data from data.json
  const data = JSON.parse(fs.readFileSync(path, 'utf-8'));

  // Save the new order code to the data object (it will overwrite the old code if any)
  data.b2c_order_code = orderCode;

  // Write the updated data back to data.json
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
});
