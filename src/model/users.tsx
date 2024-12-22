type Gender = 'M' | 'F'
export interface User {
  nickname: string
  name: string | null
  description: string | ''
  gender: Gender | ''
  age: number | 0
  region: string | null
}
