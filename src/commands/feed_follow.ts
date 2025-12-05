import {
	createFeedFollow,
	getFeedFollowsForUser,
} from '../lib/db/queries/feed_follow';
import { readConfig } from '../config';
import { getUserByName } from '../lib/db/queries/users';
import { getFeedByUrl } from '../lib/db/queries/feeds';
import { User } from '../lib/db/schema';

export async function handlerFollow(
	cmdName: string,
	user: User,
	...args: string[]
) {
	if (args.length !== 1) {
		throw new Error(`usage: ${cmdName} <feed_url>`);
	}

	const config = readConfig();

	const feedURL = args[0];
	const feed = await getFeedByUrl(feedURL);
	if (!feed) {
		throw new Error(`Feed not found: ${feedURL}`);
	}

	const ffRow = await createFeedFollow(feed.id, user.id);

	console.log(`Feed follow created:`);
	if (ffRow) {
		printFeedFollow(ffRow.userName, ffRow.feedName);
	}
}

export async function handlerListFeedFollows(_: string, user: User) {
	const config = readConfig();

	const feedFollows = await getFeedFollowsForUser(user.id);
	if (feedFollows.length === 0) {
		console.log(`No feed follows found for this user.`);
		return;
	}

	console.log(`Feed follows for user %s:`, user.id);
	for (let ff of feedFollows) {
		console.log(`* %s`, ff.feedName);
	}
}

export function printFeedFollow(username: string, feedname: string) {
	console.log(`* User:          ${username}`);
	console.log(`* Feed:          ${feedname}`);
}
