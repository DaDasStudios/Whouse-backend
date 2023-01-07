import { config } from 'dotenv'

config()

export const PORT = process.env.PORT as string
export const DBURI = process.env.DBURI as string
export const DBUSER = process.env.DBUSER as string
export const DBPASS = process.env.DBPASS as string
export const JWT_SECRET = process.env.JWT_SECRET as string