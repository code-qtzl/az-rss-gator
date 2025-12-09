import { User } from '../lib/db/schema';
import { getUserByName } from '../lib/db/queries/users';
import { readConfig } from '../config';
import { getPostsForUser } from '../lib/db/queries/posts';

export type CommandHandler = (
	cmdName: string,
	...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
	registry: CommandsRegistry,
	cmdName: string,
	handler: CommandHandler,
): void {
	registry[cmdName] = handler;
}

export async function runCommand(
	registry: CommandsRegistry,
	cmdName: string,
	...args: string[]
): Promise<void> {
	const handler = registry[cmdName];
	if (!handler) {
		throw new Error(`Unknown command: ${cmdName}`);
	}

	await handler(cmdName, ...args);
}

export type UserCommandHandler = (
	cmdName: string,
	user: User,
	...args: string[]
) => Promise<void>;

export async function handlerBrowse(
	cmdName: string,
	user: User,
	limitStr: string,
) {
	const limit = limitStr ? parseInt(limitStr) : 2;

	const posts = await getPostsForUser(user.id, limit);
	for (const post of posts) {
		console.log(post.title);
		console.log(post.url);
		console.log(
			post.publishedAt?.toLocaleString() ?? 'Publish date unknown',
		);
		console.log(post.description);
		console.log('-'.repeat(70));
	}
}
