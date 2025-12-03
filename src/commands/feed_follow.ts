import { createFeedFollow } from '../lib/db/queries/feed_follow';
import { readConfig } from '../config';
import { getUserByName } from '../lib/db/queries/users';
import { getFeedByUrl } from '../lib/db/queries/feeds';

export async function handlerFollow(cmdName: string, ...args: string[]) {
	if (args.length !== 1) {
		throw new Error(`usage: ${cmdName} <url>`);
	}

	const url = args[0];
	const config = readConfig();
	const user = await getUserByName(config.currentUserName);

	if (!user) {
		throw new Error(`User ${config.currentUserName} not found`);
	}

	const feed = await getFeedByUrl(url);
	if (!feed) {
		throw new Error(`Feed with URL ${url} not found`);
	}

	const feedFollow = await createFeedFollow(feed.id, user.id);
	if (!feedFollow) {
		throw new Error(`Failed to create feed follow`);
	}

	console.log(
		`${feedFollow.userName} is now following ${feedFollow.feedName}`,
	);
}
