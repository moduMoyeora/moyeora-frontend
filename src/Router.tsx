import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import MyPage from './pages/MyPage'
import NavBar from './components/Navbar'
import React from 'react'
import Signup from './pages/Signup'
import TuiEditor from './components/Editor'
import Writing from './pages/Writing'

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
        <Route path="/writing" element={<Writing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
