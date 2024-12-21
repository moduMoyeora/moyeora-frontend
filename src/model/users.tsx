type Gender = '남자' | '여자'
export interface User {
  nickname: string
  name: string | null
  description: string | ''
  gender: Gender | ''
  age: number | 0
  region: string | null
}
