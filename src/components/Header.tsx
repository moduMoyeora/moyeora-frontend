// Header.tsx
import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          moyeora
        </Link>
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" color="primary">
          로그아웃
        </Button>
        <Button variant="outlined" color="primary">
          마이페이지
        </Button>
      </Box>
    </Box>
  )
}

export default Header
