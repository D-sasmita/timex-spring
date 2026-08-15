import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="font-display text-4xl text-brand-black mb-2 text-center">Create Account</h1>
      <p className="text-brand-gray font-sans text-center mb-10">Join TimeX today</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm uppercase tracking-widest text-brand-gray font-sans mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
          />
        </div>

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
            minLength={6}
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
          />
        </div>

        {error && <p className="text-red-600 text-sm font-sans">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-black text-white py-3 text-sm uppercase tracking-widest font-sans hover:bg-brand-brass transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm text-brand-gray font-sans mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-black underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;