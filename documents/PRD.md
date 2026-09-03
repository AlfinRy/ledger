# PRD: "The Ledger" — A WebMCP Noir Mystery
**For:** OpenAI WebMCP Challenge 2026 (deadline 3 Sept 13:00 PT)
**Author:** Alfin Reynaldi
**Stack:** TanStack Start (React) + TanStack DB/Server Functions, deployed on Vercel
**Pattern reference:** Netlify's "The Archive" demo (architecture pattern only — story, evidence, tools, and cipher below are original, not copied)

---

## 1. Concept

A human detective and an AI agent solve a 1947-set noir murder case **together, in the same browser tab**, but they see different halves of the evidence:

- **The human** sees physical evidence rendered visually on the page: a photograph, a torn ledger page, a pawn ticket, a matchbook.
- **The agent** can only reach the case archive through five WebMCP tools registered on `document.modelContext` (fallback `navigator.modelContext`). It cannot see the images — it has to be *told* what's in them by the human, and query on that basis.

Neither party can close the case alone. The human can't search a locked police archive; the agent can't read a torn photograph. This asymmetry **is** the demo — it's the clearest possible illustration of why WebMCP matters (agent gets structured tool access, not screen-scraping, and still needs the human in the loop).

## 2. The Case — "Who Killed Vic Marlowe?"

**Setting:** Fictional city, 1947. Nightclub owner **Vic Marlowe** is found dead in his office at the **Blue Orchid** club. Three possible suspects, one killer.

**Visual evidence (shown to the human only, rendered on page):**
1. A torn photograph — Vic with a woman at a table, matchbook from **"The Sable Room"** visible on the table, dated in pencil on the back: `Oct 3`
2. A **pawn ticket** stub — ticket number `PT-771`, item "gold cigarette case," pawnshop name "Kessler & Sons"
3. A page from Vic's **ledger**, partially burned — visible fragment: a phone exchange written in old telephone-exchange notation: `TR-4 0119` (TRafalgar exchange), and a smudged amount: `$4,000`

**Win condition:** the agent must chain 4 read-only tools to build a case, then call `accuse_suspect` with the correct suspect + supporting evidence keys. Wrong accusations are allowed (returns a rebuttal, doesn't end the game) — only correct evidence closes the case, so guessing without the human's visual input fails.

## 3. WebMCP Tool Chain (5 tools)

All tools call TanStack **server functions** (`createServerFn`) — the solution and validation logic live server-side only. Nothing solvable by reading the client bundle.

### Tool 1 — `search_club_records`
- **Description:** "Search nightclub visitor and reservation logs by club name and date. Requires details only visible in physical evidence."
- **inputSchema:** `{ club_name: string, date: string }` both required
- **Human must supply from evidence:** club name "The Sable Room", date "Oct 3" (from photo)
- **Returns on correct input:** reservation record naming a party of two, one name partially legible: `"...arlene V___"`, and a note: `"tab charged to acct #P-771"`
- **annotations:** `{ readOnlyHint: true }`

### Tool 2 — `lookup_pawn_ticket`
- **Description:** "Look up a pawnshop transaction by ticket number."
- **inputSchema:** `{ ticket_number: string }` required
- **Human supplies:** `PT-771` (from the pawn ticket evidence)
- **Returns:** pawnshop transaction — item pawned by **"A. Voss"**, connects account `#P-771` from Tool 1 to a full name: **Arlene Voss**
- **annotations:** `{ readOnlyHint: true }`

### Tool 3 — `decode_exchange_number`
- **Description:** "Decode an old telephone exchange notation (e.g. TR-4 0119) into a modern phone number and registered subscriber."
- **inputSchema:** `{ exchange_code: string }` required
- **Human supplies:** `TR-4 0119` (from burned ledger page)
- **Mechanic (original, not Caesar cipher):** exchange prefixes map to digits per the real vintage phone-exchange-name convention (TRafalgar → 87, since T=8,R=7 on a rotary dial) → number resolves to `870119`, registered to **"Dockside Freight Co."**, care-of manager **Silas Cole**
- **Returns:** subscriber name + a flag: `"Silas Cole — Vic Marlowe's business partner, disputed $4,000 loan"`
- **annotations:** `{ readOnlyHint: true }`

### Tool 4 — `query_suspect_alibi`
- **Description:** "Query a named suspect's alibi statement and timeline for the night of the murder."
- **inputSchema:** `{ suspect_name: string }` required — accepts `"Arlene Voss"`, `"Silas Cole"`, or a red herring `"Jimmy Prentice"` (the club's bartender, mentioned nowhere in evidence — included so agent can't brute-force all names without human's steer)
- **Returns per suspect:**
  - *Arlene Voss:* claims she left before 9 PM; club reservation (Tool 1) shows tab still open until 11:40 PM — **contradiction**
  - *Silas Cole:* claims he was never at the club that night; but the $4,000 disputed loan (Tool 3) gives motive, and no alibi contradiction — weaker case
  - *Jimmy Prentice:* clean alibi, no connection to any other clue — dead end
- **annotations:** `{ readOnlyHint: true }`

### Tool 5 — `accuse_suspect`
- **Description:** "Submit a final accusation with the suspect's name and the evidence keys that support it. Closes the case if correct."
- **inputSchema:** `{ suspect_name: string, evidence_keys: string[] }` — evidence_keys must reference specific findings returned by prior tools (e.g. `"tab_open_past_alibi"`, `"pawn_ticket_link"`)
- **Correct solution:** `Arlene Voss`, supported by the tab-timing contradiction + pawn ticket linking her account to the club
- **Wrong accusation:** returns an in-character rebuttal (e.g. "Cole's alibi has no holes — you need a contradiction, detective"), does **not** end the session, agent can keep investigating
- **annotations:** `{ readOnlyHint: false }` (it's the one mutating/terminal action — this is also where a `requestUserInteraction`-style human confirmation step belongs if declarative human-in-the-loop is desired, see §6)

## 4. Data Model (server-side only, never sent to client unsolved)

```ts
// lib/case-data.ts (server-only module)
type Evidence = {
  key: string;
  unlockedBy: string; // tool name
  content: string;
};

type Suspect = {
  name: string;
  alibi: string;
  contradiction: string | null; // null = no contradiction found
};

type CaseFile = {
  id: "ledger-1947";
  solution: { suspect: string; requiredEvidenceKeys: string[] };
  clubRecords: Record<string, { club: string; date: string; result: object }>;
  pawnTickets: Record<string, object>;
  exchangeCodes: Record<string, object>;
  suspects: Record<string, Suspect>;
};
```

Keep this in a server-only file (TanStack Start server functions run on the server bundle; do not import this module from any client component).

## 5. Frontend Structure (TanStack Start)

```
app/
  routes/
    index.tsx            # Case page: evidence images/text + agent system log panel
    how-it-works.tsx      # Optional: explain WebMCP for judges, mirrors reference demo
  components/
    evidence-photo.tsx
    evidence-pawn-ticket.tsx
    evidence-ledger-page.tsx
    system-log.tsx         # live feed of tool calls the agent makes (name + args + result)
    agent-prompt-copy.tsx  # "Copy agent prompt" button like the reference demo
  server/
    case-data.ts           # server-only case file (see §4)
    tools.server.ts         # createServerFn handlers for all 5 tools
  hooks/
    use-webmcp-tools.ts     # registers all 5 tools on mount via document.modelContext
```

### `use-webmcp-tools.ts` — registration pattern
```ts
useEffect(() => {
  const modelContext = document.modelContext ?? navigator.modelContext;
  if (!modelContext?.registerTool) return;

  const controller = new AbortController();

  const tools = [searchClubRecordsTool, lookupPawnTicketTool, decodeExchangeTool, queryAlibiTool, accuseSuspectTool];
  for (const tool of tools) {
    modelContext.registerTool(tool, { signal: controller.signal });
  }

  return () => controller.abort(); // unregisters all 5 on unmount
}, []);
```

Every tool's `execute` calls its matching server function and also pushes an entry to the on-screen **System Log** (via shared state/store) so the human sees every move the agent makes in real time — this is the "shared visibility" requirement judges look for.

## 6. Security / Judging-Criteria Checklist

- [ ] `Origin-Agent-Cluster: ?1` and `Permissions-Policy: tools=(self)` headers set (Vercel: via `vercel.json` headers, or middleware)
- [ ] Solution and full case data never present in client JS bundle — verify via `view-source` / build output before submitting
- [ ] `readOnlyHint: true` on tools 1–4, `readOnlyHint: false` on `accuse_suspect`
- [ ] `accuse_suspect` is the only state-mutating tool and is clearly the "final" action — consider a confirm step in the UI when it's called, so a human watching sees the accusation before it locks in
- [ ] System log panel = visible proof of agent activity (addresses "quality of human-agent experience" criterion)
- [ ] `how-it-works` page explaining the architecture (judges skim fast; make it easy to see execution quality)
- [ ] "Copy agent prompt" button with a ready-made system prompt for testers, same pattern as reference demo

## 7. Day Plan (~18–20 hours remaining)

| Time block | Task |
|---|---|
| Hour 0–1 | `npx create-tsrouter-app` (TanStack Start), deploy empty shell to Vercel immediately (get the URL working end to end first) |
| Hour 1–3 | Build case data model + 5 server functions, unit-test the solve chain manually (no UI yet) |
| Hour 3–5 | Build `use-webmcp-tools.ts`, register tools, verify via Model Context Tool Inspector extension or ChatGPT desktop |
| Hour 5–8 | Build evidence UI (photo, pawn ticket, ledger page) + System Log panel |
| Hour 8–9 | Add security headers, `how-it-works` page, agent prompt copy button |
| Hour 9–10 | Full run-through test: fresh ChatGPT session, paste starter prompt, solve case end-to-end |
| Hour 10–11 | Record demo video (show human reading evidence, agent calling tools, log updating live, correct accusation closing case) |
| Hour 11–12 | Write Devpost submission copy, double-check repo is public, submit |
| Remaining buffer | Bug fixes, polish, do NOT add new scope |

## 8. Starter Agent Prompt (to ship in the UI, like the reference demo)

```
You are an investigative agent connected to "The Ledger — Vic Marlowe Case."
The page exposes WebMCP tools on document.modelContext (fallback: navigator.modelContext):
- search_club_records({ club_name, date })
- lookup_pawn_ticket({ ticket_number })
- decode_exchange_number({ exchange_code })
- query_suspect_alibi({ suspect_name })
- accuse_suspect({ suspect_name, evidence_keys })

You cannot see the photographs or documents on the page — the human detective can.
Ask the human what details are visible in the evidence, then use the tools in
whatever order makes sense to build a case, and submit your final accusation
with the evidence_keys that support it.
```

## 9. Explicit Non-Goals (to protect the timeline)

- No user accounts / multi-session persistence — single shared case state is fine for a demo
- No mobile-specific responsive polish beyond "doesn't break"
- No additional cases/replayability — one case, done well, beats three half-finished ones
- No LLM calls needed anywhere in this project — it's pure deterministic logic, which also means zero API cost/latency risk during the demo