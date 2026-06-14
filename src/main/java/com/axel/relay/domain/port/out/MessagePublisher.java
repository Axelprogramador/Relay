package com.axel.relay.domain.port.out;

import com.axel.relay.domain.model.Message;

// Puerto salida que conecta co Kafka
public interface MessagePublisher {
    void publish(Message message);
}