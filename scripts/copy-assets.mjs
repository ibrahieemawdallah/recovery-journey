// Copies static assets into the standalone output after `next build`.
// Replaces the unix-only `cp -r` step so the build works on Windows too.
import { cp, mkdir, copyFile, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const root = process.cwd()
const standalone = join(root, '.next', 'standalone')

if (!existsSync(standalone)) {
  console.error('No standalone output found — is `output: "standalone"` set in next.config.ts?')
  process.exit(1)
}

async function copy(src, dest) {
  if (!existsSync(src)) {
    console.warn(`skip (missing): ${src}`)
    return
  }
  await mkdir(dirname(dest), { recursive: true })
  await cp(src, dest, { recursive: true })
  console.log(`copied ${src} -> ${dest}`)
}

await copy(join(root, '.next', 'static'), join(standalone, '.next', 'static'))
await copy(join(root, 'public'), join(standalone, 'public'))

// SQLite database — the standalone server resolves `file:./dev.db` relative to
// its own directory, so the DB must sit next to server.js.
if (existsSync(join(root, 'prisma', 'dev.db'))) {
  await mkdir(standalone, { recursive: true })
  await copyFile(join(root, 'prisma', 'dev.db'), join(standalone, 'dev.db'))
  console.log('copied prisma/dev.db -> .next/standalone/dev.db')
}

// Runtime env (DATABASE_URL, GEMINI_API_KEY, NEXTAUTH_*)
// Prisma resolves a relative `file:./dev.db` against the generated client's
// schema directory (node_modules/.prisma/client), which would create an empty
// DB there. An absolute path keeps it pointed at the real database.
if (existsSync(join(root, '.env'))) {
  const raw = await readFile(join(root, '.env'), 'utf8')
  const dbPath = join(standalone, 'dev.db').replace(/\\/g, '/')
  const patched = raw.replace(
    /^DATABASE_URL=.*$/m,
    `DATABASE_URL="file:${dbPath}"`
  )
  await writeFile(join(standalone, '.env'), patched)
  console.log(`wrote .next/standalone/.env (DATABASE_URL -> ${dbPath})`)
}

console.log('Standalone build ready: .next/standalone/server.js')
