import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { todosTable } from "./todo-schema";

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    clerk_id: text(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    isSubscribed: boolean().default(false).notNull(),
    subscriptionEnd: timestamp(),
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
    todos: many(todosTable)
}))
