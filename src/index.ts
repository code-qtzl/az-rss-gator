import { setUser, readConfig } from './config.js';

function main() {
	let config = readConfig();
	setUser(config, 'Andres');
	config = readConfig();
	console.log(config);
}

main();
