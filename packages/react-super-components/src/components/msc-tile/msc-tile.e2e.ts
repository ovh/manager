import { expect, test } from '@playwright/test'
import fs from 'fs'

test.describe('Msc tile Stories', () => {
  test('Should display badges on tile', async ({ page, baseURL }) => {
    console.log({ baseURL })
    await page.goto('http://localhost:6006/')
    await page.click('#atoms-msctile--with-badges')

    const elements = page.locator('osds-chip')

    console.log({ elements })

    await expect(page.getByText('Cloud computing')).toBeVisible()

    console.log(await elements.textContent())

    expect(await elements.textContent()).toBe('Bare Metal Cloud')
  })
})
