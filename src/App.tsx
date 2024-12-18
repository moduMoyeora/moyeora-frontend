import './App.css'

import { BrowserRouter } from 'react-router-dom'
import { Button } from '@mui/material'
import NavBar from './components/Navbar'
import React from 'react'
import Router from './Router'
import Signup from './pages/Signup'
import logo from './logo.svg'

function App() {
  return (
    <div className="App">
      <NavBar />
      <Router />
    </div>
  )
}

export default App
