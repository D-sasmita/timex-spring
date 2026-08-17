import { useEffect, useState } from "react";
import API from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
} from "lucide-react";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get("/analytics");
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Revenue",
      value: `₹${Number(analytics.totalRevenue).toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      bg: "bg-green-500",
    },
    {
      title: "Orders",
      value: analytics.totalOrders,
      icon: <ShoppingBag className="w-8 h-8" />,
      bg: "bg-blue-500",
    },
    {
      title: "Products",
      value: analytics.totalProducts,
      icon: <Package className="w-8 h-8" />,
      bg: "bg-purple-500",
    },
    {
      title: "Users",
      value: analytics.totalUsers,
      icon: <Users className="w-8 h-8" />,
      bg: "bg-orange-500",
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-10">
        Dashboard
      </h1>

      {loading ? (
        <div className="text-lg">
          Loading analytics...
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`${card.bg} text-white p-6`}>
                  {card.icon}
                </div>

                <div className="p-6">
                  <p className="text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {card.value}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">
              Overview
            </h2>

            <p className="text-gray-600 leading-8">
              Welcome to the TimeX Admin Dashboard.
              Here you can monitor orders, products,
              customers and revenue. Use the navigation
              menu to manage the store.
            </p>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;