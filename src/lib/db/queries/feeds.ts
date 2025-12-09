import { db } from '..';
import { feeds, users } from '../schema';
import { firstOrUndefined } from './utils';
import { eq, sql } from 'drizzle-orm';
import { fetchFeed } from '../../rss';

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
			last_fetched_at: feeds.last_fetched_at,
		})
		.from(feeds)
		.innerJoin(users, eq(feeds.userId, users.id));
	return allFeeds;
}

export async function getFeedByUrl(url: string) {
	const result = await db
		.select()
		.from(feeds)
		.where(eq(feeds.url, url))
		.limit(1);
	return firstOrUndefined(result);
}

export async function markFeedFetched(feedId: string) {
	const now = new Date();
	await db
		.update(feeds)
		.set({
			last_fetched_at: now,
			updatedAt: now,
		})
		.where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
	const result = await db
		.select()
		.from(feeds)
		.orderBy(sql`${feeds.last_fetched_at} NULLS FIRST`)
		.limit(1);
	return firstOrUndefined(result);
}

export async function scrapeFeeds() {
	const feed = await getNextFeedToFetch();
	if (!feed) {
		console.log('No feeds to fetch.');
		return;
	}

	await markFeedFetched(feed.id);

	try {
		const rss = await fetchFeed(feed.url);
		if (rss.channel && Array.isArray(rss.channel.item)) {
			for (const item of rss.channel.item) {
				console.log(item.title);
			}
		} else {
			console.log('No items found in feed.');
		}
	} catch (err) {
		console.error(`Failed to fetch feed: ${feed.url}`, err);
	}
}
