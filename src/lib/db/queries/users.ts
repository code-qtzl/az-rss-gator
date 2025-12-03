import { db } from '..';
import { users } from '../schema';
import { eq } from 'drizzle-orm';

export async function createUser(name: string) {
	const existingUser = await getUserByName(name);
	if (existingUser) {
		throw new Error(`User ${name} already exists`);
	}
	const [result] = await db.insert(users).values({ name: name }).returning();
	return await result;
}
export async function getUserByName(name: string) {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.name, name))
		.limit(1);
	return await user[0];
}

export async function getUsers() {
	const allUsers = await db.select().from(users);
	return allUsers;
}
