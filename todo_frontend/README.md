# Task Organizer Frontend

React single-page UI for the multi-container To-Do application.

## Run

- npm start
- npm test

## Environment

- REACT_APP_API_BASE: Base URL of backend (e.g. http://localhost:3001). If not set, the app will call same-origin paths.

Create a `.env.local` with:
```
REACT_APP_API_BASE=http://localhost:3001
```

## Features

- Responsive layout: header + sidebar + main
- CRUD for tasks and categories via REST API
- Filters: search, category, status, priority, due range, sort
- Theme toggle (light/dark)

