"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(code, message) {
        super(`${code}: ${message}`);
        this.code = code;
    }
    toJSON() {
        return {
            code: this.code,
            message: this.message,
        };
    }
}
exports.BaseError = BaseError;
class FatalError extends BaseError {
    /**
     * Fatal Error. Error code is `"EFATAL"`.
     * @class FatalError
     * @constructor
     * @param  {String|Error} data Error object or message
     */
    constructor(data) {
        const error = (typeof data === 'string') ? null : data;
        const message = error ? error.message : data;
        super('EFATAL', message);
        if (error)
            this.stack = error.stack;
    }
}
exports.FatalError = FatalError;
class ParseError extends BaseError {
    /**
     * Error during parsing. Error code is `"EPARSE"`.
     * @class ParseError
     * @constructor
     * @param  {String} message Error message
     * @param  {http.IncomingMessage} response Server response
     */
    constructor(message, response) {
        super('EPARSE', message);
        this.response = response;
    }
}
exports.ParseError = ParseError;
