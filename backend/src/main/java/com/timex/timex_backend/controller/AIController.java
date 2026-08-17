package com.timex.timex_backend.controller;

import com.timex.timex_backend.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final GeminiService geminiService;

    public AIController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<String> recommend(
            @RequestBody Map<String, String> request) {

        String query = request.get("query");

        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("{\"recommendations\":[]}");
        }

        String result = geminiService.getRecommendation(query);

        return ResponseEntity.ok(result);
    }
}