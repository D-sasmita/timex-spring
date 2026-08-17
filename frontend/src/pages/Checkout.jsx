import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    // Check cart
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Check address fields
    if (
      !fullName.trim() ||
      !shippingAddress.trim() ||
      !city.trim() ||
      !state.trim() ||
      !postalCode.trim() ||
      !country.trim()
    ) {
      alert("Please fill in all delivery details.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.qty,
          price: item.price,
        })),

        totalAmount: totalPrice,

        address: {
          fullname: fullName,
          street: shippingAddress,
          city: city,
          state: state,
          postalCode: postalCode,
          country: country,
        },

        paymentId: "COD",
      };

      console.log("Order Payload:", payload);

      const response = await API.post("/orders", payload);

      console.log("Order Created:", response.data);

      // Clear cart only after successful order
      dispatch(clearCart());

      // Go to orders page
      navigate("/orders");

    } catch (err) {
      console.error("Order Error:", err);

      alert(
        err.response?.data?.message ||
        "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">

      <h1 className="text-4xl font-display mb-8">
        Checkout
      </h1>

      {/* Delivery Details */}
      <div className="space-y-5">

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Street Address"
          className="w-full border p-3"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          className="w-full border p-3"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="text"
          placeholder="State"
          className="w-full border p-3"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />

        <input
          type="text"
          placeholder="Postal Code"
          className="w-full border p-3"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        <input
          type="text"
          placeholder="Country"
          className="w-full border p-3"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        {/* Order Summary */}
        <div className="border-t pt-6">

          <h2 className="text-2xl mb-4">
            Order Summary
          </h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between py-2"
            >
              <span>
                {item.name} × {item.qty}
              </span>

              <span>
                ₹{(item.price * item.qty).toLocaleString("en-IN")}
              </span>
            </div>
          ))}

          <div className="flex justify-between font-bold text-lg mt-6">
            <span>Total</span>

            <span>
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading || cartItems.length === 0}
            className="w-full mt-8 bg-black text-white py-3 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;