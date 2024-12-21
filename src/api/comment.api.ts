import { createClient } from './http'
export const client = createClient()

const COMMENT_API = '/boards/:boardId/posts/:postId/comments'
export const getCommentById = async (commentId: string) => {
  const response = await client.get(`${COMMENT_API}/${commentId}`)
  return response
}
export const postCommentById = async (data: string) => {
  const response = await client.post(`${COMMENT_API}`, { data })
  return response
}

export const putCommentById = async (commentId: string, data: string) => {
  const response = await client.put(`${COMMENT_API}/${commentId}`, { data })
  return response
}

export const deleteCommentById = async (commentId: string) => {
  const response = await client.delete(`${COMMENT_API}/${commentId}`)
  return response
}
// comment 전부 보여주는 api 필요
export const getCommentsByBoardId = async (boardId: string) => {
  // const response = await client.get(`/boards/:boardId/posts/${boardId}/comments`)
  // return response
}
