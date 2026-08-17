package com.timex.timex_backend.service;

import com.timex.timex_backend.entity.Product;
import com.timex.timex_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProductWithImage(
            String name, String description, double price,
            String category, int stockQuantity, MultipartFile image) {

        String filename = saveImage(image);

        Product product = new Product(
                name, price, description, category, stockQuantity, filename);

        return productRepository.save(product);
    }

    public Product updateProductWithImage(
            Long id, String name, String description, double price,
            String category, int stockQuantity, MultipartFile image) {

        Product existingProduct = productRepository.findById(id).orElse(null);

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setName(name);
        existingProduct.setPrice(price);
        existingProduct.setDescription(description);
        existingProduct.setCategory(category);
        existingProduct.setStockQuantity(stockQuantity);

        if (image != null && !image.isEmpty()) {
            String filename = saveImage(image);
            existingProduct.setImageUrl(filename);
        }

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private String saveImage(MultipartFile image) {
        try {
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = image.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID() + extension;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(image.getInputStream(), filePath);

            return filename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }
}