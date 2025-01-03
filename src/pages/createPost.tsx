import React from 'react'
import PostForm from './postForm'
import { createClient } from '../api/http'
import { useNavigate, useParams } from 'react-router-dom'

// 글을 처음 작성하는 페이지
export interface Inputs {
  title: string
  content: string
}

function CreatePost() {
  const { boardId } = useParams<{ boardId: string }>()
  const navigate = useNavigate()
  const client = createClient()

  const handleSubmit = async (data: Inputs) => {
    try {
      console.log('Submitting data:', data)
      const response = await client.post(`/boards/${boardId}/posts`, data)
      console.log('Server response:', response.data)

      // 서버 응답에서 생성된 게시글의 ID를 받아옴
      const newPostId = response.data.id
      if (boardId == '1')
        navigate(`/boards/${boardId}/posts/${newPostId}/events`) // 이벤트 작성 페이지로 이동
      else navigate(`/boards/${boardId}/posts/${newPostId}`)
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  return (
    <PostForm
      onSubmit={handleSubmit}
      submitButtonText={boardId === '1' ? '다음' : '작성하기'}
    />
  )
}

export default CreatePost
