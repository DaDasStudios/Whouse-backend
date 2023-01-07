import { DBPASS, DBURI, DBUSER } from './config'
import mongoose from 'mongoose'

mongoose.set("strictQuery", true)

export const connectDB =() => {
    mongoose.connect(DBURI, {
        dbName: "whouse",
        pass: DBPASS,
        user: DBUSER,
    }).then(m => console.log(`>>> Database connected at Whouse`))
    .catch(e => console.log(e))
}