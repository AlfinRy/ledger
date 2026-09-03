import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

export const AGENT_PROMPT = `You are an investigative agent connected to "The Ledger: Vic Marlowe Case."
The page exposes WebMCP tools on document.modelContext (fallback: navigator.modelContext):
- search_club_records({ club_name, date })
- lookup_pawn_ticket({ ticket_number })
- decode_exchange_number({ exchange_code })
- query_suspect_alibi({ suspect_name })
- accuse_suspect({ suspect_name, evidence_keys })

You cannot see the photographs or documents on the page. The human detective can.
Ask the human what details are visible in the evidence, then use the tools in whatever order makes sense to build a case. Submit your final accusation with the evidence_keys that support it.`

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.append(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

export function AgentPromptCopy() {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (copyState === 'idle') return
    const timeout = window.setTimeout(() => setCopyState('idle'), 2400)
    return () => window.clearTimeout(timeout)
  }, [copyState])

  return (
    <section className="agent-prompt" aria-labelledby="agent-prompt-title">
      <div>
        <p className="machine-label">Agent handoff</p>
        <h2 id="agent-prompt-title">Bring your agent into the room.</h2>
        <p>
          Copy this prompt into your WebMCP-enabled agent. It will ask you for
          details only you can see.
        </p>
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={async () => {
          try {
            await copyText(AGENT_PROMPT)
            setCopyState('copied')
          } catch {
            setCopyState('error')
          }
        }}
      >
        {copyState === 'copied' ? (
          <Check aria-hidden="true" size={17} />
        ) : (
          <Copy aria-hidden="true" size={17} />
        )}
        {copyState === 'copied'
          ? 'Prompt copied'
          : copyState === 'error'
            ? 'Copy failed, try again'
            : 'Copy agent prompt'}
      </button>
      <p className="copy-status" role="status" aria-live="polite">
        {copyState === 'copied'
          ? 'Agent prompt copied to the clipboard.'
          : copyState === 'error'
            ? 'The browser blocked clipboard access.'
            : ''}
      </p>
    </section>
  )
}
