import {
  Ban,
  Check,
  CircleDot,
  RotateCcw,
  TriangleAlert,
} from 'lucide-react'
import { useEffect, useRef, useSyncExternalStore } from 'react'

import {
  systemLogStore,
  type ToolLogEntry,
} from '../stores/system-log-store'

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

function formatArgs(args: Record<string, unknown>) {
  return JSON.stringify(args, null, 2)
}

function StatusIcon({ entry }: { entry: ToolLogEntry }) {
  if (entry.status === 'running') {
    return <CircleDot className="status-running" size={15} aria-hidden="true" />
  }
  if (entry.status === 'error') {
    return <TriangleAlert className="status-error" size={15} aria-hidden="true" />
  }
  if (entry.status === 'cancelled') {
    return <Ban className="status-muted" size={15} aria-hidden="true" />
  }
  return <Check className="status-success" size={15} aria-hidden="true" />
}

export function SystemLog() {
  const entries = useSyncExternalStore(
    systemLogStore.subscribe,
    systemLogStore.getSnapshot,
    systemLogStore.getServerSnapshot,
  )
  const endRef = useRef<HTMLDivElement>(null)
  const caseClosed = entries.some((entry) => entry.archiveStatus === 'closed')

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [entries])

  return (
    <section className="system-log" aria-labelledby="system-log-title">
      <header className="system-log-header">
        <div>
          <p className="machine-label">Shared activity</p>
          <h2 id="system-log-title">System Log</h2>
        </div>
        {entries.length > 0 ? (
          <button
            className="icon-button"
            type="button"
            onClick={() => systemLogStore.reset()}
            aria-label="Clear System Log"
            title="Clear System Log"
          >
            <RotateCcw size={16} aria-hidden="true" />
          </button>
        ) : null}
      </header>

      {caseClosed ? (
        <div className="case-closed" role="status">
          <span aria-hidden="true">Case 47-B</span>
          <strong>Closed with supporting evidence</strong>
        </div>
      ) : null}

      <div
        className="log-stream"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {entries.length === 0 ? (
          <div className="log-empty">
            <span className="cursor" aria-hidden="true" />
            <p>Waiting for an agent to call the archive.</p>
            <small>Tool names, arguments, and findings will appear here.</small>
          </div>
        ) : (
          <ol>
            {entries.map((entry, index) => (
              <li className="log-entry" key={entry.id}>
                <div className="log-entry-heading">
                  <span className="log-sequence">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <StatusIcon entry={entry} />
                  <code>{entry.toolName}</code>
                  <time dateTime={entry.startedAt}>
                    {formatTime(entry.startedAt)}
                  </time>
                </div>
                <pre aria-label={`Arguments for ${entry.toolName}`}>
                  {formatArgs(entry.args)}
                </pre>
                {entry.summary ? (
                  <div
                    className={`log-result log-result-${entry.archiveStatus ?? entry.status}`}
                  >
                    <span>Result</span>
                    <p>{entry.summary}</p>
                    {entry.evidenceKeys.length > 0 ? (
                      <div className="evidence-keys">
                        {entry.evidenceKeys.map((key) => (
                          <code key={key}>{key}</code>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="log-pending">Archive request in progress…</p>
                )}
              </li>
            ))}
          </ol>
        )}
        <div ref={endRef} />
      </div>
    </section>
  )
}
