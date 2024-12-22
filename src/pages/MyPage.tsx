import './MyPage.css'
import {
  Unstable_NumberInput as BaseNumberInput,
  NumberInputProps,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput'
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  TextFieldProps,
  Typography,
  selectClasses,
} from '@mui/material'
import { FaEdit, FaUser } from 'react-icons/fa'
import { FaMapLocationDot, FaRegMessage } from 'react-icons/fa6'
import { getUser, updateUser } from '../api/auth.api'
import { useEffect, useState } from 'react'
import React from 'react'
import { BsGenderAmbiguous } from 'react-icons/bs'
import { User } from '../model/users'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

const NumberInput = React.forwardRef(function CustomNumberInput(
  props: NumberInputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <BaseNumberInput
      slotProps={{
        incrementButton: {
          children: '▴',
        },
        decrementButton: {
          children: '▾',
        },
      }}
      {...props}
      ref={ref}
    />
  )
})

export default function MyPage() {
  const navigate = useNavigate()
  const { user_id, isLoggedIn } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertOption, setAlertOption] = useState({
    severity: '',
    value: '',
  })
  const [user, setUser] = useState<User>({
    nickname: '',
  })
  const [editUser, setEditUser] = useState<User>({ nickname: '' })

  const getUserInformation = async () => {
    if (user_id) {
      try {
        const response = await getUser(user_id)
        if (response.status === 200) {
          setUser(response.data)
        } else {
          console.log('User information fetch failed:', response)
        }
      } catch (error) {
        console.error('Error fetching user information:', error)
      }
    }
  }

  useEffect(() => {
    if (isLoggedIn && user_id) {
      getUserInformation()
    }
  }, [isLoggedIn, user_id])

  useEffect(() => {
    setEditUser(user)
  }, [user])

  const handleClose = () => {
    setOpen(false)
    setAlert(false)
  }

  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const name = e.target.name
    const value = e.target.value
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    if (user_id) {
      try {
        const response = await updateUser(user_id.toString(), editUser)
        if (response.status === 200) {
          setAlertOption({
            severity: 'success',
            value: '저장되었습니다.',
          })
          setUser(response.data)
        } else {
          setAlertOption({
            severity: 'error',
            value: '저장 실패',
          })
        }
        setAlert(true)
        updateUser(user_id.toString(), user)
        setOpen(false)
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('유저 아이디 없음')
    }
  }
  const handleEdit = () => {
    setEditUser({ ...user })
    setOpen(true)
  }
  const numberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numericValue = value.replace(/[^0-9]/g, '')
    setEditUser((prevUser) => ({
      ...prevUser,
      age: numericValue,
    }))
  }
  return (
    <div className="page" style={{ width: '50%' }}>
      <Container maxWidth="md" sx={{ width: '100%' }}>
        <Paper elevation={2} className="profile-style">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" className="mypage-one-title">
              나의 정보
            </Typography>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <Box className="profile-field">
                <Box className="profile-icon-wrapper">
                  <FaUser size={20} />
                </Box>
                <Typography variant="h6" className="mypage-font-style">
                  별명
                </Typography>
                <Typography variant="body1" className="mypage-font-style">
                  {user?.nickname || ''}
                </Typography>
              </Box>
              <Grid item xs={12}>
                <Box className="profile-field">
                  <Box className="profile-icon-wrapper">
                    <FaUser size={20} />
                  </Box>
                  <Typography variant="h6" className="mypage-font-style">
                    실명
                  </Typography>
                  <Typography variant="body1" className="mypage-font-style">
                    {user?.name || ''}
                  </Typography>
                </Box>
                <Box className="profile-field">
                  <Box className="profile-icon-wrapper">
                    <FaUser size={20} />
                  </Box>
                  <Typography variant="h6" className="mypage-font-style">
                    나이
                  </Typography>
                  <Typography variant="body1" className="mypage-font-style">
                    {user?.age}
                  </Typography>
                </Box>
                <Box className="profile-field">
                  <Box className="profile-icon-wrapper">
                    <BsGenderAmbiguous size={20} />
                  </Box>
                  <Typography variant="h6" className="mypage-font-style">
                    성별
                  </Typography>
                  <Typography variant="body1" className="mypage-font-style-2">
                    {user?.gender === 'M'
                      ? '남자'
                      : user?.gender === 'F'
                        ? '여자'
                        : ''}
                  </Typography>
                </Box>

                <Box className="profile-field">
                  <Box className="profile-icon-wrapper">
                    <FaMapLocationDot size={20} />
                  </Box>
                  <Typography variant="h6" className="mypage-font-style">
                    지역
                  </Typography>
                  <Typography variant="body1" className="mypage-font-style-2">
                    {user?.region || ''}
                  </Typography>
                </Box>
                <Box className="profile-field">
                  <Box className="profile-icon-wrapper">
                    <FaRegMessage size={20} />
                  </Box>
                  <Typography variant="h6" className="mypage-font-style">
                    소개
                  </Typography>
                  <Typography variant="body1" className="mypage-font-style-2">
                    {user?.description || ''}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FaEdit />}
                onClick={handleEdit}
                aria-label="Edit profile"
              >
                수정하기
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Dialog open={open} onClose={handleClose} className="dialog-style">
          <DialogTitle style={{ height: '20px' }}>프로필 수정</DialogTitle>
          <form className="form-style">
            <div className="form-content">
              <TextField
                variant="filled"
                label="닉네임"
                name="nickname"
                value={editUser?.nickname ?? ''}
                onChange={handleDataChange as TextFieldProps['onChange']}
              />
            </div>
            <div className="form-content">
              <TextField
                variant="filled"
                label="실명"
                name="name"
                value={editUser?.name ?? ''}
                onChange={handleDataChange as TextFieldProps['onChange']}
              />
            </div>
            <div className="form-content">
              <TextField
                type="number"
                variant="filled"
                label="나이"
                name="age"
                inputMode="numeric"
                value={editUser?.age ?? ''}
                onChange={numberChange}
              />
            </div>
            <div className="form-content">
              <Select
                sx={{ width: '100px' }}
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={editUser?.gender ?? ''}
                label="gender"
                name="gender"
                onChange={handleDataChange}
              >
                <MenuItem value={'M'}>남자</MenuItem>
                <MenuItem value={'F'}>여자</MenuItem>
              </Select>
            </div>
            <div className="form-content">
              <TextField
                variant="filled"
                label="지역"
                name="region"
                value={editUser?.region || ''}
                onChange={handleDataChange as TextFieldProps['onChange']}
              />
            </div>

            <div className="form-content">
              <TextField
                variant="filled"
                label="소개"
                name="description"
                value={editUser?.description ?? ''}
                onChange={handleDataChange as TextFieldProps['onChange']}
              />
            </div>
          </form>
          <DialogActions>
            <Button onClick={handleClose}>취소</Button>
            <Button onClick={handleSave}>저장</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          style={{ bottom: '10%' }}
          open={alert}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success">저장되었습니다.</Alert>
        </Snackbar>
      </Container>
    </div>
  )
}
