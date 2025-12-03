import { XMLParser } from 'fast-xml-parser';

type RSSFeed = {
	channel: {
		title: string;
		link: string;
		description: string;
		item: RSSItem[];
	};
};

type RSSItem = {
	title: string;
	link: string;
	description: string;
	pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
	const resp = await fetch(feedURL, {
		headers: {
			'User-Agent': 'gator',
		},
	});
	const data = await resp.text();

	const parser = new XMLParser();
	const full = parser.parse(data);

	if (full.rss.channel === undefined) {
		throw new Error('invalid rss xml format');
	}
	const channel = full.rss.channel;

	if (
		channel.title === undefined ||
		channel.description === undefined ||
		channel.link === undefined
	) {
		throw new Error('Failed to find channel metadata');
	}

	const items = [];
	if (Array.isArray(channel.item)) {
		for (const item of channel.item) {
			if (
				item.title === undefined ||
				item.link === undefined ||
				item.description === undefined ||
				item.pubDate === undefined
			) {
				continue;
			}

			items.push({
				title: item.title,
				link: item.link,
				description: item.description,
				pubDate: item.pubDate,
			});
		}
	}

	const feed = {
		channel: {
			title: channel.title as string,
			link: channel.link as string,
			description: channel.description as string,
			item: items as RSSItem[],
		},
	} as RSSFeed;

	return feed;
}
