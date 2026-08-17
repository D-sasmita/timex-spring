package com.timex.timex_backend.controller;
import com.timex.timex_backend.dto.LoginRequest;
import com.timex.timex_backend.dto.AuthResponse;
import com.timex.timex_backend.dto.RegisterRequest;
import com.timex.timex_backend.entity.User;
import com.timex.timex_backend.repository.UserRepository;
import com.timex.timex_backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setActive(true);

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail());

        AuthResponse response = new AuthResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole(),
                token
        );

        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String token = jwtUtil.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                token
        );

        return ResponseEntity.ok(response);
    }
}