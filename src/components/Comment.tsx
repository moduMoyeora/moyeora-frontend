import React, { useState } from 'react'
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
const CommentSection = styled(Paper)(({ theme }) => ({
  padding: '2rem',
  marginBottom: '2rem',
  backgroundColor: '#f8f9fa',
}))
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: '2rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}))
export default function Comment() {
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([
    {
      id: 1,
      user: '서희',
      text: '테스ㅡ트트',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      user: '혜원',
      text: '꺄ㅐ릉',
      timestamp: '1 hour ago',
    },
  ])

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: 'Guest User',
        text: newComment.trim(),
        timestamp: 'Just now',
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }
  return (
    <Container>
      <CommentSection>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FaRegComment style={{ marginRight: '8px', fontSize: '1.5rem' }} />
          <Typography variant="h5" component="h2">
            Comments
          </Typography>
        </Box>

        <List>
          {comments.map((comment) => (
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
                        {comment.user}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {comment.timestamp}
                      </Typography>
                    </Box>
                  }
                  secondary={comment.text}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ mt: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Write your comment here..."
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
            Submit Comment
          </Button>
        </Box>
      </CommentSection>
    </Container>
  )
}
