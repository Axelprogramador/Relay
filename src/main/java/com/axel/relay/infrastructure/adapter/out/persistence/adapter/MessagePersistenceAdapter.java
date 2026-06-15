package com.axel.relay.infrastructure.adapter.out.persistence.adapter;

import com.axel.relay.domain.model.Message;
import com.axel.relay.domain.port.out.MessageRepository;
import com.axel.relay.infrastructure.adapter.out.persistence.repository.MessageJpaRepository;
import com.axel.relay.infrastructure.entity.MessageEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MessagePersistenceAdapter implements MessageRepository {

    private final MessageJpaRepository messageJpaRepository;

    public MessagePersistenceAdapter(MessageJpaRepository messageJpaRepository) {
        this.messageJpaRepository = messageJpaRepository;
    }

    @Override
    public Message save(Message message) {
        MessageEntity entity = toEntity(message);
        MessageEntity saved = messageJpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public List<Message> findByRoomId(Long roomId) {
        return messageJpaRepository.findByRoomIdOrderBySentAtAsc(roomId)
                .stream()
                .map(this::toDomain)
                .toList();
    }

    private MessageEntity toEntity(Message message) {
        return new MessageEntity(
                message.getId(),
                message.getContent(),
                message.getSenderId(),
                message.getSenderUsername(), // añadido
                message.getRoomId(),
                message.getSentAt()
        );
    }

    private Message toDomain(MessageEntity entity) {
        return new Message(
                entity.getId(),
                entity.getContent(),
                entity.getSenderId(),
                entity.getSenderUsername(), // añadido
                entity.getRoomId(),
                entity.getSentAt()
        );
    }
}