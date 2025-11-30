import fs from 'fs';
import os from 'os';
import path from 'path';

type Config = {
	currentUserName?: string;
	dbUrl: string;
};

export function setUser(config: Config, user: string): void {
	config.currentUserName = user;
	writeConfig(config);
}

function getConfigFilePath(): string {
	return path.join(os.homedir(), '.gatorconfig.json');
}

function writeConfig(config: Config): void {
	fs.writeFileSync(
		getConfigFilePath(),
		JSON.stringify({
			current_user_name: config.currentUserName,
			db_url: config.dbUrl,
		}),
	);
}

export function readConfig(): Config {
	return validateConfig(
		JSON.parse(fs.readFileSync(getConfigFilePath(), 'utf8')),
	);
}

function validateConfig(rawConfig: any): Config {
	return {
		dbUrl: rawConfig.db_url,
		currentUserName: rawConfig.current_user_name,
	};
}
