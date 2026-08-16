import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles, ShoppingBag } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import API from "../api/axios";

const AIWatchFinder = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Unable to load products:", error);
    }
  };

  fetchProducts();
}, []);
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecommendation = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRecommendations([]);

      const response = await API.post("/ai/recommend", {
        query: query.trim(),
      });

      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      console.error("AI recommendation error:", err);
      setError("Unable to get AI recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProduct = (productId) => {
    return products.find((product) => product.id === productId);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 py-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-brass" />

              <p className="text-xs uppercase tracking-[0.3em] text-brand-brass font-medium">
                AI Watch Finder
              </p>
            </div>

            <h2 className="font-display text-2xl text-brand-black mt-1">
              Find your perfect watch
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-black transition-colors"
            aria-label="Close AI Watch Finder"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">

          <p className="text-sm text-brand-gray mb-5">
            Tell us what you're looking for and our AI will recommend
            watches from our collection.
          </p>

          {/* Search */}
          <form
            onSubmit={handleRecommendation}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. affordable watch for fitness and daily use"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black"
            />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Finding..." : "Ask AI"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 mt-4">
              {error}
            </p>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display text-xl text-brand-black mb-5">
                Recommended for you
              </h3>

              <div className="space-y-4">
                {recommendations.map((recommendation) => {
                  const product = getProduct(recommendation.productId);

                  if (!product) {
                    return null;
                  }

                  return (
                    <div
                      key={recommendation.productId}
                      className="border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
                    >
                      {/* Product Image */}
                      <Link
                        to={`/product/${product.id}`}
                        onClick={onClose}
                        className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 overflow-hidden"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1">
                        <Link
                          to={`/product/${product.id}`}
                          onClick={onClose}
                        >
                          <h4 className="font-display text-xl text-brand-black hover:text-brand-brass transition-colors">
                            {product.name}
                          </h4>
                        </Link>

                        <p className="text-sm text-brand-gray mt-1">
                          ₹{product.price?.toLocaleString("en-IN")}
                        </p>

                        <p className="text-sm text-gray-600 mt-3">
                          {recommendation.reason}
                        </p>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWatchFinder;