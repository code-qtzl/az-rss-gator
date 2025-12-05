import { setUser, readConfig } from '../config';
import { createUser, getUserByName, getUsers } from '../lib/db/queries/users';
import { deleteAllUsers } from '../lib/db/queries/reset';

export async function handlerLogin(cmdName: string, ...args: string[]) {
	if (args.length !== 1) {
		throw new Error(`usage: ${cmdName} <name>`);
	}

	const userName = args[0];
	const existingUser = await getUserByName(userName);
	if (!existingUser) {
		throw new Error(`User ${userName} doesn't exist`);
	}
	setUser(existingUser.name);
	console.log('User switched successfully!');
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
	if (args.length !== 1) {
		throw new Error(`usage: ${cmdName} <name>`);
	}

	const userName = args[0];
	const user = await createUser(userName);
	setUser(userName);
	console.log(`User created successfully!`);
	console.log(user);
}

export async function handlerReset(cmdName: string, ...args: string[]) {
	if (args.length !== 0) {
		throw new Error(`usage: ${cmdName}`);
	}

	await deleteAllUsers();
	console.log('All users deleted successfully!');
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
	if (args.length !== 0) {
		throw new Error(`usage: ${cmdName}`);
	}

	const users = await getUsers();
	if (users.length === 0) {
		console.log('No users found.');
		return;
	}

	const config = readConfig();
	const currentUserName = config.currentUserName;

	users.forEach((user) => {
		if (user.name === currentUserName) {
			console.log(`* ${user.name} (current)`);
		} else {
			console.log(`* ${user.name}`);
		}
	});
}
