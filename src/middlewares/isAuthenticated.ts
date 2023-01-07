import { Request } from 'express'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

export const isAuthenticated = (req: Request) => {
    const token = req.header('x-access-token')
    if (!token) throw new Error("TOKEN NO PROPORCIONADO")
    try {
        const decoded = verify(token, JWT_SECRET) as { id: string }
        return decoded.id
    } catch (err) {
        throw new Error("TOKEN INVÁLIDO")
    }
}