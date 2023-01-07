"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.DBPASS = exports.DBUSER = exports.DBURI = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.PORT = process.env.PORT;
exports.DBURI = process.env.DBURI;
exports.DBUSER = process.env.DBUSER;
exports.DBPASS = process.env.DBPASS;
exports.JWT_SECRET = process.env.JWT_SECRET;
//# sourceMappingURL=config.js.map