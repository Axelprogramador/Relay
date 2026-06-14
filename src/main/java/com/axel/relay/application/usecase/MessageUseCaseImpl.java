package com.axel.relay.application.usecase;

import com.axel.relay.domain.model.Message;
import com.axel.relay.domain.port.in.MessageUseCase;
import com.axel.relay.domain.port.out.MessagePublisher;
import com.axel.relay.domain.port.out.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageUseCaseImpl implements MessageUseCase {

    private final MessageRepository messageRepository;
    private final MessagePublisher messagePublisher;

    public MessageUseCaseImpl(MessageRepository messageRepository, MessagePublisher messagePublisher) {
        this.messageRepository = messageRepository;
        this.messagePublisher = messagePublisher;
    }

    @Override
    public void sendMessage(Message message) {
        message.setSentAt(LocalDateTime.now());

        // Primero guardamos mensaje en DB para no perderlo
        messageRepository.save(message);

        messagePublisher.publish(message);
    }

    @Override
    public List<Message> getMessagesByRoom(Long roomId) {
        return messageRepository.findByRoomId(roomId);
    }
}