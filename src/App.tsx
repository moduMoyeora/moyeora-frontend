import React from 'react'
import MainPage from './pages/Main'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

// MUI 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#d32f2f',
    },
  },
})

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainPage />
    </ThemeProvider>
  )
}

export default App
