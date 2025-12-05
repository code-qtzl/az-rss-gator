import { UserCommandHandler, CommandHandler } from './commands/commands';
import { readConfig } from './config';
import { getUserByName } from './lib/db/queries/users';

export function middlewareLoggedIn(
	handler: UserCommandHandler,
): CommandHandler {
	return async (cmdName: string, ...args: string[]) => {
		const config = readConfig();
		const user = await getUserByName(config.currentUserName);

		if (!user) {
			throw new Error(`User ${config.currentUserName} not found`);
		}

		return handler(cmdName, user, ...args);
	};
}
