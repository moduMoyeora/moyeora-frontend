import './signup.css'

import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import Link from '@mui/material/Link'
import OutlinedInput from '@mui/material/OutlinedInput'
import React from 'react'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

interface JwtPayload {
  user_id: string
}
export default function Login() {
  axios.defaults.baseURL = 'http://localhost:3000'
  const navigate = useNavigate()
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const handleLogin = () => {
    console.log(email, password)
    axios.post(`/users/login`, { email, password }).then((res) => {
      if (res.status === 200 || res.status === 201) {
        alert('로그인 완료')
        localStorage.setItem('token', res.data.token)
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${res.data.token}`
        console.log(res.data.token)
        const decoded = jwtDecode<JwtPayload>(res.data.token)
        localStorage.setItem('user_id', decoded.user_id)
        navigate('/')
      } else {
        alert('로그인에 실패했습니다.')
      }
    })
  }
  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  return (
    <div className="signup-container">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        marginBottom="10px"
      >
        Login
      </Typography>
      <Card className="signin-card" variant="outlined">
        <FormControl>
          <TextField
            margin="normal"
            label="이메일"
            variant="outlined"
            helperText="****@***.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputLabel style={{ top: '45%' }}>비밀번호</InputLabel>
          <OutlinedInput
            style={{ width: '100%', marginTop: '10px' }}
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <FormHelperText id="outlined-weight-helper-text">
            "8~10자리 숫자를 입력하세요"
          </FormHelperText>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{
              marginTop: '25px',
              backgroundColor: 'black',
            }}
            onClick={handleLogin}
          >
            로그인
          </Button>
        </FormControl>
        <Typography sx={{ textAlign: 'center' }}>
          계정이 이미 있으신가요?{'  '}
          <Link href="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
            회원가입
          </Link>
        </Typography>
      </Card>
    </div>
  )
}
