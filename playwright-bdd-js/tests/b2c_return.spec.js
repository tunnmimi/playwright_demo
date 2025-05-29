import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Đọc thông tin đăng nhập từ playwright.env.json
const envConfig = JSON.parse(fs.readFileSync('./playwright.env.json', 'utf-8'));

test('test', async ({ page }) => {
  const username = envConfig.username;
  const password = envConfig.password;

  // Đăng nhập
  await page.goto('https://dev-admin.onpoint.vn/sign_in');
  await page.waitForTimeout(1000);
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill(username);
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(1000);

  // Thao tác tiếp theo trên trang

  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'B2C Orders' }).click();
  await page.locator('.form-group > .form-control').click();
  await page.waitForTimeout(2000);
  await page.getByRole('textbox', { name: '#Order No' }).click();
  await page.getByRole('textbox', { name: '#Order No' }).fill('LDPNES-SRM38HOTWL');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.locator('div').filter({ hasText: /^LDPNES-SRM38HOTWL$/ }).getByRole('strong').click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(2000); // Chờ dữ liệu tải xong, có thể thay bằng `waitForSelector`
  const order = page.locator('div').filter({ hasText: /^LDPNES-SRM38HOTWL$/ });
  await order.waitFor({ state: 'visible' }); // Đảm bảo đơn hàng đã hiển thị
  await order.getByRole('strong').click();
  await page.locator('#order-476845-order-status').getByText('completed').click();
  await page.getByRole('link', { name: 'B2C Return Orders' }).click();
  await page.getByRole('button', { name: 'Create New' }).click();
  await page.getByRole('textbox', { name: 'WH Order No' }).click();
  await page.getByRole('textbox', { name: 'WH Order No' }).fill('LDPNES-SRM38HOTWL');
  await page.getByRole('textbox', { name: 'WH Order No' }).press('Enter');
  await page.locator('.css-1hwfws3').first().click();
  await page.locator('.css-1gtu0rj-indicatorContainer').click();
  await page.locator('#app > div.wrapper.vertical-layout.theme-primary.theme-primary.navbar-sticky > div.app-content.content.overflow-auto > div > div > section > form > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div.css-1hwfws3').click();
  await page.getByText('Voucher', { exact: true }).click();
  await page.locator('.css-yk16xz-control > .css-1hwfws3').first().click();
  await page.getByText('CS', { exact: true }).click();
  await page.getByRole('textbox', { name: 'remark' }).click();
  await page.getByRole('textbox', { name: 'remark' }).fill('tạo đơn B2B return bằng Playwright');
  await page.locator('div').filter({ hasText: /^Select\.\.\.$/ }).nth(3).click();
  await page.getByText('Giao Hàng Nhanh', { exact: true }).click();
  await page.getByRole('row', { name: 'skuoct_tunn_100 TestSKU 100' }).getByRole('checkbox').check();
  await page.locator('input[name="return_qty0"]').click();
  await page.locator('input[name="return_qty0"]').fill('1');
  await page.getByRole('row', { name: 'skuoct_tunn_100 TestSKU 100' }).getByRole('textbox').click();
  await page.getByRole('row', { name: 'skuoct_tunn_100 TestSKU 100' }).getByRole('textbox').fill('return 1');
  await page.getByRole('button', { name: 'Submit' }).nth(1).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
 
  await page.goto('https://dev-admin.onpoint.vn/oms/b2c_return_orders/edit/521');
  // Lấy mã đơn sau khi tạo thành công
  const selector = '#app > div.wrapper.vertical-layout.theme-primary.theme-primary.navbar-sticky > div.app-content.content.overflow-auto > div > div > section > form > div > div:nth-child(1) > div.header.card-title';

  // Click vào selector
  await page.locator(selector).click();
  
  // Lấy text của phần tử
  const text = await page.locator(selector).textContent();
  console.log(text);
  

  // Lấy text của phần tử
  const fullText = await page.locator(selector).textContent();
  console.log("Full Text:", fullText);

  // Trích xuất đoạn text từ RT..._dev
  const match = fullText.match(/RT.*?_dev/);
  const extractedText = match ? match[0] : "Không tìm thấy";

  console.log("Extracted Text:", extractedText);
  
  const b2creturn_orderCode = fullText.match(/RT[^\s]*?_dev/)[0]; // Lấy chuỗi từ RT đến _dev
  console.log(b2creturn_orderCode);


  if (b2creturn_orderCode) {
    try {
      // Lưu mã đơn vào file data.json
      const dataFile = '/Users/eq-0509/Desktop/tunn_folder/Opollo_playwright/data/data.json';
      const existingData = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf-8')) : {};
      existingData.latestOrderB2C = b2creturn_orderCode;

      fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2));
      console.log('Updated latestOrderB2C in data.json');
    } catch (error) {
      console.error('Error while saving order code:', error);
    }
  } else {
    console.error('Không lấy được mã đơn từ giao diện.');
  }
 // Quay lại trang B2C Rawait page.getByRole('button', { name: 'Login' }).click();eturn Orders
 await page.goto('https://dev-admin.onpoint.vn/oms/b2c_return_orders?');

 // Chờ cho đến khi trang tải xong
 await page.waitForTimeout(2000);  // Adjust time as necessary

 // Tìm và click vào mã đơn đã lưu
 const orderLink = page.locator(`text=${b2creturn_orderCode}`);
 if (await orderLink.isVisible()) {
   await orderLink.click();
   console.log(`Đã click vào mã đơn: ${b2creturn_orderCode}`);
 } else {
   console.error(`Không tìm thấy mã đơn ${b2creturn_orderCode} trên trang.`);
 }
});