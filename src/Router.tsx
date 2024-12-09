import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Home from './pages/home'
import TuiEditor from './components/Editor'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/writing" element={<TuiEditor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
