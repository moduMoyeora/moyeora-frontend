import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { httpClient } from '../api/http'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'

interface Board {
  id: number
  name: string
}

interface Post {
  id: number
  title: string
  nickname: string
  created_at: string
}

const PostList: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>() // boardId를 useParams로 가져옴
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [boardTitle, setBoardTitle] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // 게시판 제목 가져오기
  useEffect(() => {
    const fetchBoardTitle = async () => {
      try {
        setIsLoading(true)
        const response = await httpClient.get(`/boards`)
        const boards = response.data

        // boardId에 해당하는 제목 찾기
        const board = boards.find((b: Board) => b.id === Number(boardId))
        if (board) {
          setBoardTitle(board.name) // 제목을 name으로 설정
        } else {
          setError('해당 게시판을 찾을 수 없습니다.')
        }
      } catch (err) {
        setError('게시판 제목을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBoardTitle()
  }, [boardId])

  useEffect(() => {
    fetchPosts()
  }, [currentPage, boardId])

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await httpClient.get(`/boards/${boardId}/posts`, {
        params: { limit: 3, page: currentPage },
      })
      const postsData = response.data.data.posts || []
      const pagination = response.data.data.pagination || {}

      setPosts(postsData)
      setTotalPages(pagination.totalPages || 0)
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Refresh 토큰 요청 또는 로그아웃 처리
        console.log('토큰 만료: 재인증이 필요합니다.')
        // Refresh Token 로직 추가
      } else {
        console.error(err)
        setError('게시글을 불러오는데 실패했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page)
  }

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    )

  if (error)
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )

  return (
    <Box maxWidth="1200px" mx="auto" mt={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">{boardTitle || '게시판'}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/boards/${boardId}/posts`)}
          sx={{ height: '40px' }} // 버튼 높이 조절
        >
          글작성
        </Button>
      </Box>
      <Paper
        sx={{
          padding: 2,
          minHeight: '50vh',
          minWidth: '50vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* 게시글 리스트 */}
        <Box p={2}>
          <Grid container spacing={3} sx={{ fontWeight: 'bold' }}>
            <Grid
              item
              xs={6}
              sx={{
                padding: '10px',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              제목
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                padding: '10px',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              작성자
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                padding: '10px',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              작성일
            </Grid>
          </Grid>
          <Box mt={2}>
            {posts.length === 0 ? (
              <Typography align="center" color="textSecondary" sx={{ mt: 2 }}>
                게시글이 없습니다. 게시글을 작성해 보세요!
              </Typography>
            ) : (
              posts.map((post) => (
                <Link
                  to={`/boards/${boardId}/posts/${post.id}`}
                  key={post.id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Grid
                    container
                    spacing={3}
                    sx={{
                      py: 1,
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    <Grid item xs={6}>
                      <Typography noWrap>{post.title}</Typography>
                    </Grid>
                    <Grid item xs={3} textAlign="center">
                      {post.nickname}
                    </Grid>
                    <Grid item xs={3} textAlign="center">
                      {new Date(post.created_at).toLocaleDateString()}
                    </Grid>
                  </Grid>
                </Link>
              ))
            )}
          </Box>
        </Box>
      </Paper>
      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  )
}

export default PostList
