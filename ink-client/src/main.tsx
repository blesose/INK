// // // import { StrictMode } from 'react'
// // // import { createRoot } from 'react-dom/client'
// // // import { Toaster } from 'react-hot-toast'
// // // import './index.css'
// // // import App from './App.tsx'

// // // createRoot(document.getElementById('root')!).render(
// // //   <StrictMode>
// // //     <App />
// // //     <Toaster
// // //       position="top-right"
// // //       toastOptions={{
// // //         style: {
// // //           background: '#1a1a2e',
// // //           color: '#fff',
// // //           border: '1px solid rgba(124,58,237,0.3)',
// // //           borderRadius: '12px',
// // //           fontFamily: 'DM Sans, sans-serif',
// // //           fontSize: '14px',
// // //         },
// // //         success: {
// // //           iconTheme: { primary: '#7c3aed', secondary: '#fff' }
// // //         },
// // //         error: {
// // //           iconTheme: { primary: '#ef4444', secondary: '#fff' }
// // //         }
// // //       }}
// // //     />
// // //   </StrictMode>,
// // // )

// // import { StrictMode } from 'react'
// // import { createRoot } from 'react-dom/client'
// // import { Toaster } from 'react-hot-toast'
// // import { GoogleOAuthProvider } from '@react-oauth/google'
// // import './index.css'
// // import App from './App.tsx'

// // createRoot(document.getElementById('root')!).render(
// //   <StrictMode>
// //     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
// //       <App />
// //       <Toaster
// //         position="top-right"
// //         toastOptions={{
// //           style: {
// //             background: '#1a1a2e',
// //             color: '#fff',
// //             border: '1px solid rgba(124,58,237,0.3)',
// //             borderRadius: '12px',
// //             fontFamily: 'DM Sans, sans-serif',
// //             fontSize: '14px',
// //           },
// //           success: {
// //             iconTheme: { primary: '#7c3aed', secondary: '#fff' }
// //           },
// //           error: {
// //             iconTheme: { primary: '#ef4444', secondary: '#fff' }
// //           }
// //         }}
// //       />
// //     </GoogleOAuthProvider>
// //   </StrictMode>,
// // )


// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { Toaster } from 'react-hot-toast'
// import { GoogleOAuthProvider } from '@react-oauth/google'
// import './index.css'
// import App from './App.tsx'

// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// if (!GOOGLE_CLIENT_ID) {
//   console.error('Missing VITE_GOOGLE_CLIENT_ID environment variable')
// }

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
//       <App />
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: '#1a1a2e',
//             color: '#fff',
//             border: '1px solid rgba(124,58,237,0.3)',
//             borderRadius: '12px',
//             fontFamily: 'DM Sans, sans-serif',
//             fontSize: '14px',
//           },
//           success: {
//             iconTheme: { primary: '#7c3aed', secondary: '#fff' }
//           },
//           error: {
//             iconTheme: { primary: '#ef4444', secondary: '#fff' }
//           }
//         }}
//       />
//     </GoogleOAuthProvider>
//   </StrictMode>,
// )


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import './App.css'
import App from './App.tsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

if (!GOOGLE_CLIENT_ID) {
  console.error('Missing VITE_GOOGLE_CLIENT_ID environment variable')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '12px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#7c3aed', secondary: '#fff' }
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' }
          }
        }}
      />
    </GoogleOAuthProvider>
  </StrictMode>,
)