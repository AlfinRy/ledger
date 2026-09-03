import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const assetsDirectory = join(process.cwd(), '.output', 'public', 'assets')
const forbiddenCaseData = [
  'Arlene Voss',
  'tab_open_past_alibi',
  'pawn_ticket_link',
  'disputed $4,000 loan',
  'Case closed. Arlene',
]

const files = (await readdir(assetsDirectory)).filter((file) =>
  file.endsWith('.js'),
)
const leaks = []

for (const file of files) {
  const source = await readFile(join(assetsDirectory, file), 'utf8')
  for (const value of forbiddenCaseData) {
    if (source.includes(value)) leaks.push({ file, value })
  }
}

if (leaks.length > 0) {
  console.error('Server-only case data was found in the client bundle:')
  for (const leak of leaks) console.error(`- ${leak.value} in ${leak.file}`)
  process.exit(1)
}

console.log(`Client bundle verified: ${files.length} JavaScript assets are clean.`)
