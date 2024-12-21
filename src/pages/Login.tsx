import './Signup.css'

import { useEffect, useState } from 'react'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import { Cookies } from 'react-cookie'
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
import { login } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export interface LoginProps {
  email: string
  password: string
}
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null
  return null
}

const cookies = new Cookies()
export default function Login() {
  const { isLoggedIn, storeLogin } = useAuthStore()
  const navigate = useNavigate()
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [isEmailValid, setIsEmailValid] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [isPasswordValid, setIsPasswordValid] = React.useState(false)

  const validateEmail = async (email: string) => {
    const emailRegex =
      /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])([a-zA-Z\.]+)/g
    setEmail(email)
    if (emailRegex.test(email)) {
      setIsEmailValid(true)
      return true
    } else {
      setIsEmailValid(false)
      return false
    }
  }

  const validatePassword = async (password: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
    setPassword(password)
    if (passwordRegex.test(password)) {
      setIsPasswordValid(true)
      return true
    } else {
      setIsPasswordValid(false)
      return false
    }
  }

  const handleLogin = async () => {
    try {
      if (email === '' || password === '') {
        setErrorMessage('이메일 또는 비밀번호를 입력해주세요.')
        return
      }
      if (!isEmailValid || !isPasswordValid) {
        setErrorMessage('형식을 지켜 다시 입력해주세요.')
        return
      }
      const res = await login(email, password)

      if (res.status === 200 || res.status === 201) {
        const token = getCookie('Authorization')
        console.log('token:', token)
        if (token) {
          storeLogin(token)
          alert('로그인 완료')
          navigate('/')
        } else {
          alert('로그인에 실패했습니다.')
        }
      } else if (res.status === 401) {
        setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.')
      } else if (res.status === 400) {
        setErrorMessage('형식을 지켜 다시 입력해주세요')
      } else if (res.status === 500) {
        setErrorMessage('서버 오류가 발생했습니다.')
      } else {
        alert('로그인에 실패했습니다.')
      }
    } catch (err: any) {
      console.error('Error setting up request:', err.message)
      setErrorMessage('요청 처리 중 다른 문제가 발생했습니다.')
    }
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
            error={!isEmailValid && email.length > 0}
            variant="outlined"
            helperText="****@***.com"
            value={email}
            onChange={(e) => validateEmail(e.target.value)}
          />
          <InputLabel
            error={!isPasswordValid && password.length > 0}
            size="normal"
            style={{ top: '43%' }}
          >
            비밀번호
          </InputLabel>
          <OutlinedInput
            error={!isPasswordValid && password.length > 0}
            style={{ width: '100%', marginTop: '10px' }}
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
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
            영문, 숫자, 특수문자 포함 8~15자
          </FormHelperText>

          <div
            style={{
              height: '10px',
              width: '300px',
              position: 'relative',
              marginTop: '5px',
            }}
          >
            {errorMessage && (
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            )}
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{
              marginTop: '20px',
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
