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

      alert(
        err.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(
        `/orders/${id}/status?status=${encodeURIComponent(status)}`
      );

      await fetchOrders();
    } catch (err) {
      console.error(err);

      console.log("Status:", err.response?.status);
      console.log("Response:", err.response?.data);

      alert(
        err.response?.data?.message ||
          "Failed to update order"
      );
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

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">
                  Order ID
                </th>

                <th className="p-4 text-left">
                  Customer
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Payment
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b"
                >
                  <td className="p-4 font-medium">
                    #{order.id}
                  </td>

                  <td className="p-4">
                    {order.fullname || "Unknown"}
                  </td>

                  <td className="p-4">
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {order.paymentId || "-"}
                  </td>

                  <td className="p-4 capitalize">
                    {order.status?.toLowerCase()}
                  </td>

                  <td className="p-4">
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className="border rounded px-3 py-2"
                    >
                      <option value="PLACED">
                        Placed
                      </option>

                      <option value="SHIPPED">
                        Shipped
                      </option>

                      <option value="DELIVERED">
                        Delivered
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;