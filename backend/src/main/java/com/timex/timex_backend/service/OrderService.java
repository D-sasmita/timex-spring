package com.timex.timex_backend.service;

import com.timex.timex_backend.dto.AddressRequest;
import com.timex.timex_backend.dto.OrderItemRequest;
import com.timex.timex_backend.dto.OrderRequest;
import com.timex.timex_backend.entity.Order;
import com.timex.timex_backend.entity.OrderItem;
import com.timex.timex_backend.entity.Product;
import com.timex.timex_backend.entity.User;
import com.timex.timex_backend.repository.CartRepository;
import com.timex.timex_backend.repository.OrderRepository;
import com.timex.timex_backend.repository.ProductRepository;
import com.timex.timex_backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.TreeMap;

@Service
public class OrderService {

    private static final int MAX_LINES = 50;
    private static final int MAX_QTY_PER_PRODUCT = 10;
    private static final Set<String> STATUSES =
            Set.of("PLACED", "SHIPPED", "DELIVERED", "CANCELLED");

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductService productService;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    public OrderService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            ProductService productService,
            ProductRepository productRepository,
            CartRepository cartRepository) {

        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productService = productService;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
    }

    // Create a new order. One transaction: if anything fails, the order,
    // the stock changes and the cart changes are all rolled back.
    @Transactional
    public Order createOrder(OrderRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Your order has no items");
        }

        if (request.getItems().size() > MAX_LINES) {
            throw new IllegalArgumentException("Too many items in one order");
        }

        AddressRequest address = request.getAddress();
        validateAddress(address);

        // Merge duplicate product lines. TreeMap sorts ids, so row locks are
        // always taken in the same order and two orders cannot deadlock.
        Map<Long, Integer> wanted = new TreeMap<>();

        for (OrderItemRequest line : request.getItems()) {

            if (line == null || line.getProductId() == null) {
                throw new IllegalArgumentException("Each item needs a product ID");
            }

            Integer qty = line.getQuantity();

            if (qty == null || qty < 1) {
                throw new IllegalArgumentException("Quantity must be at least 1");
            }

            wanted.merge(line.getProductId(), qty, Integer::sum);
        }

        Order order = new Order();

        order.setUser(user);
        order.setPaymentId("COD");
        order.setStatus("PLACED");
        order.setCreatedAt(LocalDateTime.now());
        order.setFullname(address.getFullname().trim());
        order.setStreet(address.getStreet().trim());
        order.setCity(address.getCity().trim());
        order.setState(address.getState().trim());
        order.setPostalCode(address.getPostalCode().trim());
        order.setCountry(address.getCountry().trim());

        double computedTotal = 0.0;

        for (Map.Entry<Long, Integer> entry : wanted.entrySet()) {

            Long productId = entry.getKey();
            int qty = entry.getValue();

            if (qty > MAX_QTY_PER_PRODUCT) {
                throw new IllegalArgumentException(
                        "You can order at most " + MAX_QTY_PER_PRODUCT + " units of one product");
            }

            Product product = productRepository.findByIdForUpdate(productId)
                    .orElseThrow(() -> new NoSuchElementException(
                            "Product not found: " + productId));

            if (product.getStockQuantity() < qty) {
                throw new IllegalArgumentException(
                        product.getStockQuantity() == 0
                                ? product.getName() + " is out of stock"
                                : "Only " + product.getStockQuantity() + " left of " + product.getName());
            }

            // Price always comes from the DB, the client value is ignored
            product.setStockQuantity(product.getStockQuantity() - qty);

            OrderItem item = new OrderItem();

            item.setProductId(productId);
            item.setQuantity(qty);
            item.setPrice(product.getPrice());
            item.setProductName(product.getName());
            item.setOrder(order);

            order.getItems().add(item);

            computedTotal += product.getPrice() * qty;
        }

        order.setTotalAmount(Math.round(computedTotal * 100.0) / 100.0);

        Order saved = orderRepository.save(order);

        // Remove the ordered products from the user's database cart
        cartRepository.findByUserId(user.getId()).ifPresent(cart ->
                cart.getItems().removeIf(ci -> wanted.containsKey(ci.getProduct().getId())));

        return saved;
    }

    private void validateAddress(AddressRequest a) {

        if (a == null
                || isBlank(a.getFullname())
                || isBlank(a.getStreet())
                || isBlank(a.getCity())
                || isBlank(a.getState())
                || isBlank(a.getPostalCode())
                || isBlank(a.getCountry())) {
            throw new IllegalArgumentException("Please fill in all delivery details");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    // Get orders belonging to a specific user
    public List<Order> getUserOrders(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

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
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

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

    // Update order status (ADMIN). Only known statuses are accepted.
    @Transactional
    public Order updateStatus(Long id, String status) {

        String normalized = status == null ? "" : status.trim().toUpperCase();

        if (!STATUSES.contains(normalized)) {
            throw new IllegalArgumentException("Invalid status. Use one of " + STATUSES);
        }

        Order order = findOrderOrThrow(id);

        order.setStatus(normalized);

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