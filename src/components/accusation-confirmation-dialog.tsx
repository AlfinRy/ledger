import { ShieldAlert } from 'lucide-react'
import { useEffect, useRef, useSyncExternalStore } from 'react'

import { accusationConfirmationStore } from '../stores/accusation-confirmation-store'

export function AccusationConfirmationDialog() {
  const accusation = useSyncExternalStore(
    accusationConfirmationStore.subscribe,
    accusationConfirmationStore.getSnapshot,
    accusationConfirmationStore.getServerSnapshot,
  )
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (accusation && !dialog.open) dialog.showModal()
    if (!accusation && dialog.open) dialog.close()
  }, [accusation])

  return (
    <dialog
      className="accusation-dialog"
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault()
        accusationConfirmationStore.decline()
      }}
      onClose={() => {
        if (accusation) accusationConfirmationStore.decline()
      }}
    >
      {accusation ? (
        <div className="accusation-dialog-content">
          <ShieldAlert size={28} strokeWidth={1.5} aria-hidden="true" />
          <p className="machine-label">Human confirmation required</p>
          <h2>Authorize this accusation?</h2>
          <p>
            The agent wants to accuse <strong>{accusation.suspectName}</strong>.
            This is the archive's terminal action.
          </p>
          <div className="accusation-evidence">
            <span>Submitted evidence</span>
            {accusation.evidenceKeys.length > 0 ? (
              <ul>
                {accusation.evidenceKeys.map((key) => (
                  <li key={key}>
                    <code>{key}</code>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No evidence keys submitted.</p>
            )}
          </div>
          <div className="dialog-actions">
            <button
              className="button button-ghost"
              type="button"
              onClick={() => accusationConfirmationStore.decline()}
            >
              Keep investigating
            </button>
            <button
              className="button button-danger"
              type="button"
              onClick={() => accusationConfirmationStore.approve()}
            >
              Authorize accusation
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
