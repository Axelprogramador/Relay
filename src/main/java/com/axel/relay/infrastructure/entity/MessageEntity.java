package com.axel.relay.infrastructure.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    public MessageEntity() {}

    public MessageEntity(Long id, String content, Long senderId, Long roomId, LocalDateTime sentAt) {
        this.id = id;
        this.content = content;
        this.senderId = senderId;
        this.roomId = roomId;
        this.sentAt = sentAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}