import './Signup.css'

import { checkEmail, checkNickname, signup } from '../api/auth.api'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Link from '@mui/material/Link'
import React from 'react'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()
  const [nickname, setNickname] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const [isNicknameValid, setIsNicknameValid] = React.useState(false)
  const [isEmailValid, setIsEmailValid] = React.useState(false)
  const [isPasswordValid, setIsPasswordValid] = React.useState(false)

  const [isNicknameChecked, setIsNicknameChecked] = React.useState(false)
  const [isEmailChecked, setIsEmailChecked] = React.useState(false)

  const validateNickname = (nickname: string) => {
    setNickname(nickname)
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/
    if (nicknameRegex.test(nickname)) {
      setIsNicknameValid(true)
    } else {
      setIsNicknameValid(false)
    }
  }
  const handleCheckNickname = async () => {
    try {
      const res = await checkNickname(nickname)
      if (res.status === 200 || res.status === 201) {
        setIsNicknameChecked(true)
        alert('사용 가능한 닉네임입니다.')
      } else {
        setIsNicknameChecked(false)
        alert('이미 사용중인 닉네임입니다.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const validateEmail = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmail(email)
    if (emailRegex.test(email)) {
      setIsEmailValid(true)
      setEmail(email)
    } else {
      setIsEmailValid(false)
    }
  }

  const handleCheckEmail = async () => {
    try {
      checkEmail(email).then((res) => {
        if (res.status === 200) {
          setIsEmailChecked(true)
          alert('사용 가능한 이메일입니다.')
        } else {
          setIsEmailChecked(false)
          alert('이미 사용중인 이메일입니다.')
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
    setPassword(password)
    if (passwordRegex.test(password)) {
      setIsPasswordValid(true)
    } else {
      setIsPasswordValid(false)
    }
  }
  const handleSignup = () => {
    try {
      if (isPasswordValid && isNicknameValid && isEmailValid) {
        signup(nickname, email, password).then((res) => {
          if (res.status === 200 || res.status === 201) {
            alert('회원가입 완료')
            navigate('/login')
          } else {
            alert('회원가입 실패')
          }
        })
      } else {
        alert('모든 항목 형식을 지켜 채워주세요.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="signup-container">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        marginBottom="10px"
      >
        Sign up
      </Typography>
      <Card className="signup-card" variant="outlined">
        <Box component="form" className="signup-box">
          <div className="signup-row">
            <TextField
              error={!isNicknameValid && nickname.length > 0}
              margin="normal"
              label="닉네임"
              value={nickname}
              variant="outlined"
              helperText={
                !isNicknameValid && nickname.length > 0
                  ? '닉네임 형식이 틀렸습니다.'
                  : '특수문자 제외 2~10글자'
              }
              onChange={(e) => validateNickname(e.target.value)}
            />
            <Button
              className="sign-button"
              variant="contained"
              size="medium"
              onClick={handleCheckNickname}
              disabled={!isNicknameValid}
            >
              중복 체크
            </Button>
          </div>
          <div className="signup-row">
            <TextField
              error={!isEmailValid && email.length > 0}
              value={email}
              margin="normal"
              label="이메일"
              variant="outlined"
              helperText={
                !isEmailValid && email.length > 0
                  ? '이메일 형식이 올바르지 않습니다'
                  : '****@****.com'
              }
              onChange={(e) => {
                const value = e.target.value
                validateEmail(value)
              }}
            />
            <Button
              className="sign-button"
              variant="contained"
              size="medium"
              onClick={handleCheckEmail}
              disabled={!isEmailValid}
            >
              중복 체크
            </Button>
          </div>
          <div className="signup-one">
            <TextField
              error={!isPasswordValid && password.length > 0}
              onChange={(e) => {
                const value = e.target.value
                validatePassword(value)
              }}
              value={password}
              margin="normal"
              label="비밀번호"
              variant="outlined"
              helperText={
                !isPasswordValid && password.length > 0
                  ? '비밀번호 형식이 틀렸습니다.'
                  : '영문, 숫자, 특수문자 포함 8~15자'
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleSignup}
              style={{
                backgroundColor: 'black',
                marginBottom: '10px',
              }}
            >
              회원가입
            </Button>
          </div>
          <Typography sx={{ textAlign: 'center' }}>
            계정이 이미 있으신가요?{' '}
            <Link href="/login" variant="body2" sx={{ alignSelf: 'center' }}>
              로그인으로 이동
            </Link>
          </Typography>
        </Box>
      </Card>
    </div>
  )
}
