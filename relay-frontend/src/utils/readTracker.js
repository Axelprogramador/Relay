const STORAGE_KEY = 'relay_last_read'

function getLastReadMap() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function getLastRead(roomId) {
  const map = getLastReadMap()
  return map[roomId] ?? null
}

export function markRoomAsRead(roomId) {
  const map = getLastReadMap()
  map[roomId] = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

// Determina si sala tiene mensajes nuevos
export function hasUnreadMessages(roomId, lastMessageAt) {
  if (!lastMessageAt) return false
  const lastRead = getLastRead(roomId)
  if (!lastRead) return true
  return new Date(lastMessageAt) > new Date(lastRead)
}