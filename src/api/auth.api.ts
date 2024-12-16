import { createClient } from './http'

const client = createClient()

export const login = async (email: string, password: string) => {
  const response = await client.post('/users/login', { email, password })
  return response
}

export const signup = async (
  nickname: string,
  email: string,
  password: string
) => {
  const response = await client.post('/users/signup', {
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
