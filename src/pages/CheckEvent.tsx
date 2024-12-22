import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createClient } from '../api/http'
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { PiDotsThreeCircleVerticalThin } from 'react-icons/pi'

export interface eventData {
  location: string
  time: string
}

function CheckEvent() {
  const [eventData, setEventData] = useState<eventData | null>(null)
  const { id, boardId, eventId } = useParams<{
    id: string
    boardId: string
    eventId: string
  }>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null) //드롭다운 메뉴의 위치와 표시 여부를 제어
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const client = createClient()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleEdit = () => {
    // 이벤트 편집
    handleClose()
    navigate(`/boards/${boardId}/posts/${id}/events/${eventId}/edit`)
  }
  const handleDelete = async () => {
    // 이벤트 삭제
    try {
      await client.delete(`/boards/${boardId}/posts/${id}/events/${eventId}`)
      alert('모임 일정이 삭제되었습니다.')
      navigate('/')
    } catch (error) {
      console.error('Error:', error)
      alert('모임 일정 삭제에 실패했습니다.')
    }
    handleClose() // 메뉴 닫기
  }

  // useEffect(() => {
  //   const fetchEventData = async () => {
  //     try {
  //       const response = await client.get(
  //         `/boards/${boardId}/posts/${id}/events/${eventId}`
  //       )
  //       console.log(response.data)
  //       setEventData(response.data)
  //     } catch (error) {
  //       alert('모임 일정을 불러오는데 실패했습니다.')
  //       console.error('Error:', error)
  //     }
  //   }

  //   fetchEventData()
  // }, [id, boardId,eventId])

  // eventData가 없을 때 로딩 표시
  // if (!eventData) {
  //   return <div>Loading...</div>
  // }
  // // eventData가 있을 때만 구조분해할당
  // const { location, time } = eventData

  return (
    <Box mt={2} sx={{display:'flex'}}>
      <Box>
        <Typography component="div">장소: </Typography>
        <Typography component="div">시간: </Typography>
      </Box>
      <Box>
        {/* 메뉴를 열기 위한 아이콘 버튼 */}
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <PiDotsThreeCircleVerticalThin size={24} color="text.secondary" />
        </IconButton>
        {/* 드롭다운 메뉴 컴포넌트 */}
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleEdit}>수정하기</MenuItem>
          <MenuItem onClick={handleDelete}>삭제하기</MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}
export default CheckEvent
