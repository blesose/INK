const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'CLIENT_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
] as const

export const validateEnv = () => {
  const missing = requiredEnvVars.filter(name => !process.env[name])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}