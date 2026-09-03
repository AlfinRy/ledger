import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import {
  accuseSuspect,
  decodeExchangeNumber,
  lookupPawnTicket,
  querySuspectAlibi,
  searchClubRecords,
} from './case-data.server'

const nonEmptyString = z.string().trim().min(1).max(120)

const searchClubRecordsInput = z.object({
  club_name: nonEmptyString,
  date: nonEmptyString,
})

const pawnTicketInput = z.object({ ticket_number: nonEmptyString })
const exchangeNumberInput = z.object({ exchange_code: nonEmptyString })
const suspectAlibiInput = z.object({ suspect_name: nonEmptyString })
const accusationInput = z.object({
  suspect_name: nonEmptyString,
  evidence_keys: z.array(nonEmptyString).min(1).max(12),
})

export const searchClubRecordsFn = createServerFn({ method: 'GET' })
  .validator(searchClubRecordsInput)
  .handler(async ({ data }) =>
    searchClubRecords({ clubName: data.club_name, date: data.date }),
  )

export const lookupPawnTicketFn = createServerFn({ method: 'GET' })
  .validator(pawnTicketInput)
  .handler(async ({ data }) => lookupPawnTicket(data.ticket_number))

export const decodeExchangeNumberFn = createServerFn({ method: 'GET' })
  .validator(exchangeNumberInput)
  .handler(async ({ data }) => decodeExchangeNumber(data.exchange_code))

export const querySuspectAlibiFn = createServerFn({ method: 'GET' })
  .validator(suspectAlibiInput)
  .handler(async ({ data }) => querySuspectAlibi(data.suspect_name))

export const accuseSuspectFn = createServerFn({ method: 'POST' })
  .validator(accusationInput)
  .handler(async ({ data }) =>
    accuseSuspect({
      suspectName: data.suspect_name,
      evidenceKeys: data.evidence_keys,
    }),
  )
