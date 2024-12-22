import './Comment.css'
import { useAuthStore } from '../store/authStore'

import {
  getCommentById,
  postCommentById,
  editCommentById,
  deleteCommentById,
  getCommentsByPostId,
} from '../api/comment.api'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Pagination,
  Avatar,
  Divider,
  Box,
  Paper,
} from '@mui/material'
import { styled } from '@mui/system'
import { FaRegComment, FaRegClock, FaUser } from 'react-icons/fa'
import { get } from 'http'
import { updateUser } from '../api/auth.api'
import { set } from 'react-hook-form'
const CommentSection = styled(Paper)(({ theme }) => ({
  padding: '2rem',
  marginTop: 'auto', // Push comments to bottom
  width: '100%',
  backgroundColor: '#fafafa',
}))
export interface CommentProps {
  boardId: string
  postId: string
}
interface Comment {
  id: string | number
  nickname: string
  content: string
  createdAt: string
  updateAt: string
  email: string
}

export default function Comment() {
  const params = useParams<{ id: string; boardId: string }>()
  const postId = params.id
  const boardId = params.boardId
  console.log(postId, boardId)

  const { user_id } = useAuthStore()
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [comments, setComments] = useState([
    {
      id: '',
      nickname: '',
      content: '',
      createdAt: '',
      updateAt: '',
      email: '',
    },
  ])

  useEffect(() => {
    const getComments = async () => {
      try {
        setLoading(true)
        if (boardId === undefined || postId === undefined) {
          return new Error('게시판 ID와 게시글 ID가 필요합니다.')
        }
        const commentsResponse = await getCommentsByPostId(boardId, postId)
        if (commentsResponse.status === 200) {
          const getComments = commentsResponse.data.data.comments
          setComments(getComments)
        } else {
          console.log('Error fetching comments:', commentsResponse.status)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }
    getComments()
  }, [boardId, postId]) // 페이지 변경 시 데이터 로드
  const commentsPerPage = 5
  const pages = Math.ceil(comments.length / commentsPerPage)
  const startIndex = (page - 1) * commentsPerPage
  const endIndex = startIndex + commentsPerPage
  const currentComments = comments.slice(startIndex, endIndex)

  if (!boardId || !postId) {
    return <Typography>게시판 ID와 게시글 ID가 필요합니다.</Typography>
  }
  if (loading) {
    return <Typography>Loading comments...</Typography> // 로딩 중일 때 표시할 내용
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value)
  }
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1, //commentId,
        nickname: 'Guest User', //userName
        content: newComment.trim(),
        createdAt: '2024-01-02',
        updateAt: Date.now(),
        email: '',
      }
      // setComments([...comments, comment])
      setNewComment('')
    }
  }

  return (
    <Container
      sx={{
        mt: 3,
        display: 'flex',
        p: 0,
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <CommentSection sx={{ width: '100%', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaRegComment style={{ marginRight: '5px', fontSize: '1.5rem' }} />
          <Typography variant="h6" component="h2">
            댓글
          </Typography>
        </Box>

        <List>
          {currentComments.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <FaUser />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography
                        component="span"
                        variant="subtitle1"
                        color="text.primary"
                      >
                        {comment.nickname}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {comment.createdAt}
                      </Typography>
                    </Box>
                  }
                  secondary={comment.content}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
          <Pagination
            count={pages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="댓글을 남기세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!newComment.trim()}
            onClick={handleCommentSubmit}
            startIcon={<FaRegComment />}
          >
            댓글 남기기
          </Button>
        </Box>
      </CommentSection>
    </Container>
  )
}
