import { useEffect, useState } from "react";
import API from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data);
    } catch (err) {
      console.error(err);
      

  console.log("Status:", err.response?.status);
  console.log("Response:", err.response?.data);

  alert(err.response?.data?.message || "Failed to load orders");

    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, {
        status,
      });

      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <h2 className="text-2xl font-bold">
          Loading Orders...
        </h2>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8">
        Manage Orders
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.orderId}
                className="border-b"
              >
                <td className="p-4">
                  #{order.orderId.slice(-8)}
                </td>

                <td className="p-4">
                  {order.user?.username || "Unknown"}
                </td>

                <td className="p-4">
                  ₹{order.totalAmount}
                </td>

                <td className="p-4 capitalize">
                  {order.status}
                </td>

                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order.orderId,
                        e.target.value
                      )
                    }
                    className="border rounded px-3 py-2"
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Orders;