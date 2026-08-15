import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="font-display text-4xl text-brand-black mb-2 text-center">Welcome Back</h1>
      <p className="text-brand-gray font-sans text-center mb-10">Log in to your TimeX account</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm uppercase tracking-widest text-brand-gray font-sans mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm uppercase tracking-widest text-brand-gray font-sans mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
          />
        </div>

        {error && <p className="text-red-600 text-sm font-sans">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-black text-white py-3 text-sm uppercase tracking-widest font-sans hover:bg-brand-brass transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="text-center text-sm text-brand-gray font-sans mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="text-brand-black underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;