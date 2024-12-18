import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from './App'
import Home from './pages/Home'
import Login from './pages/Login'
import MyPage from './pages/MyPage'
import NavBar from './components/Navbar'
import React from 'react'
import Signup from './pages/Signup'
import TuiEditor from './components/Editor'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<TuiEditor />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        {/* <Route path="/post_temp" element={<Post />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default Router
