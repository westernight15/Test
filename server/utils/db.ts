import Database from 'better-sqlite3'
import { resolve } from 'path'

const dbPath = resolve(process.cwd(), 'bible.db')

let db: Database.Database | null = null

export function useDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath, { readonly: true })
    db.pragma('journal_mode = WAL')
  }
  return db
}
