import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles/global.css'

import { App } from './App'
import { AuthProvider } from './context/auth'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
