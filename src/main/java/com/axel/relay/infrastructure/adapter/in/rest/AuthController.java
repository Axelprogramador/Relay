package com.axel.relay.infrastructure.adapter.in.rest;

import com.axel.relay.domain.model.User;
import com.axel.relay.domain.port.in.UserUseCase;
import com.axel.relay.infrastructure.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserUseCase userUseCase;
    private final JwtService jwtService;

    public AuthController(UserUseCase userUseCase, JwtService jwtService) {
        this.userUseCase = userUseCase;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(request.password());

        User saved = userUseCase.register(user);
        return ResponseEntity.ok(new UserResponse(saved.getId(), saved.getUsername(), saved.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        User user = userUseCase.login(request.email(), request.password());
        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok(new TokenResponse(token));
    }

    record RegisterRequest(String username, String email, String password) {}
    record LoginRequest(String email, String password) {}
    record UserResponse(Long id, String username, String email) {}
    record TokenResponse(String token) {}
}