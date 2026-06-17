package com.axel.relay.application.usecase;

import com.axel.relay.domain.model.Room;
import com.axel.relay.domain.port.out.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomUseCaseImplTest {

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomUseCaseImpl roomUseCase;

    private Room room;

    @BeforeEach
    void setUp() {
        room = new Room();
        room.setId(1L);
        room.setName("General");
        room.setDescription("General discussion room");
        room.setCreatedBy(10L);
    }

    @Test
    void shouldCreateRoomSuccessfully() {
        // Arrange
        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Room result = roomUseCase.createRoom(room);

        // Assert
        assertThat(result.getName()).isEqualTo("General");
        assertThat(result.getCreatedAt()).isNotNull();
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    void shouldReturnAllRooms() {
        // Arrange
        Room secondRoom = new Room();
        secondRoom.setId(2L);
        secondRoom.setName("Random");

        when(roomRepository.findAll()).thenReturn(List.of(room, secondRoom));

        // Act
        List<Room> result = roomUseCase.getAllRooms();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).extracting(Room::getName).containsExactly("General", "Random");
    }

    @Test
    void shouldJoinRoomSuccessfully() {
        // Arrange
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(roomRepository.isMember(1L, 20L)).thenReturn(false);

        // Act
        roomUseCase.joinRoom(1L, 20L);

        // Assert
        verify(roomRepository, times(1)).saveRoomMember(1L, 20L);
    }

    @Test
    void shouldThrowExceptionWhenRoomDoesNotExist() {
        // Arrange
        when(roomRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> roomUseCase.joinRoom(99L, 20L));
        verify(roomRepository, never()).saveRoomMember(any(), any());
    }

    @Test
    void shouldThrowExceptionWhenUserAlreadyMember() {
        // Arrange
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(roomRepository.isMember(1L, 20L)).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> roomUseCase.joinRoom(1L, 20L));
        verify(roomRepository, never()).saveRoomMember(any(), any());
    }
}