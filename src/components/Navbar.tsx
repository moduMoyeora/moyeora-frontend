import './Navbar.css'

import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <div>
      <div className="navbar">
        <Link className="navbar-title" to={'/'}>
          ModuMoyeora
        </Link>
        <div className="navbar-Menus">
          <Link className="navbar-menu" to={'/board'}>
            게시판
          </Link>
        </div>
        <div className="navbar-Login">
          <Link className="navbar-menu" to={'/login'}>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
