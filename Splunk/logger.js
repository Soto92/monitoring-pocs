const crypto = require('crypto');
const SplunkLogger = require('splunk-logging').Logger;
const config = require('./config');

class Logger {
  constructor() {
    this.splunk = null;

    if (config.splunk.enabled && config.splunk.token) {
      this.splunk = new SplunkLogger({
        token: config.splunk.token,
        url: config.splunk.url,
        name: 'node-todo-app',
        source: config.splunk.source,
        sourcetype: config.splunk.sourcetype,
        index: config.splunk.index,
        maxBatchCount: 1,
        maxBatchSize: 0,
        maxBatchInterval: 0,
        maxRetries: 3,
      });
      this.splunk.requestOptions.strictSSL = config.splunk.strictSSL;
      this.splunk.requestOptions.headers['X-Splunk-Request-Channel'] =
        crypto.randomUUID();
      this.splunk.error = (err, context) => {
        console.error('[splunk] delivery error:', err);
      };
    }
  }

  log(level, message, extra = {}) {
    const ts = new Date().toISOString();
    console.log(`[${ts}] [${level.toUpperCase()}] ${message}`);

    if (!this.splunk) return;

    this.splunk.send(
      {
        message: { event: message, level, ...extra },
        severity: level,
        metadata: {
          source: config.splunk.source,
          sourcetype: config.splunk.sourcetype,
          index: config.splunk.index,
        },
      },
      (err) => {
        if (err) console.error('[splunk] send error:', err.message);
      },
    );
  }

  debug(message, extra) { this.log('debug', message, extra); }
  info(message, extra) { this.log('info', message, extra); }
  notice(message, extra) { this.log('notice', message, extra); }
  warn(message, extra) { this.log('warn', message, extra); }
  error(message, extra) { this.log('error', message, extra); }
  crit(message, extra) { this.log('crit', message, extra); }
}

module.exports = new Logger();
