import { HttpResponse, http } from 'msw'

export const handlers = [
  http.post(
    'https://dev-moyeora.glitch.me/users/login',
    async ({ request }) => {
      const { email, password } = await request.json()
      return new HttpResponse(JSON.stringify({ id: 3 }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie':
            'Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzM0Nzg1OTIzLCJleHAiOjE3MzQ3ODk1MjMsImlzcyI6Im1veWVvcmEtc2VydmVyIn0.zhXZ31eJbrquOfm2H8CsSIl_8RVjDvwVcoHAZUqklSA; Path=/; HttpOnly',
        },
      })
    }
  ),

  http.get('https://dev-moyeora.glitch.me/users/profile/:id', ({ params }) => {
    const { id } = params
    return Response.json({
      id: params.id,
      nickname: 'testName',
    })
  }),
  http.get('https://dev-moyeora.glitch.me/users/check', ({ request }) => {
    const url = new URL(request.url)
    const field = url.searchParams.get('field')
    const value = url.searchParams.get('value') // 디버깅용 출력

    if (value === 'aa@gmail.com' && field === 'email') {
      return new HttpResponse(JSON.stringify({ isDuplicate: 'true' }), {
        status: 200,
        statusText: 'duplicate email',
      })
    }
    if (field === 'nickname') {
      return new HttpResponse(JSON.stringify({ isDuplicate: 'false' }), {
        status: 200,
      })
    }
    if (field === 'email') {
      return new HttpResponse(JSON.stringify({ isDuplicate: 'false' }), {
        status: 200,
        statusText: 'duplicate nickname',
      })
    }
    return new HttpResponse(null, {
      status: 404,
      statusText: 'error',
    })
  }),

  http.put(
    'https://dev-moyeora.glitch.me/users/profile/:id',
    async ({ request }) => {
      const User = await request.json()
      return Response.json(User)
    }
  ),

  http.post('https://dev-moyeora.glitch.me/users/join', async ({ request }) => {
    try {
      const userData = await request.json()
      const { email, password, nickname } = userData

      // 간단한 유효성 검사
      if (!email || !password || !nickname) {
        return new HttpResponse(
          JSON.stringify({ message: '요청 데이터가 유효하지 않습니다' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }

      // 성공 응답
      return new HttpResponse(JSON.stringify({ message: '회원가입 완료' }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      // 서버 에러 응답
      return new HttpResponse(
        JSON.stringify({ message: 'Internal Server Error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }),
  http.get(
    'https://dev-moyeora.glitch.me/boards/:boardId/posts',
    ({ params }) => {
      const { boardId } = params

      if (boardId == '1') {
        // 게시판을 찾을 수 있는 경우
        return Response.json({
          message: '게시물 목록 조회 성공',
          data: [
            {
              id: 'id',
            },
          ],
        })
      } else if (boardId === undefined) {
        // boardId가 없으면 400 Bad Request 반환
        return Response.json(
          {
            message: '요청 데이터가 유효하지 않습니다',
          },
          { status: 400 }
        )
      } else {
        // 게시판을 찾을 수 없는 경우
        return Response.json(
          {
            message: '게시판을 찾을 수 없습니다',
          },
          { status: 404 }
        )
      }
    }
  ),
  http.post(
    'https://dev-moyeora.glitch.me/boards/:boardId/posts/:postId',
    ({ params, body }) => {
      const { boardId, postId } = params
      const { title, content, board_id } = {
        title: 'title',
        content: 'content',
        board_id: 'board_id',
      }

      if (!title || !content || !board_id) {
        return Response.json(
          {
            message: '요청 데이터가 유효하지 않습니다',
          },
          { status: 400 }
        )
      }

      if (boardId == '1' && postId == '1') {
        // 게시물 등록 완료
        return Response.json(
          {
            message: '게시물 등록 완료',
          },
          { status: 201 }
        )
      } else {
        return Response.json(
          {
            message: '게시물 등록 권한이 없습니다',
          },
          { status: 403 }
        )
      }
    }
  ),
  http.put(
    'https://dev-moyeora.glitch.me/boards/:boardId/posts/:postId',
    ({ params, body }) => {
      const { boardId, postId } = params
      const { title, content } = body

      if (!title || !content) {
        return Response.json(
          {
            message: '요청 데이터가 유효하지 않습니다',
          },
          { status: 400 }
        )
      }

      if (boardId === '1' && postId === '1') {
        // 게시물 수정 권한이 있다고 가정
        return Response.json({
          message: '게시물 수정 완료',
        })
      } else if (boardId !== '1' || postId !== '1') {
        return Response.json(
          {
            message: '게시물을 찾을 수 없습니다',
          },
          { status: 404 }
        )
      } else {
        // 권한이 없는 경우
        return Response.json(
          {
            message: '게시물 수정 권한이 없습니다',
          },
          { status: 403 }
        )
      }
    }
  ),
  http.get(
    'https://dev-moyeora.glitch.me/boards/:boardId/posts/:postId',
    ({ params }) => {
      const { boardId, postId } = params

      if (boardId === '1' && postId === '1') {
        // 게시물을 찾은 경우
        return Response.json({
          message: '게시물 조회 성공',
          data: {
            board_name: 'string',
            title: 'string',
            author: 'string',
            content: 'string',
            created_at: '2024-01-02',
          },
        })
      } else if (boardId === undefined || postId === undefined) {
        // boardId 또는 postId가 없으면 400 Bad Request 반환
        return Response.json(
          {
            message: '요청 데이터가 유효하지 않습니다',
          },
          { status: 400 }
        )
      } else if (boardId !== '1') {
        // 게시판을 찾을 수 없는 경우
        return Response.json(
          {
            message: '게시판을 찾을 수 없습니다',
          },
          { status: 404 }
        )
      } else if (postId !== '1') {
        // 게시물을 찾을 수 없는 경우
        return Response.json(
          {
            message: '게시물을 찾을 수 없습니다',
          },
          { status: 404 }
        )
      } else {
        // 서버 오류
        return Response.json(
          {
            message: '서버 오류가 발생했습니다',
          },
          { status: 500 }
        )
      }
    }
  ),
  //댓글
  http.get(
    'https://dev-moyeora.glitch.me/boards/:boardId/posts/:postId/comments',
    ({ params }) => {
      const { postId, boardId } = params
      if (!postId) {
        return new HttpResponse(
          JSON.stringify({ message: 'Post ID is required' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      const comments = [
        {
          id: 13,
          post_id: 1,
          member_id: 4,
          content: '댓글 내용3',
          created_at: '2024-12-21T12:57:59.000Z',
          updated_at: '2024-12-21T12:57:59.000Z',
          nickname: '임영재',
          email: 'young@test.com',
        },
        {
          id: 12,
          post_id: 1,
          member_id: 1,
          content: '댓글 내용3',
          created_at: '2024-12-21T11:45:21.000Z',
          updated_at: '2024-12-21T11:45:21.000Z',
          nickname: '차수빈',
          email: 'subin@test.com',
        },
        {
          id: 11,
          post_id: 1,
          member_id: 1,
          content: '댓글 내용3',
          created_at: '2024-12-21T10:29:00.000Z',
          updated_at: '2024-12-21T10:29:00.000Z',
          nickname: '차수빈',
          email: 'subin@test.com',
        },
      ]
      return new HttpResponse(
        JSON.stringify({
          message: '댓글 목록 조회 성공',
          data: {
            comments,
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  ),
]
