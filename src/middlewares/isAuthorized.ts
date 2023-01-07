import User from '../models/User'
import Role from '../models/Role'

export const isAuthorized = async (id: string, roles: string[]) => {
    if (id) {
        const user = await User.findById(id)
        const foundRolesNames = (await Role.find({ _id: { $in: user?.roles } })).map(e => e.name)
        if (roles.some(e => foundRolesNames.includes(e))) return user
        else throw new Error("USUARIO NO AUTORIZADO")
    } else throw new Error("USUARIO NO ENCONTRADO")
}