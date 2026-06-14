package com.axel.relay.infrastructure.adapter.out.persistence.adapter;

import com.axel.relay.domain.model.Room;
import com.axel.relay.domain.port.out.RoomRepository;
import com.axel.relay.infrastructure.adapter.out.persistence.repository.RoomJpaRepository;
import com.axel.relay.infrastructure.adapter.out.persistence.repository.RoomMemberJpaRepository;
import com.axel.relay.infrastructure.entity.RoomEntity;
import com.axel.relay.infrastructure.entity.RoomMemberEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
public class RoomPersistenceAdapter implements RoomRepository {

    private final RoomJpaRepository roomJpaRepository;
    private final RoomMemberJpaRepository roomMemberJpaRepository;

    public RoomPersistenceAdapter(RoomJpaRepository roomJpaRepository,
                                  RoomMemberJpaRepository roomMemberJpaRepository) {
        this.roomJpaRepository = roomJpaRepository;
        this.roomMemberJpaRepository = roomMemberJpaRepository;
    }

    @Override
    public Room save(Room room) {
        RoomEntity entity = toEntity(room);
        RoomEntity saved = roomJpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public List<Room> findAll() {
        return roomJpaRepository.findAll().stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Room> findById(Long id) {
        return roomJpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public void saveRoomMember(Long roomId, Long userId) {
        RoomMemberEntity member = new RoomMemberEntity(roomId, userId, LocalDateTime.now());
        roomMemberJpaRepository.save(member);
    }

    @Override
    public boolean isMember(Long roomId, Long userId) {
        return roomMemberJpaRepository.existsByRoomIdAndUserId(roomId, userId);
    }

    private RoomEntity toEntity(Room room) {
        return new RoomEntity(
                room.getId(),
                room.getName(),
                room.getDescription(),
                room.getCreatedBy(),
                room.getCreatedAt()
        );
    }

    private Room toDomain(RoomEntity entity) {
        return new Room(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCreatedBy(),
                entity.getCreatedAt()
        );
    }
}