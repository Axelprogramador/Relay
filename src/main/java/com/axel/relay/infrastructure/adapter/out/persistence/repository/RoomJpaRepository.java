package com.axel.relay.infrastructure.adapter.out.persistence.repository;

import com.axel.relay.infrastructure.entity.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomJpaRepository extends JpaRepository<RoomEntity, Long> {
}