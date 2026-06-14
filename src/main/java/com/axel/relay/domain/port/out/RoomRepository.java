package com.axel.relay.domain.port.out;

import com.axel.relay.domain.model.Room;
import java.util.List;
import java.util.Optional;

public interface RoomRepository {
    Room save(Room room);
    List<Room> findAll();
    Optional<Room> findById(Long id);
    void saveRoomMember(Long roomId, Long userId);
    boolean isMember(Long roomId, Long userId);
}