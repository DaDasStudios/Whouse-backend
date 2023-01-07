import bycript from 'bcryptjs'

export const encryptPassword = async (password: string): Promise<string> => {
    const salt = await bycript.genSalt(10)
    return await bycript.hash(password, salt)
}

export const comparePassword = async (password: string, savedPassword: string) => {
    return await bycript.compare(password, savedPassword)
}