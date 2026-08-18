#!/bin/bash

TOKEN="jwt-token-here"
API="http://localhost:8080/api/products"

create_product() {
  curl -s -X POST "$API" \
    -H "Authorization: Bearer $TOKEN" \
    -F "name=$1" \
    -F "description=$2" \
    -F "price=$3" \
    -F "category=$4" \
    -F "stockQuantity=$5" \
    -F "image=@$6" \
    | python3 -m json.tool
  echo "---"
}

create_product "TimeX Digital" "A retro digital watch with backlight and alarm." 1999 "Casual" 40 "backend/seed-images/watch3.jpg"
create_product "TimeX Chrono" "A chronograph watch with stopwatch and date display." 8499 "Premium" 10 "backend/seed-images/watch4.jpg"
