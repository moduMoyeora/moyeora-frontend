import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Home from './pages/home'
import TuiEditor from './components/Editor'
import React from 'react'
import Post from './pages/Post'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts" element={<TuiEditor />} />
        <Route path="/post_temp" element={<Post />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
