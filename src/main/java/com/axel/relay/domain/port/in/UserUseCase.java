package com.axel.relay.domain.port.in;

import com.axel.relay.domain.model.User;

public interface UserUseCase {
    User register(User user);
    User login(String email, String password);
}