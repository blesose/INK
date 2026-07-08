// // import { useEffect } from 'react'
// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// // import { AuthProvider } from './context/AuthContext'
// // import { ThemeProvider, useTheme } from './context/ThemeContext'
// // import ProtectedRoute from './components/ProtectedRoute'
// // import Landing from './pages/Landing'
// // import Login from './pages/Login'
// // import Register from './pages/Register'
// // import Dashboard from './pages/Dashboard'
// // import Board from './pages/Board'

// // function ThemedApp() {
// //   const { dark } = useTheme()

// //   useEffect(() => {
// //     if (dark) {
// //       document.documentElement.classList.add('dark')
// //     } else {
// //       document.documentElement.classList.remove('dark')
// //     }
// //   }, [dark])

// //   return (
// //     <AuthProvider>
// //       <BrowserRouter>
// //         <Routes>
// //           <Route path="/landing" element={<Landing />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<Register />} />
// //           <Route path="/" element={
// //             <ProtectedRoute><Dashboard /></ProtectedRoute>
// //           } />
// //           <Route path="/board/:roomId" element={
// //             <ProtectedRoute><Board /></ProtectedRoute>
// //           } />
// //           <Route path="*" element={<Navigate to="/landing" replace />} />
// //         </Routes>
// //       </BrowserRouter>
// //     </AuthProvider>
// //   )
// // }

// // export default function App() {
// //   return (
// //     <ThemeProvider>
// //       <ThemedApp />
// //     </ThemeProvider>
// //   )
// // }


// import { useEffect } from 'react'
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider } from './context/AuthContext'
// import { ThemeProvider, useTheme } from './context/ThemeContext'
// import ProtectedRoute from './components/ProtectedRoute'
// import Landing from './pages/Landing'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Dashboard from './pages/Dashboard'
// import Board from './pages/Board'

// function ThemedApp() {
//   const { dark } = useTheme()

//   useEffect(() => {
//     if (dark) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }, [dark])

//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Public routes - accessible without authentication */}
//           <Route path="/landing" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
          
//           {/* Root path - show landing for unauthenticated, dashboard for authenticated */}
//           <Route path="/" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
          
//           {/* Protected routes - require authentication */}
//           <Route path="/dashboard" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/board/:roomId" element={
//             <ProtectedRoute>
//               <Board />
//             </ProtectedRoute>
//           } />
          
//           {/* Catch all - redirect to landing */}
//           <Route path="*" element={<Navigate to="/landing" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   )
// }

// export default function App() {
//   return (
//     <ThemeProvider>
//       <ThemedApp />
//     </ThemeProvider>
//   )
// }



import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Board from './pages/Board'

function ThemedApp() {
  const { dark } = useTheme()

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes - accessible without authentication */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/board/:roomId" element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          } />
          
          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  )
}