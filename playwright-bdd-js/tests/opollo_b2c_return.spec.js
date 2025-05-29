import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://dev-admin.onpoint.vn/sign_in');
  await page.getByText('EmailPasswordRemember').click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('button', { name: 'Create New' }).click();
  await page.getByRole('textbox', { name: 'WH Order No' }).click();
  await page.getByRole('textbox', { name: 'WH Order No' }).click();
  await page.getByRole('textbox', { name: 'WH Order No' }).fill('LDPNES-SRM38HOTWL');
  await page.getByRole('textbox', { name: 'WH Order No' }).press('Enter');
  await page.locator('div').filter({ hasText: /^WH Order No \*Handle Type \*Select\.\.\.$/ }).locator('path').click();
  await page.locator('.css-1hwfws3').first().click();
  await page.getByText('Voucher', { exact: true }).click();
  await page.locator('.css-yk16xz-control > .css-1hwfws3').first().click();
  await page.getByText('CS', { exact: true }).click();
  await page.getByRole('textbox', { name: 'remark' }).click();
  await page.getByRole('textbox', { name: 'remark' }).fill('automation playwright');
  await page.locator('div').filter({ hasText: /^Select\.\.\.$/ }).nth(3).click();
  await page.getByText('Giao Hàng Nhanh', { exact: true }).click();
  await page.getByRole('row', { name: 'skuoct_tunn_100 TestSKU 100' }).getByRole('checkbox').check();
  await page.locator('input[name="return_qty0"]').click();
  await page.locator('input[name="return_qty0"]').fill('1');
  await page.getByRole('button', { name: 'Submit' }).nth(1).click();
  await page.getByText('Are you sure you want to').click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.getByText('B2C Return Information RT04-LDPNES-SRM38HOTWL_dev Push OrderSubmit').click();
});