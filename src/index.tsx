import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router'
import reportWebVitals from './reportWebVitals'

function renderApp() {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  )

  const queryClient = new QueryClient()

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </React.StrictMode>
  )
}

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser')
  worker.start().then(() => {
    renderApp()
  })
} else {
  renderApp()
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
