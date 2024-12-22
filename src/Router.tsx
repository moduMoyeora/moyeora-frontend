import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Post from './pages/Post'
import Comment from './components/Comment'
import EditPost from './pages/EditPost'
import Events from './pages/Events'
import Login from './pages/Login'
import MyPage from './pages/MyPage'
import NavBar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import React from 'react'
import Signup from './pages/Signup'
import MainPage from './pages/MainPage'
import PostList from './pages/PostList'
import CreatePost from './pages/createPost'
const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        // login 필요한 페이지인 경우 아래에 넣으세요.
        <Route element={<ProtectedRoute />}>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/boards/:boardId" element={<PostList />} />
          <Route path="/boards/:boardId/posts/:id" element={<Post />} />
          <Route path="/boards/:boardId/posts" element={<CreatePost />} />
          <Route
            path="/boards/:boardId/posts/:id/edit" 
            element={<EditPost />}
          />
        </Route>
         {/* 이벤트 생성 */}
         <Route
            path="/boards/:boardId/posts/:id/events"
            element={<Events />}
          /> 
          {/* 이벤트 수정 */}
          <Route
            path="/boards/:boardId/posts/:id/events/edit"
            element={<Events />}
          />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
