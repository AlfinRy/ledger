export type PendingAccusation = {
  suspectName: string
  evidenceKeys: string[]
}

type Listener = () => void
type PendingRequest = {
  accusation: PendingAccusation
  resolve: (approved: boolean) => void
  cleanup: () => void
}

const listeners = new Set<Listener>()
let pendingRequest: PendingRequest | null = null

function emit() {
  for (const listener of listeners) listener()
}

function settle(approved: boolean) {
  const request = pendingRequest
  if (!request) return
  pendingRequest = null
  request.cleanup()
  request.resolve(approved)
  emit()
}

export const accusationConfirmationStore = {
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  getSnapshot() {
    return pendingRequest?.accusation ?? null
  },

  getServerSnapshot() {
    return null
  },

  request(accusation: PendingAccusation, signal: AbortSignal) {
    if (signal.aborted) {
      return Promise.reject(new DOMException('Accusation cancelled.', 'AbortError'))
    }

    if (pendingRequest) {
      return Promise.reject(
        new Error('Another accusation is already awaiting confirmation.'),
      )
    }

    return new Promise<boolean>((resolve, reject) => {
      const handleAbort = () => {
        pendingRequest = null
        signal.removeEventListener('abort', handleAbort)
        emit()
        reject(new DOMException('Accusation cancelled.', 'AbortError'))
      }

      signal.addEventListener('abort', handleAbort, { once: true })
      pendingRequest = {
        accusation,
        resolve,
        cleanup: () => signal.removeEventListener('abort', handleAbort),
      }
      emit()
    })
  },

  approve() {
    settle(true)
  },

  decline() {
    settle(false)
  },
}
