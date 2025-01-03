import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
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

  const location = useLocation() // useLocation 훅을 사용해 location 가져오기

  // 페이지네이션 상태를 URL 쿼리 파라미터로 관리
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const page = queryParams.get('page')
      ? parseInt(queryParams.get('page')!, 10)
      : 1
    setCurrentPage(page)
  }, [location])

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

  // 페이지 변경 처리
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page)
    navigate(`${location.pathname}?page=${page}`)
  }

  useEffect(() => {
    fetchPosts()
  }, [currentPage, boardId])

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('요청 파라미터:', { limit: 5, page: currentPage })

      const response = await httpClient.get(`/boards/${boardId}/posts`, {
        params: { limit: 5, page: currentPage },
      })

      console.log('API 응답:', response.data)

      // API 응답 구조에 맞게 데이터 처리
      const postsData = response.data?.data?.posts || [] // 게시글 데이터
      const pagination = response.data?.data?.pagination || {} // 페이지네이션 정보

      setPosts(postsData)

      // API에서 제공한 totalPages를 사용
      const calculatedTotalPages = pagination.totalPages || 1 // 기본값 1
      setTotalPages(calculatedTotalPages)
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log('토큰 만료: 재인증이 필요합니다.')
      } else {
        console.error('게시글 요청 실패:', err)
        setError('게시글을 불러오는데 실패했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 게시글을 페이지에 맞게 잘라서 보여줌 (한 페이지에 10개 게시글)
  const postsPerPage = 10
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

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
        <Box p={2}>
          <Grid container spacing={3} sx={{ fontWeight: 'bold' }}>
            <Grid item xs={6} sx={{ padding: '10px', textAlign: 'center' }}>
              제목
            </Grid>
            <Grid item xs={3} sx={{ padding: '10px', textAlign: 'center' }}>
              작성자
            </Grid>
            <Grid item xs={3} sx={{ padding: '10px', textAlign: 'center' }}>
              작성일
            </Grid>
          </Grid>

          <Box mt={2}>
            {currentPosts.length === 0 ? (
              <Typography align="center" color="textSecondary" sx={{ mt: 2 }}>
                게시글이 없습니다. 게시글을 작성해 보세요!
              </Typography>
            ) : (
              currentPosts.map((post) => (
                <Link
                  to={`/boards/${boardId}/posts/${post.id}`}
                  key={post.id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Paper
                    sx={{ py: 1, '&:hover': { backgroundColor: '#f5f5f5' } }}
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
            count={totalPages} // API에서 가져온 총 페이지 수
            page={currentPage} // 현재 페이지
            onChange={handlePageChange} // 페이지 변경 이벤트
            color="primary"
            disabled={isLoading} // 로딩 중에는 비활성화
          />
        </Box>
      )}
    </Box>
  )
}

export default PostList
