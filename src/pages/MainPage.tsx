import React, { useEffect, useState } from 'react'
import { Button, Typography, Box, Grid, Paper } from '@mui/material'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface BoardItem {
  id: number
  title: string
}

interface Post {
  id: number
  title: string
}

const MainPage: React.FC = () => {
  // 임시 데이터
  // const freeBoardItems: BoardItem[] = [
  //   { id: 1, title: '자유게시판' },
  //   { id: 2, title: '공지사항' },
  //   { id: 3, title: 'Q&A' },
  // ]

  // const freePostsForBoards: Record<number, Post[]> = {
  //   1: [
  //     { id: 1, title: '자유게시판 게시물 1' },
  //     { id: 2, title: '자유게시판 게시물 2' },
  //     { id: 3, title: '자유게시판 게시물 3' },
  //   ],
  //   2: [
  //     { id: 4, title: '공지사항 게시물 1' },
  //     { id: 5, title: '공지사항 게시물 2' },
  //     { id: 6, title: '공지사항 게시물 3' },
  //   ],
  //   3: [
  //     { id: 7, title: 'Q&A 게시물 1' },
  //     { id: 8, title: 'Q&A 게시물 2' },
  //     { id: 9, title: 'Q&A 게시물 3' },
  //   ],
  // }

  const [boardItems, setBoardItems] = useState<BoardItem[]>([]) // 게시판 목록 상태
  const [postsForBoards, setPostsForBoards] = useState<Record<number, Post[]>>(
    {}
  )
  const [isLoading, setIsLoading] = useState<boolean>(false) // 로딩 상태
  const [error, setError] = useState<string | null>(null) // 오류 상태

  useEffect(() => {
    //게시판 목록 가져오기
    const fetchBoards = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get('https://dev-moyeora.glitch.me/boards')
        console.log(response.data) // API 응답 데이터 확인

        setBoardItems(response.data) // 게시판 목록 상태 업데이트
      } catch (err) {
        console.error('API 호출 오류:', err) // 오류 로그 출력

        setError('게시판 목록을 가져오는 데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBoards()
  }, [])
  //   setBoardItems(freeBoardItems)
  //   // 임시 데이터를 사용하여 게시물 목록 설정
  //   setPostsForBoards(freePostsForBoards)
  // }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      const postsByBoard: Record<number, Post[]> = {} // 각 게시판에 대한 게시물 목록을 저장할 객체

      // 각 게시판에 대해 게시물 목록을 가져옵니다.
      for (let board of boardItems) {
        try {
          const response = await axios.get(
            `https://dev-moyeora.glitch.me/boards/${board.id}/posts` // 게시판별 게시물 목록 조회 API
          )
          postsByBoard[board.id] = response.data.slice(0, 3) // 최대 3개 게시물만 가져오기
        } catch (err) {
          console.error(`게시판 ${board.id}의 게시물 조회 실패:`, err)
        }
      }
      setPostsForBoards(postsByBoard) // 상태 업데이트
    }

    if (boardItems.length > 0) {
      fetchPosts() // 게시판 목록이 있을 때 게시물 목록을 조회
    }
  }, [boardItems])

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography>로딩 중...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  // 실제 게시판만 4개까지만 표시
  const limitedBoardItems = boardItems.slice(0, 4)

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 2,
        minHeight: '100vh',
        paddingTop: '200px',
      }}
    >
      <Grid container spacing={2}>
        {limitedBoardItems.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Paper
              sx={{
                padding: 2,
                backgroundColor: 'white',
                height: '100%',
                marginBottom: 2,
                borderRadius: 2, // 둥근 모서리
                boxShadow: 3, // 그림자 효과
                borderBottom: item.id !== -1 ? '2px solid #e5e7eb' : 'none', // 게시판 간 구분선
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                <Link
                  to={`/boards/${item.id}`} // 게시판 제목을 클릭하면 해당 게시판으로 이동
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {item.title}
                </Link>
              </Typography>
              {item.id !== -1 && postsForBoards[item.id] ? (
                <Box sx={{ marginTop: 2 }}>
                  {postsForBoards[item.id].map((post) => (
                    <Box
                      key={post.id}
                      sx={{
                        padding: 1,
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer',
                      }}
                    >
                      <Link
                        to={`/boards/${item.id}/posts/${post.id}`} // 게시물 제목을 클릭하면 해당 게시물 상세 페이지로 이동
                        style={{ textDecoration: 'none' }}
                      >
                        <Typography variant="body2">{post.title}</Typography>
                      </Link>
                    </Box>
                  ))}
                </Box>
              ) : (
                item.id === -1 && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      아직 게시글이 없습니다.
                    </Typography>
                  </Box>
                )
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default MainPage
