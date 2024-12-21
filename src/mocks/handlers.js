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
]
