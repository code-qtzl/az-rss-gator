import { db } from '..';
import { feeds, users } from '../schema';
import { firstOrUndefined } from './utils';
import { eq } from 'drizzle-orm';

export async function createFeed(name: string, url: string, userId: string) {
	const result = await db
		.insert(feeds)
		.values({
			name,
			url,
			userId,
		})
		.returning();

	return firstOrUndefined(result);
}

export async function getAllFeeds() {
	const allFeeds = await db
		.select({
			id: feeds.id,
			createdAt: feeds.createdAt,
			updatedAt: feeds.updatedAt,
			name: feeds.name,
			url: feeds.url,
			userId: feeds.userId,
			createdBy: users.name,
		})
		.from(feeds)
		.innerJoin(users, eq(feeds.userId, users.id));
	return allFeeds;
}
