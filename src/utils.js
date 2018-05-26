"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stringify(data) {
    if (typeof data === 'string') {
        return data;
    }
    return JSON.stringify(data);
}
exports.stringify = stringify;