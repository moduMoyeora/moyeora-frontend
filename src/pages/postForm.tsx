import React, { useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, TextField, Button } from '@mui/material'
import TuiEditor from '../components/Editor'
import { Editor } from '@toast-ui/react-editor'
import { Inputs } from './createPost'

interface PostFormProps {
  initialData?: Inputs
  onSubmit: (data: Inputs) => void
  submitButtonText: string
}

function PostForm({ initialData, onSubmit, submitButtonText }: PostFormProps) {
  const editorRef = useRef<Editor>(null)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: initialData || { title: '', content: '' },
  })

  const handleFormSubmit = (data: Inputs) => {
    const editorContent = editorRef.current?.getInstance().getHTML() || ''
    onSubmit({ ...data, content: editorContent })
  }

  return (
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight:'100vh',
          marginTop:'30px'
        }}
      >
        <Box sx={{ width: '75%' }}>
          <TextField
            {...register('title', {
              required: '제목을 작성해주세요',
            })}
            placeholder="제목"
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              marginBottom: 2,
            }}
          />
        </Box>
        <Controller
          name="content"
          control={control}
          rules={{ required: '내용을 입력해주세요' }}
          render={({ field }) => (
            <TuiEditor
              ref={editorRef}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: '120px',
              height: '40px',
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#4C4C4C',
              },
            }}
          >
            {submitButtonText}
          </Button>
        </Box>
      </Box>
  )
}

export default PostForm
