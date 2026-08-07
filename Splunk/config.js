require('dotenv').config();

const config = {
  port: Number(process.env.PORT || 3000),
  splunk: {
    enabled: process.env.SPLUNK_HEC_ENABLED === 'true',
    token: process.env.SPLUNK_HEC_TOKEN || '',
    url: process.env.SPLUNK_HEC_URL || 'https://localhost:8088',
    source: process.env.SPLUNK_HEC_SOURCE || 'node-todo-app',
    sourcetype: process.env.SPLUNK_HEC_SOURCETYPE || 'node_todo_app',
    index: process.env.SPLUNK_HEC_INDEX || 'main',
    strictSSL: process.env.SPLUNK_HEC_STRICT_SSL !== 'false',
  },
};

module.exports = config;
