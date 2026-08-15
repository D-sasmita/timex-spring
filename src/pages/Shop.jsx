import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import API from "../api/axios";
import { ShoppingBag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const CATEGORIES = ["All", "Men", "Women", "Unisex"];

const Shop = () => {
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await API.get("/products");

        setProducts(res.data);
        setError(null);
      } catch (err) {
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-brass font-sans font-medium mb-2">
          Full Collection
        </p>

        <h1 className="font-display text-4xl sm:text-5xl text-brand-black">
          Shop Watches
        </h1>

        {searchQuery && (
          <p className="mt-3 text-sm text-brand-gray">
            Search results for{" "}
            <span className="font-medium text-brand-black">
              "{searchQuery}"
            </span>
          </p>
        )}
      </div>

      {/* Category filter */}
      <div className="flex justify-center gap-6 mb-10 border-b border-gray-200 pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm uppercase tracking-widest font-sans pb-1 border-b-2 transition-colors ${
              activeCategory === cat
                ? "border-brand-black text-brand-black"
                : "border-transparent text-brand-gray hover:text-brand-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-brand-gray font-sans py-16">
          Loading watches...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-600 font-sans py-16">
          {error}
        </p>
      )}

      {/* No products found */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-brand-gray font-sans">
            {searchQuery
              ? `No watches found for "${searchQuery}".`
              : "No watches found in this category yet."}
          </p>

          {searchQuery && (
            <button
              onClick={clearSearch}
              className="mt-4 border border-black px-5 py-2 text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Product grid */}
      {!loading &&
        !error &&
        filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">

                {/* Product Image */}
                <Link
                  to={`/product/${product.id}`}
                  className="block aspect-square bg-gray-50 border border-gray-200 mb-4 overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-display text-xl text-brand-black hover:text-brand-brass transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-brand-gray font-sans mt-1">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-1 p-2 border border-brand-black hover:bg-brand-black hover:text-white transition-colors"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default Shop;