import { useEffect, useState } from 'react'

import {
  accuseSuspectFn,
  decodeExchangeNumberFn,
  lookupPawnTicketFn,
  querySuspectAlibiFn,
  searchClubRecordsFn,
} from '../server/tools'
import { accusationConfirmationStore } from '../stores/accusation-confirmation-store'
import { systemLogStore } from '../stores/system-log-store'

export type WebMcpStatus =
  | 'checking'
  | 'unsupported'
  | 'registering'
  | 'ready'
  | 'error'

type ArchiveResult = {
  status: 'found' | 'not_found' | 'closed' | 'rebutted'
  summary: string
  findings: Array<{ label: string; value: string }>
  evidenceKeys: string[]
}

function textResult(result: ArchiveResult) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result),
      },
    ],
  }
}

async function runLoggedTool(
  toolName: string,
  args: Record<string, unknown>,
  task: () => Promise<ArchiveResult>,
) {
  const logId = systemLogStore.begin(toolName, args)

  try {
    const result = await task()
    systemLogStore.succeed(logId, result)
    return textResult(result)
  } catch (error) {
    systemLogStore.fail(logId, error)
    const message =
      error instanceof Error
        ? error.message
        : 'The archive could not complete this request.'

    return {
      content: [{ type: 'text', text: message }],
      isError: true,
    }
  }
}

const stringSchema = (description: string): WebMcpJsonSchema => ({
  type: 'string',
  description,
})

function buildTools(): WebMcpTool[] {
  return [
    {
      name: 'search_club_records',
      title: 'Search club records',
      description:
        'Search nightclub visitor and reservation logs by club name and date. Requires details only visible in physical evidence.',
      inputSchema: {
        type: 'object',
        properties: {
          club_name: stringSchema('The nightclub name visible in evidence.'),
          date: stringSchema('The handwritten reservation date.'),
        },
        required: ['club_name', 'date'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: async (input, { signal }) =>
        runLoggedTool('search_club_records', input, () =>
          searchClubRecordsFn({
            data: {
              club_name: String(input.club_name),
              date: String(input.date),
            },
            signal,
          }),
        ),
    },
    {
      name: 'lookup_pawn_ticket',
      title: 'Look up pawn ticket',
      description: 'Look up a pawnshop transaction by its complete ticket number.',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_number: stringSchema(
            'The complete pawn ticket number, including its prefix.',
          ),
        },
        required: ['ticket_number'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: async (input, { signal }) =>
        runLoggedTool('lookup_pawn_ticket', input, () =>
          lookupPawnTicketFn({
            data: { ticket_number: String(input.ticket_number) },
            signal,
          }),
        ),
    },
    {
      name: 'decode_exchange_number',
      title: 'Decode exchange number',
      description:
        'Decode an old telephone exchange notation into a modern number and registered subscriber.',
      inputSchema: {
        type: 'object',
        properties: {
          exchange_code: stringSchema(
            'The full vintage exchange notation exactly as transcribed.',
          ),
        },
        required: ['exchange_code'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: async (input, { signal }) =>
        runLoggedTool('decode_exchange_number', input, () =>
          decodeExchangeNumberFn({
            data: { exchange_code: String(input.exchange_code) },
            signal,
          }),
        ),
    },
    {
      name: 'query_suspect_alibi',
      title: 'Query suspect alibi',
      description:
        "Query a named suspect's alibi statement and timeline for the night of Vic Marlowe's murder.",
      inputSchema: {
        type: 'object',
        properties: {
          suspect_name: stringSchema(
            'A full suspect name established during the investigation.',
          ),
        },
        required: ['suspect_name'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: async (input, { signal }) =>
        runLoggedTool('query_suspect_alibi', input, () =>
          querySuspectAlibiFn({
            data: { suspect_name: String(input.suspect_name) },
            signal,
          }),
        ),
    },
    {
      name: 'accuse_suspect',
      title: 'Accuse suspect',
      description:
        "Submit a final accusation with the suspect's full name and evidence keys returned by prior archive tools. The human must confirm this terminal action.",
      inputSchema: {
        type: 'object',
        properties: {
          suspect_name: stringSchema('The full name of the accused suspect.'),
          evidence_keys: {
            type: 'array',
            description:
              'Specific evidence keys returned by prior tool findings.',
            items: stringSchema('A previously returned evidence key.'),
            minItems: 1,
            maxItems: 12,
          },
        },
        required: ['suspect_name', 'evidence_keys'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: async (input, { signal }) =>
        runLoggedTool('accuse_suspect', input, async () => {
          const suspectName = String(input.suspect_name)
          const evidenceKeys = Array.isArray(input.evidence_keys)
            ? input.evidence_keys.map(String)
            : []
          const approved = await accusationConfirmationStore.request(
            { suspectName, evidenceKeys },
            signal,
          )

          if (!approved) {
            throw new DOMException(
              'The human detective declined the accusation.',
              'AbortError',
            )
          }

          return accuseSuspectFn({
            data: {
              suspect_name: suspectName,
              evidence_keys: evidenceKeys,
            },
            signal,
          })
        }),
    },
  ]
}

export function useWebMcpTools() {
  const [status, setStatus] = useState<WebMcpStatus>('checking')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const modelContext = document.modelContext ?? navigator.modelContext
    if (!modelContext?.registerTool) {
      setStatus('unsupported')
      return
    }

    const controller = new AbortController()
    let active = true
    setStatus('registering')

    Promise.all(
      buildTools().map((tool) =>
        modelContext.registerTool(tool, { signal: controller.signal }),
      ),
    )
      .then(() => {
        if (active) setStatus('ready')
      })
      .catch((registrationError: unknown) => {
        if (!active || controller.signal.aborted) return
        setStatus('error')
        setError(
          registrationError instanceof Error
            ? registrationError.message
            : 'The browser refused WebMCP tool registration.',
        )
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [])

  return { status, error }
}
