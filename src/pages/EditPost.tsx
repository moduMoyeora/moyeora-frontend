import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Inputs } from './createPost'
import PostForm from './postForm'
import { http } from '../api/http'

// 글을 수정하는 페이지
function EditPost() {
  const { boardId, id } = useParams<{ boardId: string; id: string }>()
  const [initialData, setInitialData] = useState<Inputs | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await http.get(`/boards/${boardId}/posts/${id}`)
        const { title, content } = response.data.data
        setInitialData({
          title,
          content,
        })
      } catch (error) {
        console.log('Error: ', error)
      }
    }
    fetchPost()
  }, [boardId, id])

  const handleSubmit = async (data: Inputs) => {
    try {
      const response = await http.put(`/boards/${boardId}/posts/${id}`, data)
      console.log('Server response:', response.data)
      alert('게시글 수정 완료!')
      navigate(`/boards/${boardId}/posts/${id}`) // 수정 완료 후 게시글 상세 페이지로 이동
    } catch (error) {
      console.log('Error: ', error)
      alert('게시글 수정에 실패했습니다.')
    }
  }

  if (!initialData) return <div>Loading...</div>

  return (
    <PostForm
      initialData={initialData}
      onSubmit={handleSubmit}
      submitButtonText="수정하기"
    />
  )
}

export default EditPost
