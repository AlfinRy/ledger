import { createFileRoute } from '@tanstack/react-router'
import { CircleDot, LockKeyhole, Radio, Unplug } from 'lucide-react'

import { AccusationConfirmationDialog } from '../components/accusation-confirmation-dialog'
import { AgentPromptCopy } from '../components/agent-prompt-copy'
import { EvidenceLedgerPage } from '../components/evidence-ledger-page'
import { EvidencePawnTicket } from '../components/evidence-pawn-ticket'
import { EvidencePhoto } from '../components/evidence-photo'
import { SystemLog } from '../components/system-log'
import {
  useWebMcpTools,
  type WebMcpStatus,
} from '../hooks/use-webmcp-tools'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'Who Killed Vic Marlowe? | The Ledger',
      },
    ],
  }),
  component: CasePage,
})

const statusCopy: Record<
  WebMcpStatus,
  { title: string; detail: string; tone: string }
> = {
  checking: {
    title: 'Checking browser',
    detail: 'Looking for the WebMCP interface.',
    tone: 'pending',
  },
  registering: {
    title: 'Opening archive',
    detail: 'Registering five case tools.',
    tone: 'pending',
  },
  ready: {
    title: 'Archive connected',
    detail: 'Five WebMCP tools are ready.',
    tone: 'ready',
  },
  unsupported: {
    title: 'WebMCP unavailable',
    detail: 'Use a supported Chrome build in a secure context.',
    tone: 'offline',
  },
  error: {
    title: 'Archive blocked',
    detail: 'Browser policy refused tool registration.',
    tone: 'offline',
  },
}

function ConnectionStatus({
  status,
  error,
}: {
  status: WebMcpStatus
  error: string | null
}) {
  const copy = statusCopy[status]
  const Icon = status === 'unsupported' || status === 'error' ? Unplug : Radio

  return (
    <div className={`connection-status connection-${copy.tone}`} role="status">
      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      <span>
        <strong>{copy.title}</strong>
        <small>{error ?? copy.detail}</small>
      </span>
      <span className="connection-light" aria-hidden="true" />
    </div>
  )
}

function CasePage() {
  const { status, error } = useWebMcpTools()

  return (
    <main id="main-content" className="case-page">
      <section className="case-intro" aria-labelledby="case-title">
        <div className="case-meta">
          <span>Homicide · Case 47-B</span>
          <span>October 6, 1947 · 01:17 AM</span>
        </div>
        <div className="case-title-row">
          <div>
            <p className="case-location">Blue Orchid, Marlowe's office</p>
            <h1 id="case-title">Who killed Vic Marlowe?</h1>
          </div>
          <p className="case-brief">
            Three suspects. One contradiction. The evidence is split between
            you and an agent with access to a locked police archive.
          </p>
        </div>
        <div className="asymmetry-explainer" aria-label="How the investigation works">
          <div>
            <span className="role-number">01</span>
            <p>
              <strong>You inspect the evidence.</strong>
              Read the photograph, pawn ticket, and burned ledger below.
            </p>
          </div>
          <span className="collaboration-mark" aria-hidden="true">
            +
          </span>
          <div>
            <span className="role-number">02</span>
            <p>
              <strong>Your agent searches the archive.</strong>
              Relay what you see, then watch every tool call in the System Log.
            </p>
          </div>
        </div>
      </section>

      <div className="investigation-workspace">
        <section className="evidence-desk" aria-labelledby="evidence-title">
          <header className="section-heading">
            <div>
              <p className="machine-label">Human-visible evidence</p>
              <h2 id="evidence-title">Three items from the scene</h2>
            </div>
            <p>
              Your agent cannot inspect these. Describe exact names, dates, and
              numbers when it asks.
            </p>
          </header>
          <div className="evidence-layout">
            <EvidencePhoto />
            <EvidencePawnTicket />
            <EvidenceLedgerPage />
          </div>
          <div className="chain-note">
            <LockKeyhole size={18} strokeWidth={1.5} aria-hidden="true" />
            <p>
              <strong>The solution is not in this page's client bundle.</strong>
              Archive records and accusation validation run in TanStack server
              functions.
            </p>
          </div>
        </section>

        <aside className="agent-console" aria-label="Agent console">
          <ConnectionStatus status={status} error={error} />
          <AgentPromptCopy />
          <div className="tool-manifest" aria-labelledby="manifest-title">
            <div>
              <p className="machine-label">Tool manifest</p>
              <h2 id="manifest-title">Five archive operations</h2>
            </div>
            <ol>
              <li>
                <CircleDot size={12} aria-hidden="true" />
                <code>search_club_records</code>
                <span>read</span>
              </li>
              <li>
                <CircleDot size={12} aria-hidden="true" />
                <code>lookup_pawn_ticket</code>
                <span>read</span>
              </li>
              <li>
                <CircleDot size={12} aria-hidden="true" />
                <code>decode_exchange_number</code>
                <span>read</span>
              </li>
              <li>
                <CircleDot size={12} aria-hidden="true" />
                <code>query_suspect_alibi</code>
                <span>read</span>
              </li>
              <li className="tool-terminal">
                <CircleDot size={12} aria-hidden="true" />
                <code>accuse_suspect</code>
                <span>confirm</span>
              </li>
            </ol>
          </div>
          <SystemLog />
        </aside>
      </div>

      <AccusationConfirmationDialog />
    </main>
  )
}
