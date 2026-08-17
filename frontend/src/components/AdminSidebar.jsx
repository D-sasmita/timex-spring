import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  PlusCircle,
} from "lucide-react";

const AdminSidebar = () => {
  const { pathname } = useLocation();

  const links = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingBag size={20} />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package size={20} />,
    },
    {
      name: "Add Product",
      path: "/admin/products/new",
      icon: <PlusCircle size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-10">
        TimeX Admin
      </h1>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === link.path
                ? "bg-white text-black"
                : "hover:bg-gray-800"
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;