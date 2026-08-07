# Node Todo API - Splunk HEC

A Node.js/Express server that logs application events to Splunk using the
official `splunk-logging` SDK via the **HTTP Event Collector (HEC)**.

## Setup

### 1. Configure Splunk

In Splunk Web: `Settings > Data Inputs > HTTP Event Collector > New Token`.
Enable the token, pick an index (e.g. `main`) and note the token value.

I preferred to install it via Docker:

<img width="1649" height="557" alt="Captura de tela 2026-08-07 114335" src="https://github.com/user-attachments/assets/62e4544f-fb84-46d5-a072-542c57aa03b8" />


### 2. Configure the app

```bash
cp .env.example .env
```

Edit `.env`:

- `SPLUNK_HEC_URL` - your HEC endpoint (default `https://localhost:8088`)
- `SPLUNK_HEC_TOKEN` - the HEC token you created
- `SPLUNK_HEC_INDEX` - index to write to (default `main`)
- `SPLUNK_HEC_STRICT_SSL` - set to `false` for local Splunk with a self-signed cert

### 3. Run

```bash
npm install
npm start
```

## Endpoints

| Endpoint             | Logged event      | Level |
| -------------------- | ----------------- | ----- |
| `GET /`              | -                 | -     |
| `GET /health`        | `health_check`    | info  |
| `GET /todos`         | `todos_listed`    | info  |
| `POST /todos`        | `todo_created`    | info  |
| `POST /todos` (bad)  | `todo_invalid_input` | warn |
| `PATCH /todos/:id`   | `todo_toggled` / `todo_not_found` | info / warn |
| `DELETE /todos/:id`  | `todo_deleted` / `todo_not_found` | warn |
| `GET /slow`          | `slow_response`   | warn  |
| `GET /error`         | `error_simulated` | error |
| any unknown route    | `route_not_found` | warn  |

The app also logs a `http_request` (debug) line for every request and a
`heartbeat` (info) every 30 seconds.

```bash
# exercise the endpoints
curl http://localhost:3000/health
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"text":"buy milk"}'
curl http://localhost:3000/slow
curl http://localhost:3000/error
curl http://localhost:3000/nope
```

<img width="1286" height="322" alt="Captura de tela 2026-08-07 114405" src="https://github.com/user-attachments/assets/5393d77a-772a-47c5-8176-409579ee824f" />


## Searching in Splunk

In `Search & Reporting`. The `source` / `sourcetype` values below must match
what you set in `.env` (`SPLUNK_HEC_SOURCE`, `SPLUNK_HEC_SOURCETYPE`):

```spl
index="main" sourcetype="node_app"
```

```spl
index="main" source="node-app"
```

```spl
index="main" level="error" OR level="warn"
```

<img width="1893" height="937" alt="Captura de tela 2026-08-07 114302" src="https://github.com/user-attachments/assets/c09f63cb-c66e-4ae8-975c-6825f8665f38" />


Note: changing `.env` and restarting only affects *new* events. Old events keep
the previous `source`/`sourcetype`, so search with the current values (or `index="main"`
alone) to see everything.

## Files

- `app.js` - Express server + log calls
- `logger.js` - wrapper around `splunk-logging` (console + HEC)
- `config.js` - config loaded from `.env`
- `.env` / `.env.example` - environment configuration
