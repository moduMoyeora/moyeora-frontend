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

export const editCommentById = async (
  boardId: string,
  postId: string,
  commentId: string,
  data: string
) => {
  const response = await client.put(
    `/boards/${boardId}/posts/${postId}/comments/${commentId}`,
    { data }
  )
  return response
}

export const deleteCommentById = async (
  boardId: string,
  postId: string,
  commentId: string
) => {
  const response = await client.delete(
    `/boards/${boardId}/posts/${postId}/comments`
  )
  return response
}

export const getCommentsByPostId = async (boardId: string, postId: string) => {
  const response = await client.get(
    `/boards/${boardId}/posts/${postId}/comments`
  )
  return response
}
