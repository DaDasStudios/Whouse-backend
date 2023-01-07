
export interface IUser {
    _id: string
    username: string
    email: string
    password: string,
    occupation: string,
    imageUrl: string,
    roles: string[],
    createdAt: string,
    updatedAt: string,
}