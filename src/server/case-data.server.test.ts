import { describe, expect, it } from 'vitest'

import {
  accuseSuspect,
  decodeExchangeNumber,
  lookupPawnTicket,
  querySuspectAlibi,
  searchClubRecords,
} from './case-data.server'

describe('case archive', () => {
  it('resolves the complete evidence chain and closes the case', () => {
    const clubRecord = searchClubRecords({
      clubName: 'The Sable Room',
      date: 'Oct 3',
    })
    expect(clubRecord.status).toBe('found')
    expect(clubRecord.evidenceKeys).toContain('club_account_p771')

    const pawnTicket = lookupPawnTicket('PT-771')
    expect(pawnTicket.status).toBe('found')
    expect(pawnTicket.evidenceKeys).toContain('pawn_ticket_link')

    const exchange = decodeExchangeNumber('TR-4 0119')
    expect(exchange.status).toBe('found')
    expect(exchange.evidenceKeys).toContain('disputed_loan')

    const alibi = querySuspectAlibi('Arlene Voss')
    expect(alibi.status).toBe('found')
    expect(alibi.evidenceKeys).toContain('tab_open_past_alibi')

    const accusation = accuseSuspect({
      suspectName: 'Arlene Voss',
      evidenceKeys: [
        ...pawnTicket.evidenceKeys,
        ...alibi.evidenceKeys,
        ...clubRecord.evidenceKeys,
      ],
    })
    expect(accusation.status).toBe('closed')
  })

  it('accepts reasonable formatting variants from transcribed evidence', () => {
    expect(
      searchClubRecords({
        clubName: '  THE SABLE ROOM ',
        date: '1947-10-03',
      }).status,
    ).toBe('found')
    expect(decodeExchangeNumber('TR4 0119').status).toBe('found')
    expect(lookupPawnTicket('pt-771').status).toBe('found')
  })

  it('does not reveal records for incomplete or incorrect physical clues', () => {
    expect(
      searchClubRecords({ clubName: 'Blue Orchid', date: 'Oct 3' }).status,
    ).toBe('not_found')
    expect(lookupPawnTicket('771').status).toBe('not_found')
    expect(decodeExchangeNumber('TR-4 0118').status).toBe('not_found')
  })

  it('keeps the red-herring alibi disconnected from evidence', () => {
    const alibi = querySuspectAlibi('Jimmy Prentice')
    expect(alibi.status).toBe('found')
    expect(alibi.evidenceKeys).toEqual([])
  })

  it('rebuts an accusation that lacks the required evidence pair', () => {
    const accusation = accuseSuspect({
      suspectName: 'Arlene Voss',
      evidenceKeys: ['pawn_ticket_link'],
    })
    expect(accusation.status).toBe('rebutted')
  })

  it('rebuts a motive-only accusation against Silas Cole', () => {
    const accusation = accuseSuspect({
      suspectName: 'Silas Cole',
      evidenceKeys: ['disputed_loan'],
    })
    expect(accusation.status).toBe('rebutted')
    expect(accusation.summary).toContain('Motive is not a contradiction')
  })
})
