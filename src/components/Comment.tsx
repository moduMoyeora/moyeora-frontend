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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
import { FaRegComment, FaUser, FaPen, FaTrash } from 'react-icons/fa'
import { set } from 'react-hook-form'
import { createClient } from '../api/http'

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
  member_id: string
  id: string | number
  nickname: string
  content: string
  createdAt: string
  updateAt: string
}
interface CommentData {
  commentId: string | number
  content: string
}
interface props {
  postWriter: string
}

export default function Comment({ postWriter }: props) {
  const params = useParams<{ id: string; boardId: string }>()
  const postId = params.id
  const boardId = params.boardId
  const { user_id } = useAuthStore()
  const [newComment, setNewComment] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingComment, setEditingComment] = useState({
    commentId: '',
    content: '',
  })
  const [comments, setComments] = useState([] as Comment[])
  const getComments = async () => {
    try {
      setLoading(true)
      if (boardId === undefined || postId === undefined) {
        return new Error('게시판 ID와 게시글 ID가 필요합니다.')
      }

      const commentsResponse = await getCommentsByPostId(boardId, postId)
      if (commentsResponse.status === 204) {
        console.log('댓글이 없습니다.')
        setComments([])
      } else if (commentsResponse.status === 200) {
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
  useEffect(() => {
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
  const handleMakeNewComment = async () => {
    const response = await postCommentById(boardId, postId, newComment)
    if (response) {
      if (response.status === 200 || response.status === 201) {
        console.log('댓글 추가 완료')
        setNewComment('')
        getComments()
      } else {
        console.log('Error posting comment:', response)
      }
    } else {
      console.log('Error posting comment:', response)
    }
  }
  const handleEditDialog = async (id: string | number, content: string) => {
    id.toString()
    setEditingComment({ commentId: id.toString(), content: content })
    setDialogOpen(true)
  }
  const handleDeleteComment = async (commentId: string | number) => {
    commentId = commentId.toString()
    const response = await deleteCommentById(boardId, postId, commentId)
    if (response) {
      if (response.status === 204 || response.status === 200) {
        console.log('댓글 삭제 완료')
        getComments()
      } else {
        console.log('Error deleting comment:', response)
      }
    } else {
      console.log('Error deleting comment:', response)
    }
  }
  const handleClose = () => {
    setDialogOpen(false)
  }
  const handleEditComment = async (content: string) => {
    const response = await editCommentById(
      boardId,
      postId,
      editingComment.commentId,
      content
    )
    if (response) {
      if (response.status === 200 || response.status === 201) {
        console.log('댓글 수정 완료')
        getComments()
      } else {
        console.log('Error editing comment:', response)
      }
    } else {
      console.log('Error editing comment:', response)
    }
  }

  const client = createClient()
  const sendEmail = async (comment_id: number) => {
    try {
      const response = await client.post(
        `/boards/${boardId}/posts/${postId}/email`,
        { commentId: comment_id }
      )
      if (response.status === 200) {
        alert('이메일 전송 완료')
      }
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
  return (
    <Container
      sx={{
        mt: 3,
        p: 0,
        display: 'flex',
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
          {currentComments.length > 0 ? (
            currentComments.map((comment) => (
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
                  {user_id === comment.member_id ? (
                    <div>
                      <Button
                        onClick={() =>
                          handleEditDialog(comment.id, comment.content)
                        }
                      >
                        <FaPen
                          style={{ color: 'black', fontSize: '15px' }}
                        ></FaPen>
                      </Button>{' '}
                      <Button onClick={() => handleDeleteComment(comment.id)}>
                        <FaTrash
                          style={{ color: 'black', fontSize: '15px' }}
                        ></FaTrash>
                      </Button>
                    </div>
                  ) : null}
                  {user_id === postWriter && (
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      onClick={() => sendEmail(Number(comment.id))}
                      sx={{
                        backgroundColor: 'black',
                        '&:hover': {
                          backgroundColor: '#8C8C8C',
                        },
                      }}
                    >
                      수락
                    </Button>
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))
          ) : (
            <Typography>댓글이 없습니다.</Typography>
          )}
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
            onClick={handleMakeNewComment}
            startIcon={<FaRegComment />}
          >
            댓글 남기기
          </Button>
        </Box>
      </CommentSection>
      <div>
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          maxWidth="md"
          PaperProps={{
            component: 'form',
            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault()

              const formData = new FormData(event.currentTarget)
              const formJson = Object.fromEntries((formData as any).entries())
              const content = formJson.content
              console.log('댓글 수정 완료', content)
              handleEditComment(content)
              handleClose()
            },
          }}
        >
          <DialogTitle>댓글 수정</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              fullWidth
              id="content"
              name="content"
              label="댓글"
              value={editingComment.content}
              type="content"
              variant="standard"
              onChange={(e) =>
                setEditingComment({
                  ...editingComment,
                  content: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">제출</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  )
}
