"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const config_1 = require("./config");
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", true);
const connectDB = () => {
    mongoose_1.default.connect(config_1.DBURI, {
        dbName: "whouse",
        pass: config_1.DBPASS,
        user: config_1.DBUSER,
    }).then(m => console.log(`>>> Database connected at Whouse`))
        .catch(e => console.log(e));
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map