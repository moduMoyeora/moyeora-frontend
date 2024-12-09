import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/react-editor'
import React, { useRef, useState } from 'react'

const TuiEditor: React.FC = () => {
  const editorRef = useRef<Editor | null>(null) // 명시적으로 Editor 타입을 설정
  const [content, setContent] = useState<string>('') // 상태를 관리

  const handleBold = () => {
    if (editorRef.current) {
      editorRef.current.getInstance().exec('bold')
    }
  }

  const handleSave = () => {
    if (editorRef.current) {
      const editorContent = editorRef.current.getInstance().getMarkdown()
      setContent(editorContent) // 에디터 내용을 상태에 저장
    }
  }

  return (
    <>
      <Editor
        previewStyle="vertical"
        height="400px"
        initialEditType="markdown"
        initialValue="hello"
        ref={editorRef}
      />
      <div id="toastUIEditor">
        <h1>Toast UI Editor Example</h1>
        <div id="button">
          <button className="btn_save" onClick={handleSave}>
            Save
          </button>
        </div>
        <div>
          <h2>Result</h2>
          <textarea className="result" value={content} readOnly></textarea>
        </div>
      </div>
    </>
  )
}

export default TuiEditor
