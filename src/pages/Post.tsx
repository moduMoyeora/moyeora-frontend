import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import './Post.css'

interface LocationState {
  title: string
  author: string
  content: string
}

const Post: React.FC = () => {
  const location = useLocation()
  const state = location.state as LocationState | null
  const { createdAt } = location.state || {}
  // const { id } = useParams<{ id: string }>() 백엔드와 연결할 때 게시물 id 받아오는 목적

  // 값 안넘어 올 때 기본값
  const title = state?.title || '제목'
  const author = state?.author || '작성자' // 작성자는 백엔드와 연결할 때 가져와야 할듯
  const content = state?.content || '내용을 입력해 주세요.'
  const formattedCreatedAt = createdAt || '작성 시간 정보가 없습니다.'

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
