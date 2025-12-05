import { db } from '..';
import { feed_follows, feeds, users } from '../schema';
import { firstOrUndefined } from './utils';
import { eq, and, sql } from 'drizzle-orm';

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
			feedName: sql<string>`${feeds.name}`.as('feed_name'),
			userName: sql<string>`${users.name}`.as('user_name'),
		})
		.from(feed_follows)
		.innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
		.innerJoin(users, eq(feed_follows.userId, users.id))
		.where(eq(feed_follows.id, insertedFollow.id));

	return firstOrUndefined(followWithNames);
}

export async function getFeedFollowsForUser(userId: string) {
	const follows = await db
		.select({
			id: feed_follows.id,
			createdAt: feed_follows.createdAt,
			updatedAt: feed_follows.updatedAt,
			feedId: feed_follows.feedId,
			userId: feed_follows.userId,
			feedName: sql<string>`${feeds.name}`.as('feed_name'),
			userName: sql<string>`${users.name}`.as('user_name'),
		})
		.from(feed_follows)
		.innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
		.innerJoin(users, eq(feed_follows.userId, users.id))
		.where(eq(feed_follows.userId, userId));

	return follows;
}

export async function deleteFeedFollows(user_id: string, feed_id: string) {
	await db
		.delete(feed_follows)
		.where(
			and(
				eq(feed_follows.userId, user_id),
				eq(feed_follows.feedId, feed_id),
			),
		);
}
