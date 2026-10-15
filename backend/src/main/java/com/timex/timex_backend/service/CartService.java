
package com.timex.timex_backend.service;

import com.timex.timex_backend.dto.CartItemResponse;
import com.timex.timex_backend.entity.Cart;
import com.timex.timex_backend.entity.CartItem;
import com.timex.timex_backend.entity.Product;
import com.timex.timex_backend.entity.User;
import com.timex.timex_backend.repository.CartItemRepository;
import com.timex.timex_backend.repository.CartRepository;
import com.timex.timex_backend.repository.ProductRepository;
import com.timex.timex_backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User is not authenticated");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        return cartRepository.findByUserId(user.getId())
                .map(cart -> cart.getItems().stream()
                        .map(this::toResponse)
                        .toList())
                .orElse(List.of());
    }

    @Transactional
    public List<CartItemResponse> addItem(
            Authentication authentication,
            Long productId,
            int quantity
    ) {
        if (productId == null || quantity < 1) {
            throw new IllegalArgumentException(
                    "A valid product ID and positive quantity are required"
            );
        }

        User user = getAuthenticatedUser(authentication);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setProduct(product);
            item.setQuantity(quantity);
            cart.addItem(item);
        }

        cartRepository.save(cart);
        return getCart(authentication);
    }

    @Transactional
    public List<CartItemResponse> updateQuantity(
            Authentication authentication,
            Long productId,
            int quantity
    ) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        User user = getAuthenticatedUser(authentication);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Product is not in your cart"
                ));

        item.setQuantity(quantity);
        cartRepository.save(cart);

        return getCart(authentication);
    }

    @Transactional
    public List<CartItemResponse> removeItem(
            Authentication authentication,
            Long productId
    ) {
        User user = getAuthenticatedUser(authentication);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Product is not in your cart"
                ));

        cart.removeItem(item);
        cartRepository.save(cart);

        return getCart(authentication);
    }

    private CartItemResponse toResponse(CartItem item) {
        Product product = item.getProduct();

        return new CartItemResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getImageUrl(),
                item.getQuantity()
        );
    }
}
