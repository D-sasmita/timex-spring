
package com.timex.timex_backend.dto;

public class CartItemResponse {

    private Long id;
    private String name;
    private double price;
    private String imageUrl;
    private int qty;

    public CartItemResponse() {
    }

    public CartItemResponse(
            Long id,
            String name,
            double price,
            String imageUrl,
            int qty
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.qty = qty;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public int getQty() {
        return qty;
    }
}
