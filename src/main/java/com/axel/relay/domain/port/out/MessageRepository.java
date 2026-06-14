package com.axel.relay.domain.port.out;

import com.axel.relay.domain.model.Message;
import java.util.List;

public interface MessageRepository {
    Message save(Message message);
    List<Message> findByRoomId(Long roomId);
}