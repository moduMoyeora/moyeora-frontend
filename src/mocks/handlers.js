import { HttpResponse, http } from 'msw'

export const handlers = [
  http.post('http://dev-moyeora.glitch.me/users/login', async ({ request }) => {
    const { email, password } = await request.json()
    console.log(email, password)
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie':
          'authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibmlja05hbWUiOiJ0ZXN0IiwiaWF0IjoxNzM0NjA1NjQxLCJleHAiOjYxNzM0NjA1NjQxLCJpc3MiOiJtb3llb3JhLXNlcnZlciJ9.Ps_9R_a1QFIe8_L5VEF0OZCL_oXlohQOtRVycubAN5M',
      },
    })
  }),
  http.get('http://dev-moyeora.glitch.me/users/profile/:id', ({ params }) => {
    return Response.json({
      id: params.id,
      nickname: 'testName',
    })
  }),
  http.put(
    'http://dev-moyeora.glitch.me/users/profile/:id',
    async ({ request }) => {
      const User = await request.json()
      return Response.json(User)
    }
  ),

  // 요청 내용 확인

  //

  //   // 간단한 로그인 로직 모킹
  //   if (email === 'test@gmail.com' && password === 'test1234@') {
  //     return res(
  //       // 성공 응답
  //       ctx.status(200),
  //       ctx.json({ message: 'Login successful' }),
  //       // Set-Cookie 헤더 추가
  //       ctx.set(
  //         'Set-Cookie',
  //         'authorization=mockToken123; Path=/; HttpOnly; Secure'
  //       )
  //     )
  //   }

  //   // 실패 응답
  //   return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }))
  // }),
]
