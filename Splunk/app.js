const express = require('express');
const config = require('./config');
const logger = require('./logger');

const app = express();
app.use(express.json());

const todos = [];

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.debug('http_request', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: Date.now() - start,
      ip: req.ip,
    });
  });
  next();
});

app.get('/', (req, res) => {
  res.json({
    service: 'node-splunk-poc',
    endpoints: [
      'GET /health',
      'GET /todos',
      'POST /todos',
      'PATCH /todos/:id',
      'DELETE /todos/:id',
      'GET /slow',
      'GET /error',
    ],
  });
});

app.get('/health', (req, res) => {
  logger.info('health_check', { uptime_s: Math.round(process.uptime()) });
  res.json({ status: 'ok' });
});

app.get('/todos', (req, res) => {
  logger.info('todos_listed', { total: todos.length });
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== 'string') {
    logger.warn('todo_invalid_input', { body: req.body });
    return res.status(400).json({ error: 'text is required' });
  }
  const todo = {
    id: todos.length + 1,
    text,
    done: false,
    created_at: new Date().toISOString(),
  };
  todos.push(todo);
  logger.info('todo_created', { id: todo.id, text: todo.text });
  res.status(201).json(todo);
});

app.patch('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    logger.warn('todo_not_found', { id });
    return res.status(404).json({ error: 'todo not found' });
  }
  todo.done = !todo.done;
  logger.info('todo_toggled', { id: todo.id, text: todo.text, done: todo.done });
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    logger.warn('todo_not_found', { id });
    return res.status(404).json({ error: 'todo not found' });
  }
  const [removed] = todos.splice(index, 1);
  logger.warn('todo_deleted', { id: removed.id, text: removed.text });
  res.json(removed);
});

app.get('/slow', (req, res) => {
  const started = Date.now();
  setTimeout(() => {
    const duration = Date.now() - started;
    logger.warn('slow_response', { endpoint: '/slow', duration_ms: duration });
    res.json({ message: 'this took a while', duration_ms: duration });
  }, 1200);
});

app.get('/error', (req, res) => {
  const err = new Error('simulated runtime failure');
  logger.error('error_simulated', { endpoint: '/error', message: err.message });
  res.status(500).json({ error: err.message });
});

app.use((req, res) => {
  logger.warn('route_not_found', { method: req.method, path: req.originalUrl });
  res.status(404).json({ error: 'route not found' });
});

app.use((err, req, res, next) => {
  logger.error('server_error', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
  });
  res.status(500).json({ error: 'internal server error' });
});

setInterval(() => {
  logger.info('heartbeat', {
    uptime_s: Math.round(process.uptime()),
    todos_count: todos.length,
  });
}, 30000);

app.listen(config.port, () => {
  logger.info('server_started', { port: config.port });
  console.log(`Node Splunk POC listening on http://localhost:${config.port}`);
});
