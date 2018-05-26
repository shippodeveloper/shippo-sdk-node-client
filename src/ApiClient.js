'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

let ParseError = require('./errors');
let FatalError = require('./errors');
let debug = require('debug');
let request = require('request');

exports.ApiClient = class ApiClient {
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

  _request(endpoint, options = {}) {

    if (this.options.request) {
      Object.assign(options, this.options.request);
    }

    if (options.form) {
      this._fixReplyMarkup(options.form);
    }
    if (options.qs) {
      this._fixReplyMarkup(options.qs);
    }

    options.method = 'POST';
    options.url = this._buildURL(_path);
    options.simple = false;
    options.resolveWithFullResponse = true;
    options.forever = true;
    debug('HTTP request: %j', options);
    return request(options)
      .then(resp => {
        let data;
        try {
          data = resp.body = JSON.parse(resp.body);
        } catch (err) {
          throw new ParseError(`Error parsing response: ${resp.body}`, resp);
        }

        if (data.ok) {
          return data.result;
        }
      }).catch(error => {
        // TODO: why can't we do `error instanceof errors.BaseError`?
        if (error.response) throw error;
        throw new FatalError(error);
      });
  }
};