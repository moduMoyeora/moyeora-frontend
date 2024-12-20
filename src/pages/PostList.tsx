import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material'
import Header from '../components/Header' // Import the Header component

interface Post {
  id: number
  title: string
  author: string
  createdAt: string
}

interface BoardListProps {
  boardId: string
}

const PostList: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>() // boardId를 useParams로 가져옴
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = 'https://dev-moyeora.glitch.me'

  // Mock 데이터 정의
  const mockPosts: Post[] = [
    {
      id: 1,
      title: 'First Post',
      author: 'Author A',
      createdAt: '2023-12-20T10:00:00',
    },
    {
      id: 2,
      title: 'Second Post',
      author: 'Author B',
      createdAt: '2023-12-21T12:00:00',
    },
    {
      id: 3,
      title: 'Third Post',
      author: 'Author C',
      createdAt: '2023-12-22T14:30:00',
    },
    {
      id: 4,
      title: 'Fourth Post',
      author: 'Author D',
      createdAt: '2023-12-23T15:45:00',
    },
    {
      id: 5,
      title: 'Fifth Post',
      author: 'Author E',
      createdAt: '2023-12-24T18:00:00',
    },
    {
      id: 6,
      title: 'Sixth Post',
      author: 'Author F',
      createdAt: '2023-12-25T20:00:00',
    },
    {
      id: 7,
      title: 'Seventh Post',
      author: 'Author G',
      createdAt: '2023-12-26T21:30:00',
    },
    {
      id: 8,
      title: 'Eighth Post',
      author: 'Author H',
      createdAt: '2023-12-27T22:00:00',
    },
    {
      id: 9,
      title: 'Ninth Post',
      author: 'Author I',
      createdAt: '2023-12-28T23:00:00',
    },
    {
      id: 10,
      title: 'Tenth Post',
      author: 'Author J',
      createdAt: '2023-12-29T01:00:00',
    },
  ]

  const totalPosts = mockPosts.length

  //   useEffect(() => {
  //     fetchPosts()
  //   }, [currentPage, boardId])

  //   const fetchPosts = async () => {
  //     setIsLoading(true)
  //     setError(null)
  //     try {
  //       const response = await axios.get(`${API_BASE_URL}/boards/${boardId}`, {
  //         params: { page: currentPage },
  //       })
  //       setPosts(response.data.posts || [])
  //       setTotalPages(Math.ceil((response.data.total || posts.length) / 10))
  //     } catch (err) {
  //       setError('게시글을 불러오는데 실패했습니다.')
  //     }
  //     setIsLoading(false)
  //   }

  //   const handlePageChange = (
  //     event: React.ChangeEvent<unknown>,
  //     page: number
  //   ) => {
  //     setCurrentPage(page)
  //   }

  //   if (isLoading)
  //     return (
  //       <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
  //         <CircularProgress />
  //       </Box>
  //     )

  //   if (error)
  //     return (
  //       <Box mt={4}>
  //         <Alert severity="error">{error}</Alert>
  //       </Box>
  //     )

  useEffect(() => {
    fetchPosts()
  }, [currentPage, boardId])

  const fetchPosts = () => {
    setIsLoading(true)
    setError(null)
    try {
      // Mock 데이터를 currentPage에 맞게 분할하여 가져옴
      const postsPerPage = 5
      const offset = (currentPage - 1) * postsPerPage
      const paginatedPosts = mockPosts.slice(offset, offset + postsPerPage)
      setPosts(paginatedPosts)
      setTotalPages(Math.ceil(totalPosts / postsPerPage))
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.')
    }
    setIsLoading(false)
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
    <Box maxWidth="800px" mx="auto" mt={4}>
      <Header /> {/* Use the Header here */}
      <Typography variant="h4" gutterBottom>
        게시판
      </Typography>
      <Paper elevation={3}>
        <Box p={2}>
          <Grid container spacing={2} sx={{ fontWeight: 'bold' }}>
            <Grid item xs={6}>
              제목
            </Grid>
            <Grid item xs={3}>
              작성자
            </Grid>
            <Grid item xs={3}>
              작성일
            </Grid>
          </Grid>
          <Box mt={2}>
            {posts.map((post) => (
              <Link
                to={`/boards/${boardId}/posts/${post.id}`}
                key={post.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Grid
                  container
                  spacing={2}
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
            ))}
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
