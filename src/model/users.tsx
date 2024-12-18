type Gender = '남자' | '여자'
export interface User {
  nickname: string
  realname: string | null
  description: string | ''
  gender: Gender | ''
  age: number | 0
  regions: string | null
}
