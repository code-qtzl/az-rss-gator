import { pgTable, timestamp, uuid, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	name: text('name').notNull().unique(),
});

export const feeds = pgTable('feeds', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	name: text('name').notNull(),
	url: text('url').notNull().unique(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	last_fetched_at: timestamp('last_fetched_at'),
});

export const feed_follows = pgTable('feed_follows', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	feedId: uuid('feed_id')
		.references(() => feeds.id, { onDelete: 'cascade' })
		.notNull(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
});

export const posts = pgTable('posts', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	title: text('title').notNull(),
	url: text('url').notNull().unique(),
	description: text('description').notNull(),
	publishedAt: timestamp('published_at'),
	feedId: uuid('feed_id')
		.references(() => feeds.id, { onDelete: 'cascade' })
		.notNull(),
});

export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;
export type FeedFollow = typeof feed_follows.$inferSelect;
export type Post = typeof posts.$inferSelect;
