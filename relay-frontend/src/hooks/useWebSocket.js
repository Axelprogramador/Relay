import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// Hook que gestiona conexión WebSocket con el backend
export function useWebSocket(roomId, token) {
  const [messages, setMessages] = useState([])
  const clientRef = useRef(null)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        client.subscribe(`/topic/chat/${roomId}`, (frame) => {
          const message = JSON.parse(frame.body)
          setMessages((prev) => [...prev, message])
        })
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame)
      }
    })

    client.activate()
    clientRef.current = client

    // Limpia conexion al salir de la sala
    return () => {
      client.deactivate()
    }
  }, [roomId, token])

  // Envia un mensaje a través de WebSocket
  const sendMessage = (content) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({ content })
      })
    }
  }

  return { messages, sendMessage }
}