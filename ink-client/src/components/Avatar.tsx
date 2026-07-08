interface AvatarProps {
  name?: string | null
  avatar?: string | null
  size?: number
  color?: string
  className?: string
}

const isImageUrl = (value?: string | null) => {
  if (!value) return false

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

const getInitials = (name?: string | null, avatar?: string | null) => {
  if (avatar && !isImageUrl(avatar)) return avatar.slice(0, 2).toUpperCase()
  if (!name) return 'U'

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'
}

export default function Avatar({
  name,
  avatar,
  size = 28,
  color,
  className = '',
}: AvatarProps) {
  const dimension = `${size}px`

  return (
    <div
      className={className}
      title={name || 'User'}
      style={{
        width: dimension,
        height: dimension,
        minWidth: dimension,
        minHeight: dimension,
        borderRadius: '50%',
        overflow: 'hidden',
        background: color || 'linear-gradient(135deg,#7c3aed,#db2777)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: `${Math.max(10, Math.floor(size * 0.38))}px`,
        fontWeight: 700,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      {isImageUrl(avatar) ? (
        <img
          src={avatar!}
          alt={name ? `${name} avatar` : 'User avatar'}
          referrerPolicy="no-referrer"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <span>{getInitials(name, avatar)}</span>
      )}
    </div>
  )
}

