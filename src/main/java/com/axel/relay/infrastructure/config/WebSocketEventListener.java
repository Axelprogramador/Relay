package com.axel.relay.infrastructure.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;
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

    // Registra cuando usuario entra en una room, para conteo de usuarios online
    @EventListener
    public void handleSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = accessor.getDestination();

        System.out.println("Suscripción recibida a: " + destination);

        if (destination != null && destination.startsWith("/topic/chat/")) {
            String roomId = destination.substring("/topic/chat/".length());
            Principal principal = accessor.getUser();

            System.out.println("Principal en suscripción: " + (principal != null ? principal.getName() : "NULL"));

            if (principal != null) {
                String username = principal.getName();
                String sessionId = accessor.getSessionId();

                sessionRooms.put(sessionId, roomId);
                sessionUsers.put(sessionId, username);

                roomUsers.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(username);

                System.out.println("Usuarios en sala " + roomId + ": " + roomUsers.get(roomId));

                messagingTemplate.convertAndSend("/topic/users/" + roomId, roomUsers.get(roomId).size());
            }
        }
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

            messagingTemplate.convertAndSend("/topic/users/" + roomId, users.size());
        }
    }

    public int getUserCount(String roomId) {
        return roomUsers.getOrDefault(roomId, Collections.emptySet()).size();
    }
}