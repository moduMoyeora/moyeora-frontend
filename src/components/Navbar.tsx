import './Navbar.css'

import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'

const categories = [
  { name: '게시판', path: '/board' },
  { name: '채팅', path: '/chat' },
]

export default function NavBar() {
  const { isLoggedIn, storeLogout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="navbar">
      <Link className="navbar-title" to="/">
        ModuMoyeora
      </Link>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`navbar-Menus ${isOpen ? 'active' : ''}`}>
        {categories.map(({ name, path }, idx) => (
          <Link
            className="navbar-menu"
            to={path}
            key={idx}
            onClick={() => setIsOpen(false)}
          >
            {name}
          </Link>
        ))}
      </div>

      <div className={`navbar-right ${isOpen ? 'active' : ''}`}>
        {isLoggedIn ? (
          <>
            <Link
              className="navbar-menu"
              to="/mypage"
              onClick={() => setIsOpen(false)}
            >
              마이페이지
            </Link>
            <Link
              className="navbar-menu"
              to="/"
              onClick={() => {
                storeLogout()
                setIsOpen(false)
              }}
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              className="navbar-menu"
              to="/login"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
