package com.timex.timex_backend.controller;

import com.timex.timex_backend.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/api/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {

        Map<String, Object> analytics = new HashMap<>();

        analytics.put(
                "totalRevenue",
                analyticsService.getTotalRevenue()
        );

        analytics.put(
                "totalOrders",
                analyticsService.getTotalOrders()
        );

        analytics.put(
                "totalProducts",
                analyticsService.getTotalProducts()
        );

        analytics.put(
                "totalUsers",
                analyticsService.getTotalUsers()
        );

        return ResponseEntity.ok(analytics);
    }
}