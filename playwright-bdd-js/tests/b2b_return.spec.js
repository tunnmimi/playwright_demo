import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Đọc thông tin đăng nhập từ playwright.env.json
const envConfig = JSON.parse(fs.readFileSync('./playwright.env.json', 'utf-8'));

test('test', async ({ page }) => {
  const username = envConfig.username;
  const password = envConfig.password;

  // Đăng nhập
  await page.goto('https://dev-admin.onpoint.vn/sign_in');
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill(username);
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(1000);

  // Thao tác tiếp theo trên trang

  await page.getByRole('link', { name: 'B2B Return Orders' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForTimeout(1000);
  await page.locator('input[name="b2b_order_code"]').click();
  await page.waitForTimeout(1000);
  await page.locator('input[name="b2b_order_code"]').fill('TTN-240158_dev\t');
  await page.waitForTimeout(1000);
  await page.getByText('B2B Return InformationSave as').click();
  await page.waitForTimeout(1000);
  await page.locator('input[name="b2b_order_code"]').click();
  await page.waitForTimeout(1000);
  await page.locator('input[name="b2b_order_code"]').fill('TTN-240158_dev\t');
  await page.waitForTimeout(1000);
  await page.getByText('B2B Return InformationSave as draftSubmitB2B Order Code *Order TypeCompany Name').click();
  await page.locator('div').filter({ hasText: /^Select\.\.\.$/ }).nth(3).click();
  await page.waitForTimeout(1000);
  await page.getByText('Comming expired Date', { exact: true }).click();
  await page.getByPlaceholder('Note').click();
  await page.getByPlaceholder('Note').fill('create B2B order by playwright');
  await page.waitForTimeout(1000);
  await page.getByRole('checkbox').check();
  await page.waitForTimeout(1000);
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('1');
  await page.waitForTimeout(1000);
  await page.getByText('Document InfomationUploadFile').click();
  await page.getByRole('button', { name: 'Submit' }).nth(1).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.waitForTimeout(1000);
  
    // Lấy mã đơn sau khi tạo thành công
  const orderCode = await page.textContent('#app > div.wrapper.vertical-layout.theme-primary.theme-primary.navbar-sticky > div.app-content.content.overflow-auto > div > section > div.row > div:nth-child(3) > section > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2) > a');
  console.log(`Fetched order code: ${orderCode}`);

  if (orderCode) {
    try {
      // Lưu mã đơn vào file data.json
      const dataFile = '/Users/eq-0509/Desktop/tunn_folder/Opollo_playwright/data/data.json';
      const existingData = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf-8')) : {};
      existingData.latestOrderB2B = orderCode;

      fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2));
      console.log('Updated latestOrderB2C in data.json');
    } catch (error) {
      console.error('Error while saving order code:', error);
    }
  } else {
    console.error('Không lấy được mã đơn từ giao diện.');
  }
 // Quay lại trang B2B Rawait page.getByRole('button', { name: 'Login' }).click();eturn Orders
 await page.goto('https://dev-admin.onpoint.vn/oms/b2b_return_orders?');

 // Chờ cho đến khi trang tải xong
 await page.waitForTimeout(2000);  // Adjust time as necessary

 // Tìm và click vào mã đơn đã lưu
 const orderLink = page.locator(`text=${orderCode}`);
 if (await orderLink.isVisible()) {
   await orderLink.click();
   console.log(`Đã click vào mã đơn: ${orderCode}`);
 } else {
   console.error(`Không tìm thấy mã đơn ${orderCode} trên trang.`);
 }
});