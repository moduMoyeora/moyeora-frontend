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

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchPosts()
  }, [currentPage, boardId])

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await httpClient.get(`/boards/${boardId}/posts`, {
        params: { limit: 10, page: currentPage },
      })

      const postsData = response.data.data?.posts || []
      const pagination = response.data.data?.pagination || {}

      // 총 페이지 수 및 게시글 설정
      setPosts(postsData)

      // 게시글이 없으면 totalPages를 1로 설정
      const totalPosts = pagination.totalCount || 0
      const calculatedTotalPages =
        totalPosts === 0 ? 1 : Math.ceil(totalPosts / 10)

      setTotalPages(calculatedTotalPages)
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log('토큰 만료: 재인증이 필요합니다.')
      } else {
        console.error(err)
        setError('게시글을 불러오는데 실패했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
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
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }} mt={4}>
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
          sx={{ height: '40px' }}
        >
          글작성
        </Button>
      </Box>
      <Paper sx={{ padding: 2 }}>
        {/* 게시글 리스트 */}
        <Box p={2}>
          <Grid container spacing={3} sx={{ fontWeight: 'bold' }}>
            <Grid
              item
              xs={6}
              sx={{
                padding: '10px',
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
                  <Paper
                    sx={{
                      py: 1, // 여기에 padding을 추가해서 hover 효과가 글자 뿐 아니라 박스 전체로 확장되도록
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      // borderBottom: '1px solid #ddd',
                    }}
                  >
                    <Grid container spacing={3}>
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
                  </Paper>
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
