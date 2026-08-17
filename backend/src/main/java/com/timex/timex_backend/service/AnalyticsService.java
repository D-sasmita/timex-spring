package com.timex.timex_backend.service;

import com.timex.timex_backend.entity.Order;
import com.timex.timex_backend.repository.OrderRepository;
import com.timex.timex_backend.repository.ProductRepository;
import com.timex.timex_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public AnalyticsService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public double getTotalRevenue() {

        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .filter(order -> order.getTotalAmount() != null)
                .mapToDouble(Order::getTotalAmount)
                .sum();
    }

    public long getTotalOrders() {
        return orderRepository.count();
    }

    public long getTotalProducts() {
        return productRepository.count();
    }

    public long getTotalUsers() {
        return userRepository.count();
    }
}