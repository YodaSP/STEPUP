import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CXOLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // For demo purposes, accept any non-empty email and password
      if (formData.email.trim() && formData.password.trim()) {
        // Store email in localStorage for demo
        localStorage.setItem("cxoEmail", formData.email);
        
        // Fetch CXO details from backend
        console.log("🔍 CXO Login: Fetching data for email:", formData.email);
        const response = await fetch(`http://localhost:5000/api/executives/email/${encodeURIComponent(formData.email)}`);
        
        console.log("🔍 CXO Login: Response status:", response.status);
        
        if (response.ok) {
          const cxoData = await response.json();
          console.log("🔍 CXO Login: Data received:", cxoData);
          localStorage.setItem("cxoData", JSON.stringify(cxoData));
          navigate("/cxo-dashboard");
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.log("❌ CXO Login: Error response:", errorData);
          console.log("CXO not found, but proceeding with demo login");
          navigate("/cxo-dashboard");
        }
      } else {
        setError("Please enter both email and password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center mobile-no-scroll">
      <div className="container-responsive">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="text-5xl sm:text-6xl mb-4">🧑‍💼</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              CXO Login
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Welcome back! Please sign in to your executive account
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm sm:text-base font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm sm:text-base font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <p className="text-red-600 text-sm sm:text-base">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-touch bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 sm:mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-sm sm:text-base text-center">
                <strong>Demo:</strong> Enter any email and password to login
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={() => navigate("/")}
                className="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base transition-colors duration-200"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CXOLogin; 