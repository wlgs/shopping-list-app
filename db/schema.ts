import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import pg from "pg";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === "true",
});
const db = drizzle(pool);

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    username: text("username").notNull().unique(),
    password_hash: text("password_hash").notNull(),
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const tasksTable = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    title: text("title").notNull(),
    amount: integer("amount").notNull(),
    amountType: text("amount_type").notNull(),
    imgUrl: text("img_url"),
    dueDate: timestamp("due_date", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
    completedAt: timestamp("completed_at", {
        withTimezone: true,
        mode: "date",
    }),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .defaultNow()
        .notNull(),
});

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);
