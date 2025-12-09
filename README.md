# RSS Gator CLI

A command-line RSS feed aggregator that allows you to manage RSS feeds, follow them, and browse posts from your favorite sources.

## Prerequisites

Before running the CLI, you'll need:

-   **Node.js** (v16 or higher)
-   **PostgreSQL** database
-   **npm** or **pnpm** (for installing dependencies)

### Installing PostgreSQL with Homebrew (macOS)

If you don't have PostgreSQL installed, you can install it using Homebrew:

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create a database for the project
createdb gator
```

To stop PostgreSQL when you're done:

```bash
brew services stop postgresql@15
```

Your default connection string will be:

```
postgres://username@localhost:5432/gator
```

Replace `username` with your macOS username (run `whoami` to check).

## Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up your database:
    ```bash
    npm run generate  # Generate migrations
    npm run migrate   # Run migrations
    ```

## Configuration

### Setting up the Config File

Make a copy of '.gatorconfig.sample.json' file, rename to '.gatorconfig.json' with the following structure:

```json
{
	"db_url": "postgres://USERNAME:@localhost:PORT_NUMBER/DATABASE_NAME",
	"current_USERNAME": "USERNAME"
}
```

The CLI requires a configuration file located at `~/.gatorconfig.json` in your home directory (\*\*NOT the project directory).

**Configuration fields:**

-   `db_url`: Your PostgreSQL connection string
-   `current_USERNAME`: The name of the currently logged-in user

**Note**: You'll set the `current_USERNAME` automatically when you register or login, but you need to provide a valid `db_url` before running any commands.

## Running the CLI

Run commands using:

```bash
npm start -- <command> [args...]
```

Or if you've built the project:

```bash
tsx ./src/index.ts <command> [args...]
```

## Available Commands

### User Management

#### `register <name>`

Create a new user account and automatically log in.

```bash
npm start -- register john
```

#### `login <name>`

Switch to an existing user account.

```bash
npm start -- login john
```

#### `users`

List all registered users. The current user is marked with an asterisk (\*).

```bash
npm start -- users
```

#### `reset`

⚠️ **Warning**: Deletes all users from the database. Use with caution!

```bash
npm start -- reset
```

### Feed Management

#### `addfeed <name> <url>`

Add a new RSS feed and automatically follow it. Requires login.

```bash
npm start -- addfeed Reddit https://www.reddit.com/discover.rss
```

#### `feeds`

List all available RSS feeds in the system.

```bash
npm start -- feeds
```

#### `follow <feed_url>`

Follow an existing RSS feed. Requires login.

```bash
npm start -- follow https://www.reddit.com/discover.rss
```

#### `following`

List all feeds you're currently following. Requires login.

```bash
npm start -- following
```

#### `unfollow <feed_url>`

Stop following an RSS feed. Requires login.

```bash
npm start -- unfollow https://www.reddit.com/discover.rss
```

### Feed Aggregation

#### `agg <time_between_requests>`

Start the feed aggregator that fetches new posts at regular intervals. Runs continuously until stopped with Ctrl+C.

The time format accepts: `1h`, `30m`, `15s`, or `3500ms`

```bash
npm start -- agg 30s
```

This will fetch feeds every 30 seconds. Press `Ctrl+C` to stop.

### Browsing Posts

#### `browse [limit]`

View posts from the feeds you follow. Requires login.

```bash
npm start -- browse      # Shows 2 posts (default)
npm start -- browse 10   # Shows 10 posts
```

## Example Workflow

Here's a typical workflow for getting started:

```bash
# 1. Register a new user
npm start -- register alice

# 2. Add some RSS feeds
npm start -- addfeed HackerNews https://news.ycombinator.com/rss
npm start -- addfeed DevTo https://dev.to/feed

# 3. View all feeds
npm start -- feeds

# 4. Start aggregating in the background (in a separate terminal)
npm start -- agg 1m

# 5. Browse the latest posts
npm start -- browse 5

# 6. Unfollow a feed if needed
npm start -- unfollow https://dev.to/feed

# 7. Check which feeds you're following
npm start -- following
```

## Database Schema

The application uses the following main tables:

-   **users**: Stores user accounts
-   **feeds**: RSS feed information
-   **feed_follows**: Tracks which users follow which feeds
-   **posts**: Stores fetched RSS posts

## Troubleshooting

**Config file errors**: Make sure `~/.gatorconfig.json` exists with valid `db_url` and `current_user_name` fields.

**Database connection errors**: Verify your PostgreSQL database is running and the connection string in the config file is correct.

**Command not found**: Ensure you've run `npm install` and use `npm start --` before each command.
