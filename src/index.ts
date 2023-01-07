import App from "./app";
import { PORT } from './config'

const app = new App()
app.settings({
    PORT
})
app.middlewares()
app.routes()
app.run()

