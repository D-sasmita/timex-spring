package com.timex.timex_backend.config;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
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

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Allow CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()

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
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/**"
                        )
                        .permitAll()

                        .requestMatchers("/images/**")
                        .permitAll()

                        // =========================
                        // Admin Product Operations
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/**"
                        )
                        .hasRole("ADMIN")

                        // =========================
                        // Orders
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/orders"
                        )
                        .hasAnyRole("USER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders/my-orders"
                        )
                        .hasAnyRole("USER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders/*"
                        )
                        .hasAnyRole("USER", "ADMIN")

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
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring()
                .requestMatchers("/images/**");
    }

    // =========================
    // CORS Configuration
    // =========================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "https://timex-frontend-e1ol.onrender.com",
                        "http://localhost:3000",
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
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