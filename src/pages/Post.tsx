import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface PostData {
  title: string
  author: string
  content: string
  createdAt: string
}

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [postData, setPostData] = useState<PostData | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('게시물을 찾을 수 없습니다.')
          } else if (response.status === 500) {
            setError('서버 오류가 발생했습니다.')
          } else {
            setError('요청 데이터가 유효하지 않습니다.')
          }
          return
        }
        const data = await response.json()
        setPostData(data)
      } catch (error) {
        console.error('Error fetching post data:', error)
        setError('서버와의 연결에 문제가 발생했습니다.')
      }
    }

    fetchPostData()
  }, [id])

  // 데이터 가져오는 중
  if (!postData && !error) {
    return <div>Loading...</div>
  }

  // 에러 발생 시 에러 메시지 표시
  if (error) {
    return <div>{error}</div>
  }

  // 서버에서 데이터 가져와서 게시물 보여줌
  const { title, author, content, createdAt } = postData!
  const formattedCreatedAt = createdAt || '작성 시간 정보가 없습니다.' // default 값 설정 해둠

  return (
    <div className="result-container">
      <div className="header">
        <h1>{title}</h1>
        <div className="author-time-container">
          <h3>{author}</h3>
          <h3>{formattedCreatedAt}</h3>
        </div>
      </div>

      <div className="separator"></div>
      <div>
        <h4>작성 내용</h4>
        <textarea className="result" value={content} readOnly />
      </div>
    </div>
  )
}

export default Post
