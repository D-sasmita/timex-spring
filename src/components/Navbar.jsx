import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      navigate("/shop");
      return;
    }

    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/Black and White Minimalist Watch Store Logo.png"
              alt="TimeX"
              className="h-10 w-10 object-contain"
            />

            <span className="text-2xl font-bold tracking-widest text-brand-black">
              TIMEX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm uppercase tracking-widest text-brand-black hover:text-brand-gray transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-xs mx-6"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search watches..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />

              <button
                type="submit"
                className="absolute left-3 top-2.5"
                aria-label="Search"
              >
                <Search className="h-4 w-4 text-gray-400 hover:text-black" />
              </button>
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center space-x-5">

            {user ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  to="/orders"
                  className="text-sm uppercase tracking-widest text-brand-black hover:text-brand-gray transition-colors"
                >
                  My Orders
                </Link>

                <span className="text-sm font-medium text-brand-black">
                  {user.username}
                </span>

                <button
                  onClick={logout}
                  className="text-xs uppercase tracking-widest text-brand-gray hover:text-brand-black"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:block text-brand-black hover:text-brand-gray"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-brand-black hover:text-brand-gray"
            >
              <ShoppingBag className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-brand-black"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search watches..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
            />

            <button
              type="submit"
              className="absolute left-3 top-2.5"
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-gray-400" />
            </button>
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-sm uppercase tracking-widest text-brand-black py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to="/orders"
                className="block text-sm uppercase tracking-widest text-brand-black py-1"
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </Link>

              <div className="text-sm text-brand-gray py-1">
                Logged in as <strong>{user.username}</strong>
              </div>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block text-sm uppercase tracking-widest text-brand-black py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-sm uppercase tracking-widest text-brand-black py-1"
              onClick={() => setMenuOpen(false)}
            >
              Login / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;