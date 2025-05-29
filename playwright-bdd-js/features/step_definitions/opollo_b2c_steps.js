const { Given, When, Then } = require('./opollo_common_steps'); // Nhập các bước từ file common_steps.js
const { expect, chromium } = require('@playwright/test');
const fs = require('fs');


When('I navigate to the B2C order', async function () {
  await this.page.getByRole('link', { name: 'B2B Return Orders' }).click();
  await this.page.waitForTimeout(1000);
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

  // Cập nhật `latestOrderB2B`
  existingData.latestOrderB2B = this.orderCode;

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
    this.orderCode = storedData.latestOrderB2B;
  
    const orderLink = this.page.locator(`text=${this.orderCode}`);
    if (await orderLink.isVisible()) {
      await orderLink.click();
    } else {
      throw new Error(`Không tìm thấy mã đơn ${this.orderCode} trên trang.`);
    }
  
});
