package com.axel.relay.infrastructure.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_members",
        // Condicion que evita que un usuario este 2 o mas veces en la misma sala
        uniqueConstraints = @UniqueConstraint(columnNames = {"room_id", "user_id"})
)
public class RoomMemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    public RoomMemberEntity() {}

    public RoomMemberEntity(Long roomId, Long userId, LocalDateTime joinedAt) {
        this.roomId = roomId;
        this.userId = userId;
        this.joinedAt = joinedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}