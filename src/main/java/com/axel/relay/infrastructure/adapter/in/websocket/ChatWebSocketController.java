package com.axel.relay.infrastructure.adapter.in.websocket;

import com.axel.relay.domain.model.Message;
import com.axel.relay.domain.port.in.MessageUseCase;
import com.axel.relay.domain.port.out.UserRepository;
import com.axel.relay.infrastructure.config.WebSocketEventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private final MessageUseCase messageUseCase;
    private final UserRepository userRepository;
    private final WebSocketEventListener eventListener;

    public ChatWebSocketController(MessageUseCase messageUseCase,
                                   UserRepository userRepository,
                                   WebSocketEventListener eventListener) {
        this.messageUseCase = messageUseCase;
        this.userRepository = userRepository;
        this.eventListener = eventListener;
    }

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId,
                            @Payload MessageRequest request,
                            Principal principal,
                            SimpMessageHeaderAccessor headerAccessor) {

        String username = principal.getName();
        String sessionId = headerAccessor.getSessionId();

        Long userId = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        eventListener.userJoinedRoom(sessionId, username, roomId.toString());

        Message message = new Message();
        message.setContent(request.content());
        message.setSenderId(userId);
        message.setSenderUsername(username);
        message.setRoomId(roomId);

        messageUseCase.sendMessage(message);
    }

    record MessageRequest(String content) {}
}