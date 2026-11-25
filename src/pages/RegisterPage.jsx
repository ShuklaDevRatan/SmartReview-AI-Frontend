import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, User, Mail, Lock, ArrowRight } from "lucide-react";
import { registerUser } from "../services/authService";

function RegisterPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      await registerUser(formData);

      navigate("/login");

    } catch (error) {

      setError(
        error.response?.data?.message || "Registration failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFCF7] px-5 py-10">

      <div className="w-full max-w-md rounded-[32px] border border-purple-100 bg-white p-8 shadow-xl shadow-purple-100 sm:p-10">

        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#7557D9] to-[#A16BE8] text-white">
            <Sparkles size={30} />
          </div>

          <h1 className="text-3xl font-extrabold">
            Join SmartReview<span className="text-[#7557D9]">.</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your account and grow your business.
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-bold">
              Full Name
            </label>

            <div className="flex items-center rounded-2xl border border-gray-200 px-4">

              <User size={19} className="text-gray-400" />

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full bg-transparent p-4 outline-none"
                required
              />

            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Email Address
            </label>

            <div className="flex items-center rounded-2xl border border-gray-200 px-4">

              <Mail size={19} className="text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-transparent p-4 outline-none"
                required
              />

            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Password
            </label>

            <div className="flex items-center rounded-2xl border border-gray-200 px-4">

              <Lock size={19} className="text-gray-400" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                minLength={8}
                className="w-full bg-transparent p-4 outline-none"
                required
              />

            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7557D9] to-[#A16BE8] py-4 font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-1 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight size={19} />}
          </button>

        </form>

        <p className="mt-7 text-center text-sm text-gray-500">

          Already have an account?{" "}

          <Link to="/login" className="font-bold text-[#7557D9]">
            Login
          </Link>

        </p>

      </div>

    </main>
  );
}

export default RegisterPage;