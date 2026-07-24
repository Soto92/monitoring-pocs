# Todo List - PostHog

A Todo List app with PostHog integration for event tracking.

## Setup

1. Edit `config.js` with your PostHog API key and host
2. Open `index.html` in your browser

## Tracked Events

- `app_loaded` - when the page loads
- `todo_added` - when a task is created
- `todo_toggled` - when a task is checked/unchecked
- `todo_deleted` - when a task is removed
- `todo_list_changed` - after each change

## Metrics in PostHog

- **Events** - `Activity > Events`
- **Insights** - `Insights > New Insight`
- **Dashboard** - `Dashboards`

## Files

- `index.html` - structure
- `style.css` - styling
- `app.js` - logic + PostHog
- `config.js` - PostHog configuration
- `.env` - environment variables
