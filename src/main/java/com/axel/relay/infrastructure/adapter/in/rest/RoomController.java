package com.axel.relay.infrastructure.adapter.in.rest;

import com.axel.relay.domain.model.Message;
import com.axel.relay.domain.model.Room;
import com.axel.relay.domain.port.in.MessageUseCase;
import com.axel.relay.domain.port.in.RoomUseCase;
import com.axel.relay.domain.port.out.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomUseCase roomUseCase;
    private final MessageUseCase messageUseCase;
    private final UserRepository userRepository;

    public RoomController(RoomUseCase roomUseCase, MessageUseCase messageUseCase, UserRepository userRepository) {
        this.roomUseCase = roomUseCase;
        this.messageUseCase = messageUseCase;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        List<RoomResponse> rooms = roomUseCase.getAllRooms()
                .stream()
                .map(r -> new RoomResponse(r.getId(), r.getName(), r.getDescription()))
                .toList();
        return ResponseEntity.ok(rooms);
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@RequestBody CreateRoomRequest request,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        // Identifica ID usuario desde su username
        Long userId = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        Room room = new Room();
        room.setName(request.name());
        room.setDescription(request.description());
        room.setCreatedBy(userId);

        Room saved = roomUseCase.createRoom(room);
        return ResponseEntity.ok(new RoomResponse(saved.getId(), saved.getName(), saved.getDescription()));
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<Void> joinRoom(@PathVariable Long roomId,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        roomUseCase.joinRoom(roomId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable Long roomId) {
        List<MessageResponse> messages = messageUseCase.getMessagesByRoom(roomId)
                .stream()
                .map(m -> new MessageResponse(
                        m.getId(),
                        m.getContent(),
                        m.getSenderId(),
                        m.getSenderUsername(), // añadir
                        m.getSentAt().toString()))
                .toList();
        return ResponseEntity.ok(messages);
    }


    record MessageResponse(Long id, String content, Long senderId, String senderUsername, String sentAt) {}
    record CreateRoomRequest(String name, String description) {}
    record RoomResponse(Long id, String name, String description) {}
}