import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Post from './pages/Post'
import CreatePost from './pages/createPost'
import EditPost from './pages/EditPost'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/boards/:boardId/posts" element={<CreatePost />} />
        <Route path="/boards/:boardId/posts/:id/edit" element={<EditPost />} />
        <Route path="/boards/:boardId/posts/:id" element={<Post />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
