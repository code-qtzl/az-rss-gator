import { db } from '..';
import { feed_follows, feeds, users } from '../schema';
import { firstOrUndefined } from './utils';
import { eq, and } from 'drizzle-orm';

export async function feedFollow(feedId: string, userId: string) {
	const result = await db
		.insert(feed_follows)
		.values({
			feedId,
			userId,
		})
		.returning();

	return firstOrUndefined(result);
}

export async function createFeedFollow(feedId: string, userId: string) {
	const result = await db
		.insert(feed_follows)
		.values({
			feedId,
			userId,
		})
		.returning();

	const insertedFollow = firstOrUndefined(result);
	if (!insertedFollow) {
		return undefined;
	}

	const followWithNames = await db
		.select({
			id: feed_follows.id,
			createdAt: feed_follows.createdAt,
			updatedAt: feed_follows.updatedAt,
			feedId: feed_follows.feedId,
			userId: feed_follows.userId,
			feedName: feeds.name,
			userName: users.name,
		})
		.from(feed_follows)
		.innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
		.innerJoin(users, eq(feed_follows.userId, users.id))
		.where(eq(feed_follows.id, insertedFollow.id));

	return firstOrUndefined(followWithNames);
}
