import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty } from "../redux/cartSlice";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-brand-gray mb-4" />
        <h1 className="font-display text-3xl text-brand-black mb-2">Your cart is empty</h1>
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
      <h1 className="font-display text-4xl text-brand-black mb-10">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border-b border-gray-200 pb-6"
            >
              <div className="w-24 h-24 bg-gray-50 border border-gray-200 flex-shrink-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-brand-black">{item.name}</h3>
                  <p className="text-sm text-brand-gray font-sans">
                    ₹{item.price?.toLocaleString("en-IN")} each
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => dispatch(decreaseQty(item.id))}
                      className="p-2 hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-sans">{item.qty}</span>
                    <button
                      onClick={() => dispatch(increaseQty(item.id))}
                      className="p-2 hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <p className="font-sans text-brand-black w-20 text-right">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-brand-gray hover:text-red-600 transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 p-6 sticky top-24">
            <h2 className="font-display text-xl text-brand-black mb-4">Order Summary</h2>

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
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

           <Link
    to="/checkout"
    className="block w-full text-center bg-black text-white py-3">
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