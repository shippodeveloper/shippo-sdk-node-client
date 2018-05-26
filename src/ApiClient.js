'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

let ParseError = require('./errors');
let FatalError = require('./errors');
let debug = require('debug');
let request = require('request-promise');



exports.ApiClient = class ApiClient {

  constructor(options = {}) {
    this.options = Object.assign({
      baseApiUrl : 'http://gbapi.changiomemuoi.com/api'
    }, options);
  }

  /**
   * Generates url with bot token and provided path/method you want to be got/executed by bot
   * @param  {String} path
   * @return {String} url
   * @private
   */
  _buildURL(endpoint) {
    return `${this.options.baseApiUrl}/${endpoint}`;
  }

  /**
   * Fix 'reply_markup' parameter by making it JSON-serialized, as
   * required by the Telegram Bot API
   * @param {Object} obj Object; either 'form' or 'qs'
   * @private
   */
  _fixReplyMarkup(obj) {
    const replyMarkup = obj.reply_markup;
    if (replyMarkup && typeof replyMarkup !== 'string') {
      obj.reply_markup = stringify(replyMarkup);
    }
  }

  callApi(endpoint, options = {}, cb) {

    if (this.options.request) {
      Object.assign(options, this.options.request);
    }

    if (options.form) {
      this._fixReplyMarkup(options.form);
    }
    if (options.qs) {
      this._fixReplyMarkup(options.qs);
    }

    options.method = 'GET';
    options.uri = this._buildURL(endpoint);
    options.simple = false;
    options.resolveWithFullResponse = true;
    options.forever = true;
    // options.json = true;
    debug('HTTP request: %j', options);
    request(options)
      .then(resp => {
        let data;
        try {
          data = resp.body = JSON.parse(resp.body);
        } catch (err) {
          throw new ParseError(`Error parsing response: ${resp.body}`, resp);
        }
        cb(data);

      }).catch(error => {
        throw error;
      });
  }
};