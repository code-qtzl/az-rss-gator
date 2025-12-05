import { readConfig } from '../config';
import { getUserByName } from '../lib/db/queries/users';
import { createFeed, getAllFeeds } from '../lib/db/queries/feeds';
import { createFeedFollow } from '../lib/db/queries/feed_follow';
import type { Feed, User } from '../lib/db/schema';
import { printFeedFollow } from './feed_follow';

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
	if (args.length !== 2) {
		throw new Error(`usage: ${cmdName} <feed_name> <url>`);
	}

	const config = readConfig();
	const user = await getUserByName(config.currentUserName);

	if (!user) {
		throw new Error(`User ${config.currentUserName} not found`);
	}

	const feedName = args[0];
	const url = args[1];

	const feed = await createFeed(feedName, url, user.id);
	if (!feed) {
		throw new Error(`Failed to create feed`);
	}

	console.log('Feed created successfully:');
	printFeed(feed, user);

	const feedFollow = await createFeedFollow(feed.id, user.id);
	if (feedFollow) {
		printFeedFollow(user.name, feedFollow.feedName);

		console.log(
			`${feedFollow.userName} is now following ${feedFollow.feedName}`,
		);
	}
}

function printFeed(feed: Feed, user: User) {
	console.log(`* ID:            ${feed.id}`);
	console.log(`* Created:       ${feed.createdAt}`);
	console.log(`* Updated:       ${feed.updatedAt}`);
	console.log(`* name:          ${feed.name}`);
	console.log(`* URL:           ${feed.url}`);
	console.log(`* User:          ${user.name}`);
}

export async function handlerAllFeeds(cmdName: string, ...args: string[]) {
	if (args.length !== 0) {
		throw new Error(`usage: ${cmdName}`);
	}
	const feeds = await getAllFeeds();
	if (feeds.length === 0) {
		console.log('No feeds found.');
		return;
	}

	feeds.forEach((feed) => {
		console.log(`* ID:            ${feed.id}`);
		console.log(`  Name:          ${feed.name}`);
		console.log(`  URL:           ${feed.url}`);
		console.log(`  Created By:    ${feed.createdBy}`);
		console.log('---------------------------');
	});
}
