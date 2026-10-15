
package com.timex.timex_backend.controller;

import com.timex.timex_backend.dto.CartItemResponse;
import com.timex.timex_backend.service.CartService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(
            Authentication authentication
    ) {
        return ResponseEntity.ok(cartService.getCart(authentication));
    }

    @PostMapping("/items")
    public ResponseEntity<List<CartItemResponse>> addItem(
            Authentication authentication,
            @RequestBody Map<String, Integer> request
    ) {
        Long productId = request.containsKey("productId")
                ? request.get("productId").longValue()
                : null;

        int quantity = request.getOrDefault("quantity", 1);

        return ResponseEntity.status(HttpStatus.OK)
                .body(cartService.addItem(authentication, productId, quantity));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<List<CartItemResponse>> updateQuantity(
            Authentication authentication,
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> request
    ) {
        Integer quantity = request.get("quantity");

        if (quantity == null || quantity < 1) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                cartService.updateQuantity(authentication, productId, quantity)
        );
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<List<CartItemResponse>> removeItem(
            Authentication authentication,
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                cartService.removeItem(authentication, productId)
        );
    }
}
