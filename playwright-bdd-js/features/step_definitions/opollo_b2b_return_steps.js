const { Given, When, Then } = require('./opollo_common_steps'); // Nhập các bước từ file common_steps.js
const { expect, chromium } = require('@playwright/test');
const fs = require('fs');

When('I navigate to the B2B Return Orders page', async function () {
  await this.page.getByRole('link', { name: 'B2B Return Orders' }).click();
  await this.page.waitForTimeout(1000);
});

When('I click the {string} button', async function (buttonName) {
  await this.page.getByRole('button', { name: buttonName }).click();
  await this.page.waitForTimeout(1000);
});

When('I enter {string} as the B2B order code', async function (orderCode) {
  await this.page.locator('input[name="b2b_order_code"]').fill(orderCode);
});

When('I select {string} as the return reason', async function (reason) {
  await this.page.waitForTimeout(1000);
  await this.page.getByText('B2B Return InformationSave as draftSubmitB2B Order Code *Order TypeCompany Name').click();
  await this.page.locator('div').filter({ hasText: /^Select\.\.\.$/ }).nth(3).click();
  await this.page.waitForTimeout(1000);
  await this.page.getByText('Comming expired Date', { exact: true }).click();
});

When('I enter {string} in the Note field', async function (note) {
  await this.page.getByPlaceholder('Note').fill(note);
});

When('I check the confirmation checkbox', async function () {
  await this.page.getByRole('checkbox').check();
});

When('I enter {string} in the quantity field', async function (quantity) {
  await this.page.getByRole('spinbutton').fill(quantity);
});

When('I upload the required document', async function () {
  await this.page.getByText('Document InfomationUploadFile').click();
});

When('I submit the order', async function () {
  await this.page.getByRole('button', { name: 'Submit' }).nth(1).click();
});

When('I confirm the submission', async function () {
  await this.page.getByRole('button', { name: 'Confirm' }).click();
});

Then('I should see the newly created order in the list', async function () {
  const orderCode = await this.page.textContent('table tbody tr:nth-child(1) td:nth-child(2) a');
  this.orderCode = orderCode.trim();
  const path = require('path');
  expect(this.orderCode).not.toBeNull();

  // Đọc dữ liệu hiện có
  const dataFile = path.join(__dirname, '../../data/data.json');
  let existingData = {};
  try {
    existingData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  } catch (error) {
    console.warn('data.json không tồn tại hoặc có lỗi, sẽ tạo mới.');
  }

  // Cập nhật `latest_b2b_return_order`
  existingData.latest_b2b_return_order = this.orderCode;

  // Ghi lại vào `data.json`
  fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2), 'utf-8');

  console.log(`✅ Đã lưu mã đơn hàng B2B mới nhất: ${this.orderCode}`)
});

When('I navigate back to the B2B Return Orders page', async function () {
  await this.page.goto('https://dev-admin.onpoint.vn/oms/b2b_return_orders?');
  await this.page.waitForTimeout(2000);
});

Then('I should be able to find and click on the newly created order', async function () {
  const dataFile = path.join(__dirname, '../../data.json');
  const storedData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  this.orderCode = storedData.latest_b2b_return_order;

  const orderLink = this.page.locator(`text=${this.orderCode}`);
  if (await orderLink.isVisible()) {
    await orderLink.click();
  } else {
    throw new Error(`Không tìm thấy mã đơn ${this.orderCode} trên trang.`);
  }
});
