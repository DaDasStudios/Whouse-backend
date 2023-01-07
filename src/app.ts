import express, { Application, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import { connectDB } from "./database";
import { IServerSettings } from './interfaces/ServerSettings'
import { graphqlHTTP } from 'express-graphql'
import { GraphQLFormattedError } from 'graphql'
import { schema } from "./graphql/schema";

export default class App {
    private app: Application

    constructor() {
        this.app = express()
    }

    public settings(options: IServerSettings) {
        const { PORT } = options
        this.app.set('port', PORT)
    }

    public middlewares() {
        this.app.use(express.json())
        // this.app.use((req: Request, res: Response, next: NextFunction) => {
        //     console.log(req)
        //     next()
        // })
        this.app.use(process.env.NODE_ENV === 'development' ? morgan("dev") : morgan("common", {
            stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
        }))
        this.app.use('/graphql', graphqlHTTP({
            schema,
            graphiql: process.env.NODE_ENV === 'development',
            customFormatErrorFn: (err) => {
                return {
                    message: err.message,
                    extensions: err.extensions,
                    locations: err.locations,
                    path: err.path,
                }
            },
        }))
    }

    public routes() {
        this.app.get('/', (req: Request, res: Response) => {
            return res.send("Welcome to Whouse GraphQL API")
        })
    }

    public run() {
        this.app.listen(this.app.get('port'), () => console.info(`>>> 🚀 Server running in port ${this.app.get('port')}`))
        connectDB()
    }
}