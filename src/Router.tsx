import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Post from './pages/Post'
import CreatePost from './pages/createPost'
import EditPost from './pages/EditPost'
import Events from './pages/Events'
import Login from './pages/Login'
import MyPage from './pages/MyPage'
import NavBar from './components/Navbar'
import React from 'react'
import Signup from './pages/Signup'
import Home from './pages/Home'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/boards/:boardId/posts" element={<CreatePost />} />
        <Route path="/boards/:boardId/posts/:id/edit" element={<EditPost />} />
        <Route path="/boards/:boardId/posts/:id" element={<Post />} />
        <Route path="/boards/:boardId/posts/:id/events" element={<Events />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
