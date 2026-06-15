package com.axel.relay.infrastructure.adapter.in.websocket;

import com.axel.relay.domain.model.Message;
import com.axel.relay.domain.port.in.MessageUseCase;
import com.axel.relay.domain.port.out.UserRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private final MessageUseCase messageUseCase;
    private final UserRepository userRepository;

    public ChatWebSocketController(MessageUseCase messageUseCase, UserRepository userRepository) {
        this.messageUseCase = messageUseCase;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId,
                            @Payload MessageRequest request,
                            Principal principal) {

        Long userId = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        Message message = new Message();
        message.setContent(request.content());
        message.setSenderId(userId);
        message.setSenderUsername(principal.getName());
        message.setRoomId(roomId);

        messageUseCase.sendMessage(message);
    }

    record MessageRequest(String content) {}
}