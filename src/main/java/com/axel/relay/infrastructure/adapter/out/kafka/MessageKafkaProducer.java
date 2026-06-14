package com.axel.relay.infrastructure.adapter.out.kafka;

import com.axel.relay.domain.model.Message;
import com.axel.relay.domain.port.out.MessagePublisher;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

// Puerto de salida MessagePublisher
@Component
public class MessageKafkaProducer implements MessagePublisher {

    private static final String TOPIC = "chat.messages";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public MessageKafkaProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public void publish(Message message) {
        try {
            // Serializar Json para enviar pr Kafka
            String payload = objectMapper.writeValueAsString(message);

            kafkaTemplate.send(TOPIC, String.valueOf(message.getRoomId()), payload);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing message for Kafka", e);
        }
    }
}