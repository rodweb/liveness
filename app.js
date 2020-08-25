const express = require('express');

const PORT = 8080;
const HOST = '0.0.0.0';

let ok = true;

const log = (...args) => console.log(`${new Date().toISOString()}`, ...args);

const app = express();
app.get('/liveness', (req, res) => {
  log(`GET /liveness => ${ok}`);
  if (ok) {
    res.send('ok');
  } else {
    res.status(400).send();
  }
});

app.get('/fail', (req, res) => {
  log('GET /fail');
  ok = false;
  res.status(200).send();
})

app.get('/ok', (req, res) => {
  log('GET /ok');
  ok = true;
  res.status(200).send();
})

const server = app.listen(PORT, HOST)
log(`Running on http://${HOST}:${PORT}`);

function gracefulShutdown(signal) {
  log(`\nReceived signal ${signal}`);
  setTimeout(() => process.exit(1), 1000);
  server.close(() => {
    log('Server closed');
    process.exit(0);
  })
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);


setTimeout(() => {
  log('failing from now on');
  ok = false;
}, 30000);

