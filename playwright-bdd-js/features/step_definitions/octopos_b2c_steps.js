const { Given, When, Then, setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { expect, chromium } = require('@playwright/test');
const fs = require('fs');

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
  await this.init();
});

After(async function () {
  await this.cleanup();
});

Given("I open the admin octopos login page", async function () {
  await this.page.goto('https://dev-octopos-app.onpoint.vn/auth/login');
});

When('I log in with valid credentials', async function () {
  const envConfig = JSON.parse(fs.readFileSync('./playwright.env.json', 'utf-8'));
  await this.page.getByPlaceholder('Tên đăng nhập').fill(envConfig.octopos_username);
  await this.page.getByPlaceholder('Mật khẩu').fill(envConfig.octopos_password);
  await this.page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
});

Then('I should see the dashboard', async function () {
  await expect(this.page).toHaveURL(/report/);
});


When('I navigate to the B2C order', async function () {
  await this.page.getByRole('link', { name: 'Đơn B2C' }).click();
  await this.page.waitForTimeout(1000);
});

When('I find {string} as the B2C order code', async function (orderCode) {
  const searchInput = this.page.locator('input[name="Tìm theo mã đơn"]');
  await searchInput.fill(orderCode);
  await searchInput.press('Enter');
  await this.page.waitForLoadState('networkidle'); // Chờ danh sách cập nhật
});

Then('I should see the order {string} in the listing', async function (orderCode) {
  const orderRow = this.page.locator(`xpath=//table//tr[td[contains(text(), "${orderCode}")]]`);
  await expect(orderRow).toBeVisible();
});


// When('I enter {string} in the quantity field', async function (quantity) {
//   await this.page.getByRole('spinbutton').fill(quantity);
// });

// When('I upload the required document', async function () {
//   await this.page.getByText('Document InfomationUploadFile').click();
// });

// When('I submit the order', async function () {
//   await this.page.getByRole('button', { name: 'Submit' }).nth(1).click();
// });

// When('I confirm the submission', async function () {
//   await this.page.getByRole('button', { name: 'Confirm' }).click();
// });

// Then('I should see the newly created order in the list', async function () {
//   const orderCode = await this.page.textContent('table tbody tr:nth-child(1) td:nth-child(2) a');
//   this.orderCode = orderCode.trim();
//   const path = require('path');
//   expect(this.orderCode).not.toBeNull();

//   // Đọc dữ liệu hiện có
//   const dataFile = path.join(__dirname, '../../data/data.json');
//   let existingData = {};
//   try {
//     existingData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
//   } catch (error) {
//     console.warn('data.json không tồn tại hoặc có lỗi, sẽ tạo mới.');
//   }

//   // Cập nhật `latestOrderB2B`
//   existingData.latestOrderB2B = this.orderCode;

//   // Ghi lại vào `data.json`
//   fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2), 'utf-8');

//   console.log(`✅ Đã lưu mã đơn hàng B2B mới nhất: ${this.orderCode}`)
// });

// When('I navigate back to the B2B Return Orders page', async function () {
//   await this.page.goto('https://dev-admin.onpoint.vn/oms/b2b_return_orders?');
//   await this.page.waitForTimeout(2000);
// });

// Then('I should be able to find and click on the newly created order', async function () {
//     const dataFile = path.join(__dirname, '../../data.json');
//     const storedData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
//     this.orderCode = storedData.latestOrderB2B;
  
//     const orderLink = this.page.locator(`text=${this.orderCode}`);
//     if (await orderLink.isVisible()) {
//       await orderLink.click();
//     } else {
//       throw new Error(`Không tìm thấy mã đơn ${this.orderCode} trên trang.`);
//     }
  
// })
;
