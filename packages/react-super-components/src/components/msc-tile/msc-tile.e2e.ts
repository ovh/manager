import { expect, test } from '@playwright/test'

test('Should display badges on tile', async ({ page, baseURL }) => {
  console.log({ baseURL })
  await page.goto('http://localhost:6006/')
  await page.click('#atoms-msctile--with-badges')

  const elements = await page.locator('osds-chip slot')

  console.log({ elements })

  const badgeText = await page.getByText('Cloud computing')
  console.log({ badgeText, isVisible: await badgeText.isVisible, textContent: await badgeText.textContent() })

  console.log(await elements.textContent())

  expect(await elements.textContent()).toBe('Bare Metal Cloud')
})
