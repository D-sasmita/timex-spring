package com.timex.timex_backend.controller;

import com.timex.timex_backend.dto.OrderRequest;
import com.timex.timex_backend.entity.Order;
import com.timex.timex_backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // =========================
    // Create Order
    // =========================
    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody OrderRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        Order order = orderService.createOrder(request, email);

        return ResponseEntity.ok(order);
    }

    // =========================
    // Get Logged-in User Orders
    // =========================
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                orderService.getUserOrders(email)
        );
    }

    // =========================
    // Get All Orders
    // ADMIN
    // =========================
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    // =========================
    // Get Order By ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                orderService.getOrderById(id)
        );
    }

    // =========================
    // Update Order Status
    // ADMIN
    // =========================
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                orderService.updateStatus(id, status)
        );
    }
}