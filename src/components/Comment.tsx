import './Comment.css'
import { useAuthStore } from '../store/authStore'

import {
  getCommentById,
  postCommentById,
  putCommentById,
  deleteCommentById,
  getCommentsByPostId,
} from '../api/comment.api'
import React, { useEffect, useState } from 'react'
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
const CommentSection = styled(Paper)(({ theme }) => ({
  padding: '2rem',
  marginBottom: '2rem',
  width: '100%',
  backgroundColor: '#fafafa',
}))
interface CommentProps {
  boardId: string
  postId: string
}
interface Comment {
  author: string
  content: string
  createdAt: string
  id: string | number
}

export default function Comment(props: CommentProps) {
  const boardId = props.boardId
  const postId = props.postId
  const { user_id } = useAuthStore()
  const [newComment, setNewComment] = useState('')
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
    if (postId) {
      getComments(boardId, postId)
    }
  }, [])
  const [page, setPage] = useState(1)
  const commentsPerPage = 2
  const totalPages = Math.ceil(comments.length / commentsPerPage)
  const startIndex = (page - 1) * commentsPerPage
  const endIndex = startIndex + commentsPerPage
  const currentComments = comments.slice(startIndex, endIndex)
  let totalCount = 0
  let currentPage = 0
  let totlaPages = 0
  let limit = 0
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value)
  }

  const getComments = async (boardId: string, postId: string) => {
    try {
      const commentsResponse = await getCommentsByPostId(boardId, postId)
      if (commentsResponse.status === 200) {
        console.log('Comments fetched:')
        setComments(commentsResponse.data.data.comments)
      } else {
        console.log('Error fetching comments:', commentsResponse.status)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
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
          <FaRegComment style={{ marginRight: '8px', fontSize: '1.5rem' }} />
          <Typography variant="h5" component="h2">
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
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
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
            count={totalPages}
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
