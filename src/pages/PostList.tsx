import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { httpClient } from '../api/http' // 경로를 맞춰서 가져옵니다.
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
  author: string
  createdAt: string
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
      if (response.status === 204 || !response.data.data.posts) {

        setPosts([]) // 데이터가 없을 경우 빈 배열 설정
        setTotalPages(0)
      } else {
        setPosts(response.data.posts || [])
        setTotalPages(Math.ceil((response.data.total || 0) / 10))
      }
    } catch (err) {
      console.error(err)
      setError('게시글을 불러오는데 실패했습니다.')
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
      <Typography variant="h4" gutterBottom textAlign="center">
        {boardTitle || '게시판'} {/* 제목 렌더링 */}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/boards/${boardId}/posts`)}
      >
        글작성
      </Button>
      <Paper
        sx={{
          padding: 2,
          minHeight: '50vh', // 게시글 목록 크기 설정 (최소 높이)
          minWidth: '50vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {' '}
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
          {/* 게시글 렌더링 */}
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
                      {post.author}
                    </Grid>
                    <Grid item xs={3} textAlign="center">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Grid>
                  </Grid>
                </Link>
              ))
            )}
          </Box>
        </Box>
      </Paper>
      {/* 페이지 네이션 */}
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
