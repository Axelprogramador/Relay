package com.axel.relay.application.usecase;

import com.axel.relay.domain.model.User;
import com.axel.relay.domain.port.out.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserUseCaseImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserUseCaseImpl userUseCase;

    private User newUser;

    @BeforeEach
    void setUp() {
        newUser = new User();
        newUser.setUsername("axel");
        newUser.setEmail("axel@example.com");
        newUser.setPassword("plainPassword");
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        // Arrange
        when(userRepository.existsByEmail("axel@example.com")).thenReturn(false);
        when(userRepository.findByUsername("axel")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("plainPassword")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User result = userUseCase.register(newUser);

        // Assert
        assertThat(result.getPassword()).isEqualTo("hashedPassword");
        assertThat(result.getRole()).isEqualTo("ROLE_USER");
        assertThat(result.getCreatedAt()).isNotNull();
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        // Arrange
        when(userRepository.existsByEmail("axel@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> userUseCase.register(newUser));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenUsernameAlreadyExists() {
        // Arrange
        when(userRepository.existsByEmail("axel@example.com")).thenReturn(false);
        when(userRepository.findByUsername("axel")).thenReturn(Optional.of(newUser));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> userUseCase.register(newUser));
        verify(userRepository, never()).save(any(User.class));
    }
}