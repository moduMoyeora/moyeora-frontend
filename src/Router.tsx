import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Post from './pages/Post'
import CreatePost from './pages/createPost'
import EditPost from './pages/EditPost'
import PostList from './pages/PostList'
import MainPage from './pages/Main'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/boards/:boardId/posts" element={<CreatePost />} />
        <Route path="/boards/:boardId/posts/:id/edit" element={<EditPost />} />
        <Route path="/boards/:boardId/posts/:id" element={<Post />} />
        <Route path="/boards/:boardId" element={<PostList />} />
        <Route path="/boards/:boardId/posts/:id" element={<Post />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
