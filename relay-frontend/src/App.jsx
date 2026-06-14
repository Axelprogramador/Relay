import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'
import ChatPage from './pages/ChatPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/chat/:roomId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App