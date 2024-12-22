import { createClient } from './http'
export const client = createClient()

const COMMENT_API = '/boards/:boardId/posts/:postId/comments'
export const getCommentById = async (commentId: string) => {
  const response = await client.get(`${COMMENT_API}/${commentId}`)
  return response
}
export const postCommentById = async (
  boardId: string,
  postId: string,
  content: string
) => {
  try {
    const requestBody = {
      content: content,
    }
    const response = await client.post(
      `boards/${boardId}/posts/${postId}/comments`,
      requestBody
    )
    return response
  } catch (error) {
    console.error('Error:', error)
  }
}

export const editCommentById = async (
  boardId: string,
  postId: string,
  commentId: string,
  content: string
) => {
  const response = await client.put(
    `/boards/${boardId}/posts/${postId}/comments/${commentId}`,
    { content }
  )
  return response
}

export const deleteCommentById = async (
  boardId: string,
  postId: string,
  commentId: string
) => {
  const response = await client.delete(
    `/boards/${boardId}/posts/${postId}/comments/${commentId}`
  )
  return response
}

export const getCommentsByPostId = async (boardId: string, postId: string) => {
  const response = await client.get(
    `/boards/${boardId}/posts/${postId}/comments`
  )
  return response
}
