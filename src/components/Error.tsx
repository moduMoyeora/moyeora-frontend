import { useRouteError } from 'react-router-dom'

interface RouteError {
  statusText?: string
  message?: string
}

export default function Error() {
  const error = useRouteError() as RouteError
  return (
    <div>
      <h2>오류가 발생했습니다.</h2>
      <p>에러는 다음과 같습니다.</p>
      {error.statusText || error.message}
    </div>
  )
}
