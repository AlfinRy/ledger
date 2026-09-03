import { expect, test, type Page } from '@playwright/test'

async function installWebMcpMock(page: Page) {
  await page.addInitScript(() => {
    const tools: Record<string, WebMcpTool> = {}
    Object.defineProperty(window, '__ledgerTools', {
      configurable: true,
      value: tools,
    })
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: {
        async registerTool(tool: WebMcpTool) {
          tools[tool.name] = tool
        },
      },
    })
  })
}

async function executeTool(
  page: Page,
  toolName: string,
  input: Record<string, unknown>,
) {
  return page.evaluate(
    async ({ name, args }) => {
      const tools = (
        window as typeof window & { __ledgerTools: Record<string, WebMcpTool> }
      ).__ledgerTools
      return tools[name].execute(args, { signal: new AbortController().signal })
    },
    { name: toolName, args: input },
  )
}

test.beforeEach(async ({ page }) => {
  await installWebMcpMock(page)
  await page.goto('/')
  await expect(page.getByText('Archive connected')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('explains the collaboration model and registers five tools', async ({
  page,
}) => {
  await expect(
    page.getByRole('heading', { name: 'Who killed Vic Marlowe?' }),
  ).toBeVisible()
  await expect(page.getByText('You inspect the evidence.')).toBeVisible()
  await expect(page.getByText('Your agent searches the archive.')).toBeVisible()

  const toolNames = await page.evaluate(() =>
    Object.keys(
      (
        window as typeof window & { __ledgerTools: Record<string, WebMcpTool> }
      ).__ledgerTools,
    ).sort(),
  )
  expect(toolNames).toEqual([
    'accuse_suspect',
    'decode_exchange_number',
    'lookup_pawn_ticket',
    'query_suspect_alibi',
    'search_club_records',
  ])
})

test('shows archive tool calls in the shared System Log', async ({ page }) => {
  await executeTool(page, 'search_club_records', {
    club_name: 'The Sable Room',
    date: 'Oct 3',
  })

  const log = page.getByRole('log')
  await expect(log.getByText('search_club_records')).toBeVisible()
  await expect(log.getByText(/Reservation ledger located/)).toBeVisible()
  await expect(log.getByText('club_account_p771')).toBeVisible()
})

test('requires human confirmation and closes the supported case', async ({
  page,
}) => {
  await executeTool(page, 'lookup_pawn_ticket', { ticket_number: 'PT-771' })
  await executeTool(page, 'query_suspect_alibi', {
    suspect_name: 'Arlene Voss',
  })

  await page.evaluate(() => {
    const tools = (
      window as typeof window & {
        __ledgerTools: Record<string, WebMcpTool>
        __accusationResult?: Promise<unknown>
      }
    ).__ledgerTools
    ;(
      window as typeof window & { __accusationResult?: Promise<unknown> }
    ).__accusationResult = tools.accuse_suspect.execute(
      {
        suspect_name: 'Arlene Voss',
        evidence_keys: ['pawn_ticket_link', 'tab_open_past_alibi'],
      },
      { signal: new AbortController().signal },
    ) as Promise<unknown>
  })

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('Arlene Voss')).toBeVisible()
  await page.getByRole('button', { name: 'Authorize accusation' }).click()

  await page.evaluate(() =>
    (
      window as typeof window & { __accusationResult?: Promise<unknown> }
    ).__accusationResult,
  )
  await expect(page.getByText('Closed with supporting evidence')).toBeVisible()
})
