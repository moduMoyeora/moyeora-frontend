import { Editor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'

const EditorCommon = () => {
  return (
    <Editor
      previewStyle="vertical"
      initialEditType="wysiwyg"
      placeholder="글을 작성해 주세요"
      height="450px"
      toolbarItems={[
        ['bold', 'italic', 'strike'],
        ['hr'],
        ['image', 'link'],
        ['ul', 'ol'],
        ['code', 'codeblock'],
      ]}
    />
  )
}

export default EditorCommon
