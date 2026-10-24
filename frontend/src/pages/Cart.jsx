import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCartQuantity,
  deleteCartItem,
} from "../redux/cartSlice";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  const changeQuantity = async (item, quantity) => {
    if (quantity < 1) return;

    try {
      await dispatch(
        updateCartQuantity({
          productId: item.id,
          quantity,
        })
      ).unwrap();
    } catch (err) {
      alert(typeof err === "string" ? err : "Failed to update quantity.");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await dispatch(deleteCartItem(itemId)).unwrap();
    } catch (err) {
      alert(typeof err === "string" ? err : "Failed to remove item.");
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-brand-gray font-sans">Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-brand-gray mb-4" />
        <h1 className="font-display text-3xl text-brand-black mb-2">
          Your cart is empty
        </h1>
        <p className="text-brand-gray font-sans mb-8">
          Looks like you haven't added a watch yet.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-brand-black text-white px-8 py-3 text-sm uppercase tracking-widest font-sans hover:bg-brand-brass transition-colors"
        >
          Browse Watches
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl text-brand-black mb-10">
        Your Cart
      </h1>

      {error && (
        <p className="mb-4 text-sm text-red-600">
          {typeof error === "string" ? error : "Something went wrong with your cart."}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border-b border-gray-200 pb-6"
            >
              <div className="w-24 h-24 bg-gray-50 border border-gray-200 flex-shrink-0 overflow-hidden">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/images/${item.imageUrl}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-brand-black">
                    {item.name}
                  </h3>
                  <p className="text-sm text-brand-gray font-sans">
                    ₹{Number(item.price).toLocaleString("en-IN")} each
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => changeQuantity(item, item.qty - 1)}
                      disabled={loading || item.qty <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>

                    <span className="w-8 text-center text-sm font-sans">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => changeQuantity(item, item.qty + 1)}
                      disabled={loading}
                      className="p-2 hover:bg-gray-100 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <p className="font-sans text-brand-black w-20 text-right">
                    ₹{(Number(item.price) * item.qty).toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={loading}
                    className="text-brand-gray hover:text-red-600 transition-colors disabled:opacity-40"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gray-200 p-6 sticky top-24">
            <h2 className="font-display text-xl text-brand-black mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm font-sans text-brand-gray mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="flex justify-between font-sans text-brand-black text-lg border-t border-gray-200 pt-4 mb-6">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full text-center bg-black text-white py-3 hover:bg-brand-brass transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="block text-center w-full text-sm text-brand-gray hover:text-brand-black font-sans mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;