package com.timex.timex_backend.controller;

import com.timex.timex_backend.service.GeminiService;
import org.springframework.http.HttpStatus;
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

        try {
            String result = geminiService.getRecommendation(query);
            return ResponseEntity.ok(result);

        } catch (RuntimeException ex) {
            // Keep technical exception details in server logs.
            System.err.println(
                    "AI recommendation failed: " + ex.getMessage()
            );

            String message = ex.getMessage() == null
                    ? ""
                    : ex.getMessage().toLowerCase();

            boolean temporaryError =
                    message.contains("503")
                    || message.contains("429")
                    || message.contains("500")
                    || message.contains("502")
                    || message.contains("504")
                    || message.contains("high demand")
                    || message.contains("temporarily unavailable")
                    || message.contains("resource exhausted");

            if (temporaryError) {
                return ResponseEntity
                        .status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body("""
                                {
                                  "error": "AI recommendations are temporarily unavailable. Please try again shortly."
                                }
                                """);
            }

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("""
                            {
                              "error": "Unable to generate AI recommendations. Please try again later."
                            }
                            """);
        }
    }
}
