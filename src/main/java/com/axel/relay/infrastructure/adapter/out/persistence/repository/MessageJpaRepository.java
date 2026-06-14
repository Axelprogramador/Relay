package com.axel.relay.infrastructure.adapter.out.persistence.repository;

import com.axel.relay.infrastructure.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageJpaRepository extends JpaRepository<MessageEntity, Long> {
    // Spring Data convierte este metodo a SELECT * FROM messages WHERE room_id = ?

    List<MessageEntity> findByRoomIdOrderBySentAtAsc(Long roomId);
}