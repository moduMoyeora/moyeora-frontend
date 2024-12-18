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

export const checkNickname = async (nickname: string) => {
  const response = await client.get(`/users/check-nickname/${nickname}`)
  return response
}

export const checkEmail = async (email: string) => {
  const response = await client.get(`/users/check-email/${email}`)
  return response
}

export const getUser = async (user_id: string) => {
  const response = await client.get(`/users/profile/${user_id}`)
  return response
}

export const updateUser = async (user_id: string, user: User) => {
  const response = await client.put(`/users/profile/${user_id}`, user)
  return response
}
