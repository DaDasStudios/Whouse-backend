"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const express_graphql_1 = require("express-graphql");
const schema_1 = require("./graphql/schema");
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
    }
    settings(options) {
        const { PORT } = options;
        this.app.set('port', PORT);
    }
    middlewares() {
        this.app.use(express_1.default.json());
        // this.app.use((req: Request, res: Response, next: NextFunction) => {
        //     console.log(req)
        //     next()
        // })
        this.app.use(process.env.NODE_ENV === 'development' ? (0, morgan_1.default)("dev") : (0, morgan_1.default)("common", {
            stream: fs_1.default.createWriteStream(path_1.default.join(__dirname, 'access.log'), { flags: 'a' })
        }));
        this.app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
            schema: schema_1.schema,
            graphiql: process.env.NODE_ENV === 'development',
            customFormatErrorFn: (err) => {
                return {
                    message: err.message,
                    extensions: err.extensions,
                    locations: err.locations,
                    path: err.path,
                };
            },
        }));
    }
    routes() {
        this.app.get('/', (req, res) => {
            return res.send("Welcome to Whouse GraphQL API");
        });
    }
    run() {
        this.app.listen(this.app.get('port'), () => console.info(`>>> 🚀 Server running in port ${this.app.get('port')}`));
        (0, database_1.connectDB)();
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map