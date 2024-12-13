import { Controller, useForm } from 'react-hook-form'
import TuiEditor from '../components/Editor'
import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import { useRef, useState, useEffect } from 'react'
import { Editor } from '@toast-ui/react-editor'

interface Inputs {
  title: string
  content: string
}

function Writing() {
  // 편집 모드 상태와 저장된 데이터 상태 추가
  const [isEditing, setIsEditing] = useState(true)
  const [savedData, setSavedData] = useState<Inputs>({
    title: '',
    content: '',
  })

  const editorRef = useRef<Editor>(null)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: '',
      content: '',
    },
  })

  // 수정 모드로 돌아갈 때 데이터 복원
  useEffect(() => {
    if (isEditing && savedData.title) {
      reset(savedData)
      editorRef.current?.getInstance().setHTML(savedData.content)
    }
  }, [isEditing, savedData, reset])

  const onSubmit = async (data: Inputs) => {
    const editorContent = editorRef.current?.getInstance().getHTML() || ''
    const submitData = {
      ...data,
      content: editorContent,
    }
    setSavedData(submitData)
    setIsEditing(false)
    console.log('Form Data:', submitData)
  }

  return (
    <>
      {isEditing ? (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
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
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              작성하기
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            width: '75%',
            margin: '0 auto',
            padding: '40px 10px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            {savedData.title}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ width: '100%', mb: 3 }}>
            <div
              dangerouslySetInnerHTML={{ __html: savedData.content || '' }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            sx={{
              width: '120px',
              height: '40px',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            수정하기
          </Button>
        </Box>
      )}
    </>
  )
}

export default Writing
