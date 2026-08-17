import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Sparkles } from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIWatchFinder from "./components/AIWatchFinder";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";

import { AuthProvider } from "./context/AuthContext";

function Layout() {
  const location = useLocation();
  const [aiOpen, setAiOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>

        {/* ==================== CUSTOMER ROUTES ==================== */}

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/product/:id"
          element={<ProductDetail />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/orders" element={<MyOrders />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />


        {/* ==================== ADMIN ROUTES ==================== */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/new"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/:id/edit"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />

      </Routes>


      {/* ==================== AI WATCH FINDER ==================== */}

      {!isAdminRoute && (
        <>
          <button
            onClick={() => setAiOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-black text-white px-5 py-3 shadow-lg hover:bg-gray-800 transition-colors"
            aria-label="Open AI Watch Finder"
          >
            <Sparkles className="h-4 w-4" />

            <span className="text-xs uppercase tracking-widest">
              Ask AI
            </span>
          </button>

          <AIWatchFinder
            isOpen={aiOpen}
            onClose={() => setAiOpen(false)}
          />
        </>
      )}


      {/* ==================== FOOTER ==================== */}

      {!isAdminRoute && <Footer />}

    </>
  );
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;