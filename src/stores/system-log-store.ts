export type ToolLogStatus = 'running' | 'success' | 'error' | 'cancelled'

export type ToolLogEntry = {
  id: string
  toolName: string
  args: Record<string, unknown>
  status: ToolLogStatus
  archiveStatus: 'found' | 'not_found' | 'closed' | 'rebutted' | null
  summary: string | null
  evidenceKeys: string[]
  startedAt: string
  completedAt: string | null
}

type ToolResult = {
  status: 'found' | 'not_found' | 'closed' | 'rebutted'
  summary: string
  evidenceKeys: string[]
}

type Listener = () => void

const EMPTY_LOG: ToolLogEntry[] = []
let entries: ToolLogEntry[] = EMPTY_LOG
let sequence = 0
const listeners = new Set<Listener>()

function emit() {
  for (const listener of listeners) listener()
}

function updateEntry(id: string, patch: Partial<ToolLogEntry>) {
  entries = entries.map((entry) =>
    entry.id === id ? { ...entry, ...patch } : entry,
  )
  emit()
}

export const systemLogStore = {
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  getSnapshot() {
    return entries
  },

  getServerSnapshot() {
    return EMPTY_LOG
  },

  begin(toolName: string, args: Record<string, unknown>) {
    sequence += 1
    const id = `${Date.now()}-${sequence}`
    entries = [
      ...entries,
      {
        id,
        toolName,
        args,
        status: 'running',
        archiveStatus: null,
        summary: null,
        evidenceKeys: [],
        startedAt: new Date().toISOString(),
        completedAt: null,
      },
    ]
    emit()
    return id
  },

  succeed(id: string, result: ToolResult) {
    updateEntry(id, {
      status: 'success',
      archiveStatus: result.status,
      summary: result.summary,
      evidenceKeys: result.evidenceKeys,
      completedAt: new Date().toISOString(),
    })
  },

  fail(id: string, error: unknown) {
    const cancelled = error instanceof DOMException && error.name === 'AbortError'
    updateEntry(id, {
      status: cancelled ? 'cancelled' : 'error',
      summary: cancelled
        ? 'Tool execution cancelled.'
        : error instanceof Error
          ? error.message
          : 'The archive returned an unknown error.',
      completedAt: new Date().toISOString(),
    })
  },

  reset() {
    entries = EMPTY_LOG
    emit()
  },
}
