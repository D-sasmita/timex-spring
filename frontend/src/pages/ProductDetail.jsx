import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { ShoppingBag, Minus, Plus, ChevronLeft } from "lucide-react";
import API from "../api/axios";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        setError(null);
      } catch (err) {
        setError("Couldn't load this product. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      dispatch(addToCart(product));
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-brand-gray font-sans">Loading watch...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-red-600 font-sans mb-4">{error || "Product not found."}</p>
        <Link to="/shop" className="text-brand-black underline font-sans text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1 text-sm text-brand-gray hover:text-brand-black font-sans mb-8"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <p className="text-xs uppercase tracking-[0.3em] text-brand-brass font-sans font-medium mb-3">
              {product.category}
            </p>
          )}
          <h1 className="font-display text-4xl sm:text-5xl text-brand-black mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-sans text-brand-black mb-6">
            ₹{product.price?.toLocaleString("en-IN")}
          </p>

          {product.description && (
            <p className="text-brand-gray font-sans leading-relaxed mb-8 max-w-md">
              {product.description}
            </p>
          )}

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm uppercase tracking-widest text-brand-gray font-sans">
              Quantity
            </span>
            <div className="flex items-center border border-gray-300">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-sans">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="p-2 hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-black text-white px-10 py-3 text-sm uppercase tracking-widest font-sans hover:bg-brand-brass transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            {added ? "Added to Cart" : "Add to Cart"}
          </button>

          {/* Stock info */}
          {typeof product.countInStock === "number" && (
            <p className="text-sm font-sans mt-4 text-brand-gray">
              {product.countInStock > 0
                ? `${product.countInStock} in stock`
                : "Currently out of stock"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;