import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/orders/my-orders");

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load orders:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "placed":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-lg">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600 text-lg mb-4">
          {error}
        </p>

        <button
          onClick={fetchOrders}
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">

      <h1 className="text-4xl font-display mb-10">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 border rounded-lg shadow-sm">

          <p className="text-gray-600 text-lg mb-6">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/shop"
            className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>

        </div>
      ) : (
        <div className="space-y-8">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white border rounded-xl shadow-md p-6"
            >

              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">

                <div>
                  <h2 className="text-2xl font-bold">
                    Order #{order.id}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "Date unavailable"}
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-3xl font-bold">
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toFixed(2)}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>

                </div>

              </div>

              {/* Shipping Address */}
              <div className="mb-6">

                <h3 className="text-lg font-semibold mb-3">
                  Shipping Address
                </h3>

                <div className="text-gray-700 leading-7">

                  <p className="font-medium">
                    {order.fullname || "N/A"}
                  </p>

                  <p>
                    {order.street || ""}
                  </p>

                  <p>
                    {order.city || ""}
                    {order.city && order.state
                      ? ", "
                      : ""}
                    {order.state || ""}
                  </p>

                  <p>
                    {order.postalCode || ""}
                    {order.postalCode &&
                    order.country
                      ? ", "
                      : ""}
                    {order.country || ""}
                  </p>

                </div>

              </div>

              {/* Ordered Items */}
              <div className="border-t pt-5">

                <h3 className="text-lg font-semibold mb-4">
                  Ordered Items (
                  {order.items?.length || 0})
                </h3>

                {order.items?.length > 0 ? (

                  <div className="space-y-3">

                    {order.items.map((item, index) => {

                      const quantity =
                        Number(item.quantity || 0);

                      const price =
                        Number(item.price || 0);

                      return (
                        <div
                          key={item.id || index}
                          className="flex justify-between items-center border rounded-lg p-4"
                        >

                          <div>

                          <p className="font-medium">
                               {item.productName || "Product"}
                          </p>

                            <p className="text-sm text-gray-500">
                              Qty: {quantity}
                            </p>

                            <p className="text-sm text-gray-500">
                              ₹{price.toFixed(2)} each
                            </p>

                          </div>

                          <div className="font-semibold text-lg">
                            ₹
                            {(price * quantity).toFixed(2)}
                          </div>

                        </div>
                      );

                    })}

                  </div>

                ) : (

                  <p className="text-gray-500">
                    No items found for this order.
                  </p>

                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default MyOrders;