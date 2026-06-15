package com.axel.relay.domain.model;

import java.time.LocalDateTime;

public class Message {

    private Long id;
    private String content;
    private Long senderId;
    private String senderUsername; // añadido para que el frontend pueda mostrar el nombre
    private Long roomId;
    private LocalDateTime sentAt;

    public Message() {}

    public Message(Long id, String content, Long senderId, String senderUsername, Long roomId, LocalDateTime sentAt) {
        this.id = id;
        this.content = content;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.roomId = roomId;
        this.sentAt = sentAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderUsername() { return senderUsername; }
    public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}