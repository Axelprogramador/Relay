package com.axel.relay.infrastructure.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {

    private final SimpMessagingTemplate messagingTemplate;


    private final Map<String, Set<String>> roomUsers = new ConcurrentHashMap<>();

    private final Map<String, String> sessionRooms = new ConcurrentHashMap<>();

    private final Map<String, String> sessionUsers = new ConcurrentHashMap<>();

    public WebSocketEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnect(SessionConnectedEvent event) {
    }

    @EventListener
    public void handleWebSocketDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();

        String roomId = sessionRooms.remove(sessionId);
        String username = sessionUsers.remove(sessionId);

        if (roomId != null && username != null) {
            Set<String> users = roomUsers.getOrDefault(roomId, Collections.emptySet());
            users.remove(username);

            // Notifica users en la sala que un usuario se desconectó
            messagingTemplate.convertAndSend("/topic/users/" + roomId, users.size());
        }
    }

    public void userJoinedRoom(String sessionId, String username, String roomId) {
        sessionRooms.put(sessionId, roomId);
        sessionUsers.put(sessionId, username);

        roomUsers.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(username);

        // Notifica a usuarios en la sala
        messagingTemplate.convertAndSend("/topic/users/" + roomId, roomUsers.get(roomId).size());
    }

    public int getUserCount(String roomId) {
        return roomUsers.getOrDefault(roomId, Collections.emptySet()).size();
    }
}