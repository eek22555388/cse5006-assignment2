# CSE5006 Assessment 2 — RSS Server, API and Database

A backend-driven RSS system extending the Assessment 1 frontend. Feed content is
stored in PostgreSQL, served through a REST API, and consumed by an RSS Client
interface. The whole stack runs in Docker.

**Author:** Erdi Erden Kekec — Student Number 22555388
**Repository:** https://github.com/eek22555388/cse5006-assignment2

## Architecture

Three containers, orchestrated with Docker Compose:

| Service    | Role                              | Tech                       | Port      |
|------------|-----------------------------------|----------------------------|-----------|
| `frontend` | RSS Client — user interface       | Next.js, React, Tailwind   | 80 → 3000 |
| `api`      | RSS Server — REST API and RSS XML | Next.js API routes, Prisma | 4080 → 3000 |
| `postgres` | Data persistence                  | PostgreSQL 15              | 5432      |

The frontend calls the API over HTTP; the API reaches Postgres by service name on
Compose's private network. The API base URL is injected as an environment
variable rather than hardcoded, so the same images run unchanged locally or on EC2.

## Database schema

Four models, defined in `api/prisma/schema.prisma` and managed with Prisma migrations.

- **Feed** — an RSS channel (title, generated slug, description, site URL)
- **FeedItem** — one post within a channel (title, summary, content, link, image,
  category, published date, GUID)
- **Author** — a content contributor
- **RequestLog** — per-request operational metrics (path, method, client IP,
  user agent, feed, status code)

Design decisions worth noting:

- `Feed` → `FeedItem` is one-to-many with `onDelete: Cascade` — an item cannot
  exist without its channel.
- `Author` → `FeedItem` uses `onDelete: Restrict` — deleting an author who still
  has items is refused, and the API returns a 409 explaining what to do instead.
- Both `FeedItem` and `Author` carry an `isActive` flag for soft deletion.
  Withdrawing content hides it from every public read path without destroying it,
  and is reversible.
- Slugs are generated from titles rather than supplied by the client, so title and
  identifier cannot drift apart. The unique constraint on slug also rejects
  duplicate feed titles.
- `RequestLog.feedId` is deliberately a plain column, not a foreign key — log
  entries must survive deletion of the records they reference.

## API endpoints

All endpoints send CORS headers and log requests to the database.

| Method | Endpoint                    | Purpose                             |
|--------|-----------------------------|-------------------------------------|
| GET    | `/api/feeds`                | All feeds, with item counts         |
| GET    | `/api/feeds?id=`            | One feed with its active items      |
| POST   | `/api/feeds`                | Create a feed (slug auto-generated) |
| PATCH  | `/api/feeds?id=`            | Update a feed                       |
| DELETE | `/api/feeds?id=`            | Delete a feed and cascade its items |
| GET    | `/api/items`                | Active items, newest first          |
| GET    | `/api/items?feedId=`        | Items filtered by feed              |
| GET    | `/api/items?id=`            | One item with feed and author        |
| POST   | `/api/items`                | Publish an item                     |
| PATCH  | `/api/items?id=`            | Partial update                      |
| DELETE | `/api/items?id=`            | Soft delete (sets `isActive` false) |
| GET    | `/api/authors`              | All authors with item counts        |
| POST   | `/api/authors`              | Create an author                    |
| PATCH  | `/api/authors?id=`          | Update or deactivate                |
| DELETE | `/api/authors?id=`          | Delete, refused if items exist      |
| GET    | `/api/rss?slug=`            | RSS 2.0 XML feed                    |
| GET    | `/api/health`               | Healthcheck — verifies the database |
| GET    | `/api/count`                | Request and content metrics         |

Responses use meaningful status codes: 201 on create, 204 on hard delete, 400 for
invalid input, 404 for missing records, 409 for conflicts, 503 when the database
is unreachable.

### Operational endpoints

`/api/health` runs a real query against Postgres rather than returning a static
response, and reports 503 if the database cannot be reached. It is deliberately
excluded from request logging so that monitoring traffic does not distort the
metrics it monitors.

`/api/count` aggregates in SQL and returns total requests, requests in the last
hour, unique clients, requests per path, per status code and per feed, plus feed,
item and author counts.

## Frontend pages

| Route         | Purpose                                              |
|---------------|------------------------------------------------------|
| `/`           | Overview and entry points                             |
| `/feeds`      | RSS Client — live items, filterable by feed           |
| `/feeds/[id]` | Item detail with stored content and optional source link |
| `/manage`     | Create and remove feeds, authors and items            |
| `/about`      | Project background                                    |
| `/settings`   | Theme and display preferences (carried over from A1)  |

## Running the project

Requires Docker and Docker Compose.

```bash
git clone git@github.com:eek22555388/cse5006-assignment2.git
cd cse5006-assignment2
```

Set the public API URL in `docker-compose.yml` under the `frontend` service:

```yaml
- NEXT_PUBLIC_API_URL=http://<your-host>:4080
```
In development, add the host to `allowedDevOrigins` in both `frontend/next.config.ts` and `api/next.config.ts`. Next.js blocks dev assets from unrecognised origins; production builds do not require this.

Then:

```bash
sudo docker-compose build
sudo docker-compose up
```

- RSS Client: `http://<your-host>`
- RSS Server: `http://<your-host>:4080`
- RSS XML: `http://<your-host>:4080/api/rss?slug=<feed-slug>`

Migrations are applied automatically on API container startup via
`prisma migrate deploy`, so a fresh database builds its own schema.

## Development notes

- Built on EC2 (Amazon Linux 2023, t2.medium) with Docker Compose.
- Each major feature was developed on its own branch and merged into a clean
  `main`: CRUD API, operational endpoints, RSS feed, frontend integration, Docker,
  content management.
- `node_modules`, `.env` files and Prisma's generated client are excluded from the
  repository; the client is regenerated during the Docker build.

## Known limitations and future work

- CORS is open to all origins, which suits a lab deployment but would be
  restricted to the frontend origin in production.
- Client identification uses IP address, which cannot distinguish users behind
  shared NAT.
- Theme and layout preferences are stored in localStorage rather than cookies, so the server
  cannot render the correct theme on first paint. Button and status-text contrast in dark mode was corrected following Assessment 1 feedback.
- There is no authentication; the management interface is open.