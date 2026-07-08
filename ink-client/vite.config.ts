

// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'
// // import tailwindcss from '@tailwindcss/vite'

// // export default defineConfig({
// //   plugins: [
// //     react(),
// //     tailwindcss(),
// //   ],
// //   server: {
// //     headers: {
// //       'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
// //       'Cross-Origin-Embedder-Policy': 'unsafe-none'
// //     }
// //   }
// // })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     headers: {
//       'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
//     },
//   },
//   preview: {
//     headers: {
//       'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
//     },
//   },
// })




// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})