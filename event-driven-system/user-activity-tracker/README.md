# User Activity Tracker

An event-driven user activity tracking system built with NestJS and Kafka to learn asynchronous messaging patterns.

## Architecture

```
POST /add/event → EventsService → Kafka (user.events) → 3 consumer groups → MongoDB (session consumer)
```

- **PageViewConsumer** — logs `page_view` events
- **ClickConsumer** — logs `click` events
- **SessionConsumer** — persists all event types to MongoDB

## Prerequisites

- Node.js 18+
- Docker and Docker Compose

## Local setup

```bash
# Start Kafka, Kafka UI, MongoDB, and Mongo Express
docker compose up -d

# Install dependencies and start the API
npm install
npm run start:dev
```

## Services

| Service       | URL                      |
|---------------|--------------------------|
| NestJS API    | http://localhost:3000    |
| Kafka         | localhost:9092           |
| Kafka UI      | http://localhost:8080    |
| MongoDB       | localhost:27017          |
| Mongo Express | http://localhost:8081    |

## Environment variables

| Variable                        | Default                                      |
|---------------------------------|----------------------------------------------|
| `PORT`                          | `3000`                                       |
| `KAFKA_BROKER`                  | `localhost:9092`                             |
| `KAFKA_EVENTS_TOPIC`            | `user.events`                                |
| `KAFKA_CLIENT_ID`               | `activity-tracker-api`                       |
| `KAFKA_CONSUMER_FROM_BEGINNING` | `false` (set to `"true"` to replay from start) |
| `MONGO_URI`                     | `mongodb://localhost:27017/activity-tracker` |

## API

### POST /add/event

Accept an event and publish to Kafka. Returns `202 Accepted`.

```bash
curl -X POST http://localhost:3000/add/event \
  -H "Content-Type: application/json" \
  -d '{"eventType":"page_view","sessionId":"sess-1","userId":"user-1","properties":{"path":"/home"}}'
```

Response:

```json
{ "eventId": "<uuid>", "status": "accepted" }
```

### GET /events?limit=50

Return recently persisted events from MongoDB (newest first).

## Event shape

```json
{
  "eventType": "page_view",
  "sessionId": "sess-1",
  "userId": "user-1",
  "properties": { "path": "/home" }
}
```

Supported types: `page_view`, `click`, and any string (session consumer persists all).

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run start:dev` | Start with hot reload |
| `npm run build`     | Build for production  |
| `npm run start:prod`| Run production build  |
| `npm test`          | Run unit tests        |
