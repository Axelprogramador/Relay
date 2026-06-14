package com.axel.relay.domain.port.in;

import com.axel.relay.domain.model.Message;
import java.util.List;

public interface MessageUseCase {
    void sendMessage(Message message);
    List<Message> getMessagesByRoom(Long roomId);
}