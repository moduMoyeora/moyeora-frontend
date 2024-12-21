import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Post from './pages/Post'
import CreatePost from './pages/createPost'
import EditPost from './pages/EditPost'
import Events from './pages/Events'
import Login from './pages/Login'
import MyPage from './pages/MyPage'
import NavBar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import React from 'react'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Comment from './components/Comment'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/boards/:boardId/posts/:id" element={<Post />} />
        // login 필요한 페이지인 경우 아래에 넣으세요.
        <Route element={<ProtectedRoute />}>
          <Route path="/boards/:boardId/posts" element={<CreatePost />} />
          <Route
            path="/boards/:boardId/posts/:id/events"
            element={<Events />}
          />
          <Route
            path="/boards/:boardId/posts/:id/edit"
            element={<EditPost />}
          />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
