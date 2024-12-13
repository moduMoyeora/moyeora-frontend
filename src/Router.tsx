import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Writing from './pages/Writing'
import Post from './pages/Post'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/post/:id" element={<Post />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
