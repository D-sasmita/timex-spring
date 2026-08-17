package com.timex.timex_backend.config;

import com.timex.timex_backend.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> {})

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // Authentication
                        // =========================
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // =========================
                        // AI Watch Finder
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/ai/recommend"
                        )
                        .permitAll()

                        // =========================
                        // Public Product Operations
                        // =========================

                        // Anyone can view products
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/**"
                        )
                        .permitAll()

                        // Product images are public
                        .requestMatchers("/images/**")
                        .permitAll()

                        // =========================
                        // Admin Product Operations
                        // =========================

                        // Add product
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products"
                        )
                        .hasRole("ADMIN")

                        // Update product
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/**"
                        )
                        .hasRole("ADMIN")

                        // Delete product
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/**"
                        )
                        .hasRole("ADMIN")

                        // =========================
                        // Orders
                        // =========================

                        // Create order
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/orders"
                        )
                        .hasAnyRole("USER", "ADMIN")

                        // Logged-in user's orders
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders/my-orders"
                        )
                        .hasAnyRole("USER", "ADMIN")

                        // Admin: get all orders
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders"
                        )
                        .hasRole("ADMIN")

                        // Get specific order
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders/*"
                        )
                        .hasAnyRole("USER", "ADMIN")

                        // Admin: update order status
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/orders/*/status"
                        )
                        .hasRole("ADMIN")

                        // =========================
                        // Admin Analytics
                        // =========================
                        .requestMatchers(
                                "/api/analytics/**"
                        )
                        .hasRole("ADMIN")

                        // =========================
                        // Everything else
                        // =========================
                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
}