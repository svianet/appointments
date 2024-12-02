import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Reports from './pages/Reports'
// import LoginRequired from './util/LoginRequired'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* <Route element={<LoginRequired />}> */}
              <Route path="/reports" element={<Reports />} />
            {/* </Route> */}
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
