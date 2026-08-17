package com.timex.timex_backend.repository;

import com.timex.timex_backend.entity.Order;
import com.timex.timex_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);
}