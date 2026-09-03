import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const securityHeaders = {
  'origin-agent-cluster': '?1',
  'permissions-policy': 'tools=(self)',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
} as const

for (const path of ['/', '/how-it-works'] as const) {
  test(`${path} has no automatically detectable WCAG A or AA violations`, async ({
    page,
  }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([])
  })
}

test('serves the required browser security policy', async ({ request }) => {
  const response = await request.get('/')

  expect(response.ok()).toBe(true)
  expect(response.headers()).toMatchObject(securityHeaders)
})

test('keyboard users can reveal and use the skip link', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')

  const skipLink = page.getByRole('link', { name: 'Skip to case file' })
  await expect(skipLink).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeInViewport()
})
