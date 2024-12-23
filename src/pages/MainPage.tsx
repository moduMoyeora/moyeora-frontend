import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography, Pagination } from '@mui/material'
import { Link } from 'react-router-dom'
import { httpClient } from '../api/http' // 경로를 맞춰서 가져옵니다.

interface BoardItem {
  id: number
  name: string
}

interface Post {
  id: number
  title: string
}

const MainPage: React.FC = () => {
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]) // 게시판 목록 상태
  const [postsForBoards, setPostsForBoards] = useState<Record<number, Post[]>>(
    {}
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 4

  useEffect(() => {
    const fetchBoards = async () => {
      setIsLoading(true)
      try {
        const response = await httpClient.get('/boards', {
          params: { limit: itemsPerPage, currentPage },
        })
        console.log('Fetched Boards:', response.data) // 응답 데이터 확인
        setBoardItems(response.data || [])
      } catch (err) {
        console.error('게시판 목록 조회 실패:', err)
        setError('게시판 목록을 가져오는 데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBoards()
  }, [currentPage])

  useEffect(() => {
    const fetchPosts = async () => {
      const postsByBoard: Record<number, Post[]> = {}
      try {
        const promises = boardItems.map(async (board) => {
          const response = await httpClient.get(`/boards/${board.id}/posts`, {
            params: { limit: 3 },
          })
          console.log(`Fetched Posts for board ${board.id}:`, response.data) // 각 게시판의 게시물 확인

          const posts = response.data?.data?.posts || []
          postsByBoard[board.id] = posts
        })
        await Promise.all(promises)

        // 상태 업데이트
        setPostsForBoards(postsByBoard)
        console.log(`게시판 미리 보기 데이터: `, postsForBoards)
      } catch (err) {
        console.error('게시물 조회 실패:', err)
        setError('게시물을 가져오는 데 실패했습니다.')
      }
    }

    // boardItems에 데이터가 있을 때만 fetchPosts를 호출하도록 수정
    if (boardItems.length > 0) {
      fetchPosts()
    }
  }, [boardItems])

  if (isLoading) {
    return <Typography>로딩 중...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentBoardItems = boardItems.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 2,
        paddingTop: { xs: 8, sm: 10 }, // 상단 여백 추가 (반응형)
      }}
    >
      {' '}
      <Grid container spacing={2}>
        {currentBoardItems.map((item) => (
          <Grid item xs={12} sm={6} key={item.id}>
            <Paper
              sx={{
                padding: 2,
                minHeight: '200px', // 게시판 크기 설정 (최소 높이)
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden', // 내용 넘침 방지
              }}
            >
              <Typography variant="h6" sx={{ display: 'inline-block' }}>
                <Link
                  to={`/boards/${item.id}`}
                  style={{
                    textDecoration: 'none',
                    color: '#000000',
                    cursor: 'pointer',
                  }}
                >
                  {item.name}
                </Link>
              </Typography>

              {/* 게시글 미리 보기 */}
              <Box sx={{ marginTop: 1 }}>
                {postsForBoards[item.id] &&
                postsForBoards[item.id].length > 0 ? (
                  postsForBoards[item.id].map((post) => (
                    <Link
                      to={`/boards/${item.id}/posts/${post.id}`}
                      key={post.id}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      <Grid
                        container
                        spacing={3}
                        sx={{
                          py: 1,
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          borderBottom: '1px solid #ddd',
                          width: '100%',
                        }}
                      >
                        <Grid item xs={12}>
                          <Typography variant="body2" noWrap>
                            {post.title}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Link>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    아직 게시글이 없습니다.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(boardItems.length / itemsPerPage)}
          page={currentPage}
          onChange={(event, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>
    </Box>
  )
}

export default MainPage
