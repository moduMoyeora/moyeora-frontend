// Editor.tsx
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/react-editor'
import React, { forwardRef, useEffect } from 'react'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import fontSize from "tui-editor-plugin-font-size";
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";
import { Box } from '@mui/material'

interface TuiEditorProps {
  onChange?: (value: string) => void;
  value?: string;
}

const colorSyntaxOptions = {
  preset: [
    '#333333', '#666666', '#FFFFFF', '#EE2323',
    '#F89009', '#009A87', '#006DD7', '#8A3DB6',
    '#781B33', '#5733B1', '#953B34', '#FFC1C8',
    '#FFC9AF', '#9FEEC3', '#99CEFA', '#C1BEF9',
  ],
}

const TuiEditor = forwardRef<Editor, TuiEditorProps>((props, ref) => {
  const { onChange } = props;

  useEffect(() => {
    if ((ref as any)?.current) {
      const instance = (ref as any).current.getInstance();
      instance.on('change', () => {
        if (onChange) {
          onChange(instance.getHTML());
        }
      });
    }
  }, [onChange, ref]); 

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box width="75%">
        <Editor
          ref={ref}
          height="500px"
          placeholder="Please Enter Text."
          previewStyle="tab"
          initialEditType="wysiwyg"
          toolbarItems={[
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task', 'indent', 'outdent'],
            ['table', 'image', 'link'],
            ['code', 'codeblock'],
          ]}
          initialValue={props.value || " "}  // Add value prop support
          usageStatistics={false}
          plugins={[[colorSyntax, colorSyntaxOptions],fontSize]}
        />
      </Box>
    </Box>
  )
});

export default TuiEditor;