
import { test, expect } from '@playwright/test';
test('test', async ({ page }) => {

  await page.goto('https://dev-landing.onpoint.vn/nestle-vietnam?type=1691036226384');
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
  await page.locator('#js-district').selectOption('16');
  await page.locator('#js-district').selectOption('19');
  await page.locator('#js-district').selectOption('1');
  await page.locator('select[name="order\\[ward_id\\]"]').selectOption('2');
  await page.locator('input[name="address"]').click();
  await page.locator('input[name="address"]').fill('27B Nguyen Dinh Chieu');
  await page.getByText('Giao Hàng Nhanh').click();
  await page.getByText('COD').click();
  await page.getByRole('button', { name: 'Đặt hàng' }).click();
  await page.getByText('LDPNES-SU7J1PO3EW').click();
});