package com.timex.timex_backend.service;

import com.timex.timex_backend.dto.AddressRequest;
import com.timex.timex_backend.dto.OrderItemRequest;
import com.timex.timex_backend.dto.OrderRequest;
import com.timex.timex_backend.entity.Order;
import com.timex.timex_backend.entity.OrderItem;
import com.timex.timex_backend.entity.Product;
import com.timex.timex_backend.entity.User;
import com.timex.timex_backend.repository.OrderRepository;
import com.timex.timex_backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public OrderService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            ProductService productService) {

        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    // Create a new order
    public Order createOrder(OrderRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();

        order.setUser(user);
        order.setPaymentId(request.getPaymentId());
        order.setStatus("PLACED");
        order.setCreatedAt(LocalDateTime.now());

        // Set delivery address
        AddressRequest address = request.getAddress();

        if (address != null) {
            order.setFullname(address.getFullname());
            order.setStreet(address.getStreet());
            order.setCity(address.getCity());
            order.setState(address.getState());
            order.setPostalCode(address.getPostalCode());
            order.setCountry(address.getCountry());
        }

        // Add order items — price always comes from the DB, client value is never trusted
        double computedTotal = 0.0;

        for (OrderItemRequest itemRequest : request.getItems()) {

            Product product = productService.getProductById(itemRequest.getProductId());

            if (product == null) {
                throw new RuntimeException("Product not found: " + itemRequest.getProductId());
            }

            OrderItem item = new OrderItem();

            item.setProductId(itemRequest.getProductId());
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(product.getPrice());   // server-side price, ignore client value
            item.setProductName(product.getName());

            item.setOrder(order);
            order.getItems().add(item);

            computedTotal += product.getPrice() * itemRequest.getQuantity();
        }

        order.setTotalAmount(computedTotal);     // server-side total, ignore client value

        return orderRepository.save(order);
    }

    // Get orders belonging to a specific user
    public List<Order> getUserOrders(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUser(user);

        populateProductNames(orders);

        return orders;
    }

    // Get all orders
    public List<Order> getAllOrders() {

        List<Order> orders = orderRepository.findAll();

        populateProductNames(orders);

        return orders;
    }

    // Internal lookup, no ownership check — used by admin-only paths
    private Order findOrderOrThrow(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        populateProductNames(List.of(order));

        return order;
    }

    // Get one order by ID, enforcing ownership unless caller is admin
    public Order getOrderById(Long id, String email, boolean isAdmin) {

        Order order = findOrderOrThrow(id);

        if (!isAdmin && !order.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You do not have permission to view this order");
        }

        return order;
    }

    // Update order status
    public Order updateStatus(Long id, String status) {

        Order order = findOrderOrThrow(id);

        order.setStatus(status);

        return orderRepository.save(order);
    }

    // Populate product names for existing orders
    private void populateProductNames(List<Order> orders) {

        for (Order order : orders) {

            for (OrderItem item : order.getItems()) {

                Product product =
                        productService.getProductById(item.getProductId());

                if (product != null) {
                    item.setProductName(product.getName());
                } else {
                    item.setProductName("Product");
                }
            }
        }
    }
}