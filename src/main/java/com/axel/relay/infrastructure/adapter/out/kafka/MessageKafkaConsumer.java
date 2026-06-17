package com.axel.relay.infrastructure.adapter.out.kafka;

import com.axel.relay.domain.model.Message;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class MessageKafkaConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public MessageKafkaConsumer(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "chat.messages", groupId = "relay-group")
    public void consume(String payload) {
        System.out.println("Mensaje consumido de Kafka: " + payload);
        try {
            Message message = objectMapper.readValue(payload, Message.class);
            System.out.println("Enviando por WebSocket a: /topic/chat/" + message.getRoomId());

            messagingTemplate.convertAndSend(
                    "/topic/chat/" + message.getRoomId(),
                    message
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error deserializing message from Kafka", e);
        }
    }
}