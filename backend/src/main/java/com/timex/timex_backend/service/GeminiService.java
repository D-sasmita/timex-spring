package com.timex.timex_backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.timex.timex_backend.entity.Product;
import com.timex.timex_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeminiService {

    private final ProductRepository productRepository;
    private final Client client;

    public GeminiService(
            ProductRepository productRepository,
            @Value("${gemini.api.key}") String apiKey) {

        this.productRepository = productRepository;

        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public String getRecommendation(String query) {

        List<Product> products = productRepository.findAll();

        if (products.isEmpty()) {
            return "{\"recommendations\":[]}";
        }

        StringBuilder productData = new StringBuilder();

        for (Product product : products) {

            productData.append("""
                    Product ID: %d
                    Name: %s
                    Price: %.2f
                    Category: %s
                    Description: %s
                    Stock: %d

                    """.formatted(
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    product.getCategory(),
                    product.getDescription(),
                    product.getStockQuantity()
            ));
        }

        String prompt = """
                You are the AI watch recommendation assistant for TimeX.

                The customer asked:
                "%s"

                Available products:

                %s

                Recommend products only from the available product list.

                Return ONLY valid JSON in exactly this format:

                {
                  "recommendations": [
                    {
                      "productId": 1,
                      "reason": "Short explanation why this product matches the customer's request."
                    }
                  ]
                }

                Rules:
                - Never invent a product.
                - productId must match an available product.
                - Recommend a maximum of 3 products.
                - Keep each reason under 30 words.
                - If no product matches reasonably well, return an empty recommendations array.
                """.formatted(query, productData);

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        prompt,
                        null
                );

        return response.text();
    }
}