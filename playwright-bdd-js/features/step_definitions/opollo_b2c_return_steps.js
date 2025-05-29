const { Given, When, Then } = require('./opollo_common_steps'); // Nhập các bước từ file common_steps.js
const { expect, chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// ====== B2C Return Steps ======

When('I navigate to the B2C Return Orders page', async function () {
  await this.page.getByRole('link', { name: 'B2C Return Orders' }).click();
});

When('I click on Create New B2C return order', async function () {
  await this.page.getByRole('button', { name: 'Create New' }).click();
  await this.page.waitForTimeout(1000);
});

When('I enter {string} in the WH Order No field and press Enter', async function (whOrderNo) {
  const field = this.page.getByRole('textbox', { name: 'WH Order No' });
  await field.click();
  await field.fill(whOrderNo);
  await field.press('Enter');
  await this.page.waitForTimeout(1000);
});

When('I select a handle type', async function () {
  await this.page.locator('.css-1hwfws3').first().click();
  await this.page.getByText('Voucher', { exact: true }).click();
  await this.page.waitForTimeout(1000);
});

When('I select CS as the Paid Objec', async function () {
  await this.page.locator('.css-yk16xz-control > .css-1hwfws3').first().click();
  await this.page.waitForTimeout(1000);
  await this.page.getByText('CS', { exact: true }).click();
  await this.page.waitForTimeout(1000);
});

When('I enter {string} in the remark field', async function (remark) {
  const remarkField = this.page.getByRole('textbox', { name: 'remark' });
  await remarkField.click();
  await remarkField.fill(remark);
  await this.page.waitForTimeout(1000);
});

When('I select Giao Hàng Nhanh as the shipping method', async function () {
  await this.page.locator('div').filter({ hasText: /^Select\.\.\.$/ }).nth(3).click();
  await this.page.waitForTimeout(1000);
  await this.page.getByText('Giao Hàng Nhanh', { exact: true }).click();
});

When('I select SKU {string}', async function (sku) {
  await this.page.waitForTimeout(1000);
  await this.page.getByRole('row', { name: sku }).getByRole('checkbox').check();
});

When('I enter {string} as the return quantity', async function (quantity) {
  const qtyInput = this.page.locator('input[name="return_qty0"]');
  await this.page.waitForTimeout(1000);
  await qtyInput.click();
  await qtyInput.fill(quantity);
});

When('I click the Submit button', async function () {
  await this.page.waitForTimeout(1000);
  await this.page.getByRole('button', { name: 'Submit' }).nth(1).click();
});

When('I confirm the submission', async function () {
  await this.page.getByText('Are you sure you want to').click();
  await this.page.getByRole('button', { name: 'Confirm' }).click();
});

Then('I should see the order code starting with {string} and ending with {string}', async function (start, end) {
  const orderElement = await this.page.getByText(new RegExp(`${start}.*${end}`));
  const orderText = await orderElement.innerText();
  expect(orderText).toMatch(new RegExp(`^.*${start}.*${end}.*$`));
});

Then('I save the order code to {string}', async function (filename) {
  const orderText = await this.page.getByText(/RT.*_dev/).innerText();
  const match = orderText.match(/(RT.*_dev)/);

  if (match) {
    const latest_b2c_return_order = match[1];

    const dirPath = path.join(__dirname, '../../data');
    const filePath = path.join(dirPath, filename);

    fs.mkdirSync(dirPath, { recursive: true });
    let existingData = {};

    try {
      if (fs.existsSync(filePath)) {
        existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch (error) {
      console.warn(`${filename} không tồn tại hoặc có lỗi, sẽ tạo mới.`);
    }

    existingData.latest_b2c_return_order = latest_b2c_return_order;

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
    console.log(`✅ Đã lưu mã đơn hàng B2C mới nhất: ${latest_b2c_return_order}`);
  } else {
    throw new Error('Order code not found');
  }
});

When('I navigate to the B2C return orders page', async function () {
  await this.page.getByRole('link', { name: 'B2C Return Orders' }).first().click();
});

Then('I should be able to find and click on the saved order', async function () {
  const filePath = path.join(__dirname, '../../data/data.json');

  if (!fs.existsSync(filePath)) {
    throw new Error(`⚠️ File ${filePath} không tồn tại!`);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    throw new Error(`⚠️ Lỗi khi đọc file JSON: ${error.message}`);
  }

  const latest_b2c_return_order = data.latest_b2c_return_order;
  if (!latest_b2c_return_order) {
    throw new Error('⚠️ Không tìm thấy mã đơn hàng trong data.json');
  }

  console.log(`🔍 Tìm và click vào order: ${latest_b2c_return_order}`);
  await this.page.getByText(latest_b2c_return_order).click();
});
