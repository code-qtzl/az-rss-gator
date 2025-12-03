import { db } from '..';
import { users } from '../schema';

export async function deleteAllUsers() {
	await db.delete(users);
}
