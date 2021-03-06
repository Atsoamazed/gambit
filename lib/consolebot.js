'use strict';

const colors = require('colors'); // eslint-disable-line no-unused-vars
const fs = require('fs');
const readline = require('readline');
const superagent = require('superagent');
const underscore = require('underscore');
const uuidv4 = require('uuid/v4');

const helpers = require('./helpers');
const defaultConfig = require('../config/lib/consolebot');

const retryHeader = 'x-blink-retry-count';
const requestIdHeader = 'x-request-id';
const suppressSendHeader = 'x-gambit-outbound-reply-suppress';

class Consolebot {
  constructor(config = {}) {
    this.options = underscore.extend({}, defaultConfig, config);
    this.history = [];
    this.replyColor = this.options.replyColor;
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.readline.setPrompt(`${this.options.prompt} `.bold);
    this.readline.on('line', input => this.post(this.parseInput(input)));
    this.readline.on('close', () => process.exit(0));
  }
  parseInput(string) {
    if (string === 'photo') {
      const media = this.options.request.media;
      return {
        MediaContentType0: media.type,
        MediaUrl0: media.url,
      };
    }
    if (string === 'retry' && this.history.length) {
      const retryPayload = this.history.pop();
      retryPayload.headers[retryHeader] += 1;
      return retryPayload;
    }
    return {
      Body: string,
    };
  }
  post(data) {
    let payload;

    if (data.headers && data.headers[retryHeader]) {
      payload = data;
    } else {
      const defaultPayload = this.options.request.body;
      defaultPayload.Body = '';
      defaultPayload.headers = {};
      defaultPayload.headers[retryHeader] = 0;
      defaultPayload.headers[requestIdHeader] = uuidv4();

      payload = underscore.extend({}, defaultPayload, data);
    }

    this.history.push(payload);
    const request = superagent
      .post(this.options.request.url);

    Object.keys(payload.headers).forEach((headerName) => {
      request.set(headerName, payload.headers[headerName]);
    });

    return request
      .set(suppressSendHeader, this.options.request.headers.suppressReply)
      .send(payload)
      .then(res => this.handleSuccess(res))
      .catch(error => this.handleError(error));
  }
  prompt() {
    this.readline.prompt();
  }
  start() {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(this.options.introFilePath),
    });
    lineReader
      .on('line', line => console.log(line[this.replyColor])) // eslint-disable-line no-console
      .on('close', () => this.prompt());
  }
  reply(outboundMessageText, color = this.replyColor) {
    const prefix = this.options.replyPrefix.bold[color];
    const replyText = outboundMessageText[color];
    Consolebot.print(prefix, replyText);
    this.prompt();
  }
  handleError(err) {
    const error = helpers.util.parseStatusAndMessageFromError(err);
    const text = `An error occurred.\nstatus: ${error.status}\nmessage: ${error.message}`;
    this.reply(text, 'red');
  }
  handleSuccess(res) {
    const outboundMessages = res.body.data.messages.outbound;
    const text = outboundMessages.length ? outboundMessages[0].text : '';
    this.reply(text);
  }
  static print(prefix, messageText) {
    /* eslint-disable no-console */
    console.log('');
    console.log(prefix, messageText);
    console.log('');
    /* eslint-enable no-console */
  }
}

module.exports = Consolebot;
