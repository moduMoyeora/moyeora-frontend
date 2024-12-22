import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createClient } from '../api/http'
import Comment from '../components/Comment'
import parse from 'html-react-parser' //HTML 문자열을 React 에서 렌더링하기
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import { styled } from '@mui/system'
import { PiDotsThreeCircleVerticalThin } from 'react-icons/pi'
import { useAuthStore } from '../store/authStore'

interface PostData {
  data: {
    board_name: string
    title: string
    author: string
    content: string
    created_at: string
    member_id: string
  }
}

const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: '800px', // 또는 원하는 최대 너비
  margin: '0 auto', // 가운데 정렬
  padding: theme.spacing(3),
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}))

const AuthorTimeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // 변경
  marginTop: theme.spacing(1),
}))

const Post: React.FC = () => {
  const { id, boardId } = useParams<{ id: string; boardId: string }>()
  const [postData, setPostData] = useState<PostData | null>(null)
  const [error, setError] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null) //드롭다운 메뉴의 위치와 표시 여부를 제어
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const client = createClient()
  const currentUserId = useAuthStore((state) => state.user_id) //현재 로그인한 사용자 ID

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleEdit = () => {
    // 게시글 편집
    handleClose()
    navigate(`/boards/${boardId}/posts/${id}/edit`)
  }
  const handleDelete = async () => {
    try {
      await client.delete(`/boards/${boardId}/posts/${id}`)
      alert('게시글이 삭제되었습니다.')
      navigate('/')
    } catch (error) {
      console.error('Error:', error)
      alert('게시글 삭제에 실패했습니다.')
    }
    handleClose() // 메뉴 닫기
  }

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await client.get(`/boards/${boardId}/posts/${id}`)
        console.log(response.data)
        setPostData(response.data)
      } catch (error) {
        setError('게시물을 불러오는데 실패했습니다.')
        console.error('Error:', error)
      }
    }

    fetchPostData()
  }, [id, boardId])

  // 데이터 가져오는 중
  if (!postData && !error) {
    return <div>Loading...</div>
  }

  // 에러 발생 시 에러 메시지 표시
  if (error) {
    return <div>{error}</div>
  }

  // 서버에서 데이터 가져와서 게시물 보여줌
  const { data } = postData!
  const { board_name, title, author, content, created_at, member_id } = data
  const formattedCreatedAt = created_at || '작성 시간 정보가 없습니다.' // default 값 설정 해둠
  const formatDate = (dateString: string) => {
    //created_at 시간 형식 변경 함수
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
  const date = formatDate(formattedCreatedAt)
  const isAuthor = currentUserId === member_id // 현재 로그인한 사용자와 글의 작성자가 같은지 확인

  return (
    <ContentContainer sx={{ marginTop: '60px' }}>
      <HeaderBox>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ marginBottom: 2 }}
        >
          {board_name}
        </Typography>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          {title}
        </Typography>
        <AuthorTimeBox>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {author}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {date}
            </Typography>
          </Box>
          {isAuthor && (
            <Box>
              {/* 메뉴를 열기 위한 아이콘 버튼 */}
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <PiDotsThreeCircleVerticalThin
                  size={24}
                  color="text.secondary"
                />
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
          )}
        </AuthorTimeBox>
      </HeaderBox>

      <Divider />

      <Box mt={2}>
        <Typography component="div" className="result">
          {parse(content)}
        </Typography>
      </Box>
      <Comment />
    </ContentContainer>
  )
}

export default Post
