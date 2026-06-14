package com.axel.relay.domain.port.in;

import com.axel.relay.domain.model.Room;
import java.util.List;

public interface RoomUseCase {
    Room createRoom(Room room);
    List<Room> getAllRooms();
    void joinRoom(Long roomId, Long userId);
}