"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRegExp = void 0;
exports.emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
class Validation {
    static checkEmpty(fields, errorHandler) {
        for (const field of fields) {
            if (!field) {
                throw errorHandler;
            }
        }
    }
    static checkEmail(email, errorHandler) {
        if (!exports.emailRegExp.test(email))
            throw errorHandler;
    }
    static createGraphQLExtension(status = 200, headers, codes) {
        return {
            http: {
                status,
                headers,
                ...codes
            }
        };
    }
}
exports.default = Validation;
//# sourceMappingURL=validation.js.map