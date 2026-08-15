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
      const res = await API.get("/orders/myorders");
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
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
      <div className="py-20 text-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-display mb-10">My Orders</h1>

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
              key={order.orderId}
              className="bg-white border rounded-xl shadow-md p-6"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Order #{order.orderId.slice(-8)}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Shipping Address
                </h3>

                <div className="text-gray-700 leading-7">
                  <p className="font-medium">{order.address.fullname}</p>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state}
                  </p>
                  <p>
                    {order.address.postalCode}, {order.address.country}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="border-t pt-5">
                <h3 className="text-lg font-semibold mb-4">
                  Ordered Items ({order.items.length})
                </h3>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.productId?.id || item.productId}
                      className="flex justify-between items-center border rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {item.productId?.name || "Product"}
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>

                        <p className="text-sm text-gray-500">
                          ₹{item.price} each
                        </p>
                      </div>

                      <div className="font-semibold text-lg">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;