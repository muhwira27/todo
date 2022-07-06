import { Pool } from "pg";
import { Generated, Kysely, PostgresDialect } from "kysely";

interface todoTable {
    id: Generated<number>
    description: string
    done: boolean
}

interface Database {
    todos: todoTable
}

export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
          user: 'postgres',
          host: 'localhost',
          database: 'todo',
          port: 3306,
      })
    }),
  })