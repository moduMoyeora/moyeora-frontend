// 신청이 수락된 사용자에게 보낼 페이지 (모임 날짜, 장소와 시간이 기입 되어 있음)
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
} from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import 'dayjs/locale/ko'
import { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { Controller, useForm } from 'react-hook-form'
import { createClient } from '../api/http'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { eventData } from './CheckEvent'

interface FormInputs {
  location: string
  date: Dayjs | null
  time: Dayjs | null
}

interface SubmitDataType {
  location: string;
  time: string;
}

function Events() {
  const [isEdit, setIsEdit] = useState(false)
  const [initialData, setInitialData] = useState<eventData | null>(null)
  const { boardId, id, eventId } = useParams<{
    boardId: string
    id: string
    eventId: string
  }>()
  const client = createClient()
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      location: initialData?.location || '',
      date: initialData?.time ? dayjs(initialData.time) : null,
      time: initialData?.time ? dayjs(initialData.time) : null,
    },
  })

  // URL에서 이벤트 ID를 확인하여 수정 모드인지 판단
  useEffect(() => {
    const fetchEventData = async () => {
      if (eventId) {
        // URL에 id가 있으면 수정 모드
        try {
          const response = await client.get(
            `/boards/${boardId}/posts/${id}/events/${eventId}`
          )
          setInitialData(response.data)
          setIsEdit(true)

          // 폼 초기화
          reset({
            location: response.data.location,
            date: dayjs(response.data.time),
            time: dayjs(response.data.time),
          })
        } catch (error) {
          console.error('Error:', error)
          alert('모임 일정을 불러오는데 실패했습니다.')
          navigate(`/boards/${boardId}/posts/${id}`) // 오류 시 게시글 페이지로 이동
        }
      }
    }

    fetchEventData()
  }, [id, boardId, eventId, reset])

  const onSubmit = async (data: FormInputs) => {
    try {
      const combinedDateTime= data.date
        ?.hour(data.time?.hour() || 0)
        ?.minute(data.time?.minute() || 0)
        ?.second(0)
        ?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      // 백엔드로 보낼 데이터 형식
      const submitData: SubmitDataType = {
        location: data.location,
        time: combinedDateTime || ' '
      }
      if (isEdit) {
        // 수정 요청
        await client.put(
          `/boards/${boardId}/posts/${id}/events/${eventId}`,
          submitData
        )
        alert('모임 일정이 수정되었습니다!')
      } else {
        // 등록 요청
        console.log(submitData);
        await client.post(`/boards/${boardId}/posts/${id}/events`, submitData)
        alert('모임 일정이 등록되었습니다!')
      }
      navigate(`/boards/${boardId}/posts/${id}`) // 모임 일정 수정 또는 등록 완료 후 게시글 상세 페이지로 이동
    } catch (error) {
      alert(isEdit ? '모임 일정 수정 실패!' : '모임 일정 등록 실패!')
      console.error('Error:', error)
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '30vh',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '20px',
        margin: '15vh auto',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        🌟 모임 일정을 입력해주세요
      </Typography>
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ my: 4 }}>
            <Controller
              name="location"
              control={control}
              rules={{ required: '장소를 입력해주세요' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="장소"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DemoContainer
                components={['DatePicker']}
                sx={{
                  width: '100%',
                  '& .MuiTextField-root': { width: '100%' },
                }}
              >
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: '날짜를 선택해주세요' }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      disablePast
                      label="날짜"
                      format="YYYY-MM-DD"
                      slotProps={{
                        textField: {
                          error: !!errors.date,
                          helperText: errors.date?.message,
                        },
                        day: {
                          sx: {
                            '&.MuiPickersDay-root.Mui-selected': {
                              backgroundColor: '#191919', // 원하는 색상
                              '&:hover': {
                                backgroundColor: '#BDBDBD', // hover 시에도 같은 색상 유지
                              },
                              '&:focus': {
                                backgroundColor: '#191919', // focus 시에도 같은 색상 유지
                              },
                            },
                          },
                        },
                        popper: {
                          sx: {
                            '& .MuiPaper-root': {
                              borderRadius: '30px',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <Controller
                name="time"
                control={control}
                rules={{ required: '시간을 선택해주세요' }}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    label="시간"
                    slotProps={{
                      textField: {
                        error: !!errors.time,
                        helperText: errors.time?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2, backgroundColor: 'black' }}
          >
            {isEdit ? '수정하기' : '작성하기'}
          </Button>
        </form>
      </Box>
    </Container>
  )
}

export default Events
