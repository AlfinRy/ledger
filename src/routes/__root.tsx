import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        name: 'description',
        content:
          'Solve the Vic Marlowe case with a human detective and a WebMCP-connected agent.',
      },
      { name: 'theme-color', content: '#111415' },
      { title: 'The Ledger | A WebMCP Noir Mystery' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to case file
        </a>
        <header className="site-header">
          <Link className="wordmark" to="/" aria-label="The Ledger case file">
            <span className="wordmark-mark" aria-hidden="true">
              TL
            </span>
            <span>
              <strong>The Ledger</strong>
              <small>Case 47-B</small>
            </span>
          </Link>
          <nav aria-label="Primary navigation">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ 'aria-current': 'page' }}
            >
              Case file
            </Link>
            <Link
              to="/how-it-works"
              activeProps={{ 'aria-current': 'page' }}
            >
              How it works
            </Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <span>Blue Orchid Police Archive</span>
          <span>WebMCP Challenge 2026</span>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}
