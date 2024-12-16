import './Navbar.css'

import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import { useAuthStore } from '../store/authStore'

const category = [
  { name: '게시판', path: '/board' },
  { name: '채팅', path: '/chat' },
  { name: '커뮤니티', path: '/community' },
]

export default function NavBar() {
  const { isLoggedIn, storeLogout } = useAuthStore()
  return (
    <div>
      <div className="navbar">
        <Link className="navbar-title" to={'/'}>
          ModuMoyeora
        </Link>
        <div className="navbar-Menus">
          {category.map(({ name, path }, idx) => (
            <Link className="navbar-menu" to={path} key={idx}>
              {name}
            </Link>
          ))}
        </div>
        <div className="navbar-right">
          {isLoggedIn ? (
            <div>
              <Link className="navbar-menu" to={'/mypage'}>
                마이페이지
              </Link>
              <Link className="navbar-menu" to={'/'} onClick={storeLogout}>
                Logout
              </Link>
            </div>
          ) : (
            <div className="navbar-right">
              <Link className="navbar-menu" to={'/login'}>
                Login
              </Link>
              <Typography variant="h6" color="white">
                |
              </Typography>
              <Link className="navbar-menu" to={'/signup'}>
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
