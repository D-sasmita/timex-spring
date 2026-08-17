package com.timex.timex_backend.controller;

import com.timex.timex_backend.entity.Product;
import com.timex.timex_backend.service.ProductService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Get all products
    // Public: USER and ADMIN can access
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get product by ID
    // Public: USER and ADMIN can access
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // Create product
    // ADMIN only
    @PostMapping(consumes = {"multipart/form-data"})
    public Product createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("category") String category,
            @RequestParam("stockQuantity") int stockQuantity,
            @RequestParam("image") MultipartFile image) {

        return productService.createProductWithImage(
                name,
                description,
                price,
                category,
                stockQuantity,
                image
        );
    }

    // Update product
    // ADMIN only
    @PutMapping(
            value = "/{id}",
            consumes = {"multipart/form-data"}
    )
    public Product updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("category") String category,
            @RequestParam("stockQuantity") int stockQuantity,
            @RequestParam(value = "image", required = false)
            MultipartFile image) {

        return productService.updateProductWithImage(
                id,
                name,
                description,
                price,
                category,
                stockQuantity,
                image
        );
    }

    // Delete product
    // ADMIN only
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);

        return "Product deleted successfully";
    }
}