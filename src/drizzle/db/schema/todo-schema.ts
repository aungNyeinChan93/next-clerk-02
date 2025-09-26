import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./user-schema";
import { relations } from "drizzle-orm";


export const todosTable = pgTable('todos', {
    id: uuid().primaryKey().defaultRandom(),
    task: text().notNull(),
    author_id: uuid().notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    isCompleted: boolean().default(true).notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
});


export const todosRelations = relations(todosTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [todosTable.author_id],
        references: [usersTable.id]
    })
}))