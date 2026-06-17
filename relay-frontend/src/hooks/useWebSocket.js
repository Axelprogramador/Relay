import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function useWebSocket(roomId, token) {
  const [messages, setMessages] = useState([])
  const [onlineCount, setOnlineCount] = useState(0)
  const clientRef = useRef(null)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        client.subscribe(`/topic/users/${roomId}`, (frame) => {
          setOnlineCount(JSON.parse(frame.body))
        })

        client.subscribe(`/topic/chat/${roomId}`, (frame) => {
          const message = JSON.parse(frame.body)
          setMessages((prev) => [...prev, message])

          if (document.hidden) {
            notifyNewMessage(message)
          }
        })
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame)
      }
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [roomId, token])

  const notifyNewMessage = (message) => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification(message)
        }
      })
    } else if (Notification.permission === 'granted') {
      showNotification(message)
    }
  }

  const showNotification = (message) => {
    const notification = new Notification(`⚡ ${message.senderUsername}`, {
      body: message.content,
      icon: '/favicon.ico',
      silent: false
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    setTimeout(() => notification.close(), 4000)
  }

  const sendMessage = (content) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({ content })
      })
    }
  }

  return { messages, sendMessage, onlineCount }
}