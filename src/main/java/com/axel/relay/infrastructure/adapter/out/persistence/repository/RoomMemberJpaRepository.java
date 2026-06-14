package com.axel.relay.infrastructure.adapter.out.persistence.repository;

import com.axel.relay.infrastructure.entity.RoomMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomMemberJpaRepository extends JpaRepository<RoomMemberEntity, Long> {
    boolean existsByRoomIdAndUserId(Long roomId, Long userId);
}