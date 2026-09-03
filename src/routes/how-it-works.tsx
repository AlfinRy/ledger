import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Code2,
  Server,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

export const Route = createFileRoute('/how-it-works')({
  head: () => ({
    meta: [{ title: 'How WebMCP Works | The Ledger' }],
  }),
  component: HowItWorksPage,
})

const tools = [
  ['search_club_records', 'Club name + date', 'Reservation and tab record'],
  ['lookup_pawn_ticket', 'Ticket number', 'Owner and account link'],
  ['decode_exchange_number', 'Exchange notation', 'Subscriber and motive'],
  ['query_suspect_alibi', 'Suspect name', 'Statement and contradiction'],
  ['accuse_suspect', 'Suspect + evidence keys', 'Confirmed case resolution'],
] as const

function HowItWorksPage() {
  return (
    <main id="main-content" className="explainer-page">
      <header className="explainer-hero">
        <Link className="back-link" to="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Return to case file
        </Link>
        <p className="machine-label">Architecture brief</p>
        <h1>The page gives each investigator a different instrument.</h1>
        <p>
          The human reads physical clues. The agent calls structured WebMCP
          tools. The visible System Log keeps their work in one shared frame.
        </p>
      </header>

      <section className="architecture" aria-labelledby="architecture-title">
        <h2 id="architecture-title">One tab, two kinds of access</h2>
        <ol className="architecture-flow">
          <li>
            <UserRound aria-hidden="true" strokeWidth={1.5} />
            <span>Human</span>
            <strong>Reads evidence</strong>
            <p>Names, dates, ticket numbers, and a damaged exchange code.</p>
          </li>
          <ArrowRight className="flow-arrow" aria-hidden="true" />
          <li>
            <Bot aria-hidden="true" strokeWidth={1.5} />
            <span>Agent</span>
            <strong>Calls WebMCP tools</strong>
            <p>Typed schemas replace screen scraping and ambiguous clicks.</p>
          </li>
          <ArrowRight className="flow-arrow" aria-hidden="true" />
          <li>
            <Server aria-hidden="true" strokeWidth={1.5} />
            <span>Server</span>
            <strong>Validates the case</strong>
            <p>TanStack server functions keep records and the solution private.</p>
          </li>
        </ol>
      </section>

      <section className="tool-chain" aria-labelledby="tool-chain-title">
        <div className="section-heading">
          <div>
            <p className="machine-label">Deterministic chain</p>
            <h2 id="tool-chain-title">Five narrow tools, one supported answer</h2>
          </div>
          <p>
            The first four operations are read-only. The accusation requires a
            visible human confirmation before the server evaluates it.
          </p>
        </div>
        <div
          className="tool-table-wrap"
          tabIndex={0}
          role="region"
          aria-label="WebMCP tool chain table"
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">Agent supplies</th>
                <th scope="col">Archive returns</th>
              </tr>
            </thead>
            <tbody>
              {tools.map(([name, input, output], index) => (
                <tr key={name}>
                  <th scope="row">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <code>{name}</code>
                  </th>
                  <td>{input}</td>
                  <td>{output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="security-notes" aria-labelledby="security-title">
        <div>
          <ShieldCheck size={30} strokeWidth={1.5} aria-hidden="true" />
          <h2 id="security-title">The browser mediates every call.</h2>
        </div>
        <ul>
          <li>
            <strong>Server-only case file</strong>
            <span>Solution data is excluded from the client bundle.</span>
          </li>
          <li>
            <strong>Lifecycle-bound registration</strong>
            <span>An AbortSignal removes all tools when the route unmounts.</span>
          </li>
          <li>
            <strong>Explicit permissions</strong>
            <span>Origin isolation and the tools permission policy are enabled.</span>
          </li>
          <li>
            <strong>Observable execution</strong>
            <span>Each call, argument set, result, and evidence key is logged.</span>
          </li>
        </ul>
      </section>

      <section className="explainer-cta">
        <div>
          <p className="machine-label">Case 47-B is open</p>
          <h2>Inspect the evidence before the archive.</h2>
        </div>
        <div className="cta-actions">
          <Link className="button button-primary" to="/">
            Open case file
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <a
            className="button button-ghost"
            href="https://github.com/AlfinRy/ledger"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={17} aria-hidden="true" />
            View source code
          </a>
        </div>
      </section>
    </main>
  )
}
