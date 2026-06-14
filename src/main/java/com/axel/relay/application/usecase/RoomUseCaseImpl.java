package com.axel.relay.application.usecase;

import com.axel.relay.domain.model.Room;
import com.axel.relay.domain.port.in.RoomUseCase;
import com.axel.relay.domain.port.out.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoomUseCaseImpl implements RoomUseCase {

    private final RoomRepository roomRepository;

    public RoomUseCaseImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public Room createRoom(Room room) {
        room.setCreatedAt(LocalDateTime.now());
        return roomRepository.save(room);
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public void joinRoom(Long roomId, Long userId) {
        roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (roomRepository.isMember(roomId, userId)) {
            throw new RuntimeException("User is already a member of this room");
        }

        roomRepository.saveRoomMember(roomId, userId);
    }
}