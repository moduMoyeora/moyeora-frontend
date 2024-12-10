import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/react-editor'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Editor.css'

const TuiEditor: React.FC = () => {
  const editorRef = useRef<Editor | null>(null)
  const [title, setTitle] = useState<string>('')
  const [author, setAuthor] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')

  const navigate = useNavigate()

  const handleSave = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    if (editorRef.current) {
      const editorContent = editorRef.current.getInstance().getMarkdown()
      setContent(editorContent)
      const currentDate = new Date().toLocaleString()
      setCreatedAt(currentDate)

      // 페이지 이동과 함께 state 전달
      navigate('/post', {
        state: {
          title,
          author,
          content: editorContent,
          createdAt: currentDate,
        },
      })
    }
  }

  return (
    <div className="editor-container">
      <div className="editor-input-row">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="작성자"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <Editor
        previewStyle="vertical"
        height="400px"
        initialEditType="markdown"
        initialValue="내용을 입력해주세요."
        ref={editorRef}
      />
      <div>
        <button className="btn_save" onClick={handleSave}>
          저장하기
        </button>
      </div>
    </div>
  )
}

export default TuiEditor
