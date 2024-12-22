import { User } from '../model/users'
import { createClient } from './http'

export const client = createClient()

export const login = async (email: string, password: string) => {
  const response = await client.post('/users/login', { email, password })
  return response
}

export const signup = async (
  nickname: string,
  email: string,
  password: string
) => {
  const response = await client.post('/users/join', {
    nickname,
    email,
    password,
  })
  return response
}

export const checkForSignup = async (field: string, value: string) => {
  const response = await client.get(`/users/check`, {
    params: { field: field, value: value },
  })
  return response
}
export const getUser = async (user_id: string) => {
  const response = await client.get(`/users/profile/${user_id}`)
  return response
}

export const updateUser = async (user_id: string, user: User) => {
  let UpdatedUser: any = new Object()
  for (const [key, value] of Object.entries(user)) {
    if (value !== '' && value !== undefined) {
      UpdatedUser[key] = value
    }
  }
  const response = await client.put(`/users/profile/${user_id}`, UpdatedUser)
  return response
}
