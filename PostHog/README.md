# Todo List - PostHog

A Todo List app with PostHog integration for event tracking.

# Screenshots

<img width="777" height="558" alt="Captura de tela 2026-07-24 135635" src="https://github.com/user-attachments/assets/fcd95c37-b83a-4527-a119-fc6f9145c5ef" />

<img width="1901" height="935" alt="Captura de tela 2026-07-24 135614" src="https://github.com/user-attachments/assets/bdb62f16-a484-428b-814b-b5081fb0733d" />


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
