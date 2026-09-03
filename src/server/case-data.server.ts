import '@tanstack/react-start/server-only'

export type ToolStatus = 'found' | 'not_found' | 'closed' | 'rebutted'

export type CaseToolResult = {
  status: ToolStatus
  summary: string
  findings: Array<{ label: string; value: string }>
  evidenceKeys: string[]
}

type Evidence = {
  key: string
  unlockedBy: string
  content: string
}

type Suspect = {
  name: string
  alibi: string
  contradiction: string | null
}

type CaseFile = {
  id: 'ledger-1947'
  solution: { suspect: string; requiredEvidenceKeys: string[] }
  clubRecords: Record<string, CaseToolResult>
  pawnTickets: Record<string, CaseToolResult>
  exchangeCodes: Record<string, CaseToolResult>
  suspects: Record<string, Suspect>
  evidence: Record<string, Evidence>
}

const caseFile: CaseFile = {
  id: 'ledger-1947',
  solution: {
    suspect: 'Arlene Voss',
    requiredEvidenceKeys: ['tab_open_past_alibi', 'pawn_ticket_link'],
  },
  clubRecords: {
    'the sable room|oct 3': {
      status: 'found',
      summary:
        'Reservation ledger located for The Sable Room on October 3, 1947.',
      findings: [
        { label: 'Party', value: 'Two guests, booked under “…arlene V___”' },
        { label: 'Account', value: 'Tab charged to account #P-771' },
        { label: 'Closed', value: '11:40 PM' },
      ],
      evidenceKeys: ['club_account_p771', 'tab_closed_1140'],
    },
  },
  pawnTickets: {
    'pt-771': {
      status: 'found',
      summary: 'Kessler & Sons transaction PT-771 located.',
      findings: [
        { label: 'Item', value: 'Gold cigarette case' },
        { label: 'Customer', value: 'A. Voss' },
        {
          label: 'Archive cross-reference',
          value: 'A. Voss is Arlene Voss; ticket PT-771 maps to account #P-771',
        },
      ],
      evidenceKeys: ['pawn_ticket_link'],
    },
  },
  exchangeCodes: {
    'tr-4 0119': {
      status: 'found',
      summary: 'TRafalgar exchange code decoded through the rotary dial index.',
      findings: [
        { label: 'Conversion', value: 'TR → 87; listed number 870119' },
        { label: 'Subscriber', value: 'Dockside Freight Co.' },
        { label: 'Manager', value: 'Silas Cole' },
        {
          label: 'Case note',
          value: "Vic Marlowe's business partner; disputed $4,000 loan",
        },
      ],
      evidenceKeys: ['disputed_loan'],
    },
  },
  suspects: {
    'arlene voss': {
      name: 'Arlene Voss',
      alibi: 'Claims she left The Sable Room before 9:00 PM.',
      contradiction:
        'The reservation tab tied to her account remained open until 11:40 PM.',
    },
    'silas cole': {
      name: 'Silas Cole',
      alibi: 'Claims he was never at the Blue Orchid that night.',
      contradiction: null,
    },
    'jimmy prentice': {
      name: 'Jimmy Prentice',
      alibi: 'Clocked behind the Blue Orchid bar throughout the relevant window.',
      contradiction: null,
    },
  },
  evidence: {
    tab_open_past_alibi: {
      key: 'tab_open_past_alibi',
      unlockedBy: 'query_suspect_alibi',
      content: "Arlene Voss's tab remained open two hours and forty minutes after she claimed to have left.",
    },
    pawn_ticket_link: {
      key: 'pawn_ticket_link',
      unlockedBy: 'lookup_pawn_ticket',
      content: 'Pawn ticket PT-771 links A. Voss to club account #P-771.',
    },
    disputed_loan: {
      key: 'disputed_loan',
      unlockedBy: 'decode_exchange_number',
      content: 'Silas Cole disputed a $4,000 loan with Vic Marlowe.',
    },
  },
}

function compact(value: string) {
  return value.trim().toLocaleLowerCase('en-US').replace(/\s+/g, ' ')
}

function emptyResult(summary: string): CaseToolResult {
  return { status: 'not_found', summary, findings: [], evidenceKeys: [] }
}

export function searchClubRecords(input: {
  clubName: string
  date: string
}): CaseToolResult {
  const club = compact(input.clubName)
  const date = compact(input.date)
  const normalizedDate =
    date === 'october 3' || date === '1947-10-03' ? 'oct 3' : date

  return (
    caseFile.clubRecords[`${club}|${normalizedDate}`] ??
    emptyResult(
      'No matching reservation ledger was found. Check the club name and handwritten date on the photograph.',
    )
  )
}

export function lookupPawnTicket(ticketNumber: string): CaseToolResult {
  return (
    caseFile.pawnTickets[compact(ticketNumber)] ??
    emptyResult(
      'No pawn transaction matches that ticket number. Read the full stub, including its prefix.',
    )
  )
}

export function decodeExchangeNumber(exchangeCode: string): CaseToolResult {
  const normalized = compact(exchangeCode)
    .replace(/^tr4/, 'tr-4')
    .replace(/^tr 4/, 'tr-4')

  return (
    caseFile.exchangeCodes[normalized] ??
    emptyResult(
      'The exchange code could not be resolved. Preserve its letters, digit, and subscriber number.',
    )
  )
}

export function querySuspectAlibi(suspectName: string): CaseToolResult {
  const suspect = caseFile.suspects[compact(suspectName)]

  if (!suspect) {
    return emptyResult(
      'No statement is filed under that name. Query a full suspect name established by the archive.',
    )
  }

  if (suspect.name === 'Arlene Voss') {
    return {
      status: 'found',
      summary: "Arlene Voss's statement conflicts with the club ledger.",
      findings: [
        { label: 'Statement', value: suspect.alibi },
        { label: 'Contradiction', value: suspect.contradiction ?? '' },
      ],
      evidenceKeys: ['tab_open_past_alibi'],
    }
  }

  if (suspect.name === 'Silas Cole') {
    return {
      status: 'found',
      summary: 'Silas Cole has a financial motive, but the archive exposes no timeline contradiction.',
      findings: [
        { label: 'Statement', value: suspect.alibi },
        { label: 'Assessment', value: 'Motive established; alibi not disproved' },
      ],
      evidenceKeys: ['disputed_loan'],
    }
  }

  return {
    status: 'found',
    summary: 'Jimmy Prentice has a corroborated alibi and no link to the recovered evidence.',
    findings: [
      { label: 'Statement', value: suspect.alibi },
      { label: 'Assessment', value: 'No contradiction or evidence connection' },
    ],
    evidenceKeys: [],
  }
}

export function accuseSuspect(input: {
  suspectName: string
  evidenceKeys: string[]
}): CaseToolResult {
  const suspectMatches =
    compact(input.suspectName) === compact(caseFile.solution.suspect)
  const suppliedKeys = new Set(input.evidenceKeys.map(compact))
  const hasRequiredEvidence = caseFile.solution.requiredEvidenceKeys.every(
    (key) => suppliedKeys.has(key),
  )

  if (suspectMatches && hasRequiredEvidence) {
    return {
      status: 'closed',
      summary:
        'Case closed. Arlene Voss killed Vic Marlowe, and the archive accepts the evidence chain.',
      findings: caseFile.solution.requiredEvidenceKeys.map((key) => ({
        label: key,
        value: caseFile.evidence[key]?.content ?? '',
      })),
      evidenceKeys: [...caseFile.solution.requiredEvidenceKeys],
    }
  }

  if (suspectMatches) {
    return {
      status: 'rebutted',
      summary:
        'The name fits, but the file does not. Establish both the late-open tab and the pawn-ticket identity link before accusing her.',
      findings: [],
      evidenceKeys: [],
    }
  }

  if (compact(input.suspectName) === 'silas cole') {
    return {
      status: 'rebutted',
      summary:
        "Cole has a motive, but his alibi has no proven hole. Motive is not a contradiction, detective.",
      findings: [],
      evidenceKeys: [],
    }
  }

  return {
    status: 'rebutted',
    summary:
      'That accusation does not connect a suspect to both the club timeline and the physical evidence.',
    findings: [],
    evidenceKeys: [],
  }
}
