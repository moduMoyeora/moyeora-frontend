type Gender = 'M' | 'F'
export interface User {
  nickname: string
  name?: string
  description?: string
  gender?: Gender
  age?: number | string
  region?: string
}
