import React, { useState } from "react";

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      console.log("Attempting admin login with:", formData.username);
      
      // For demo purposes, accept admin/admin
      if (formData.username === "admin" && formData.password === "admin") {
        console.log("Admin login successful, calling onLogin...");
        onLogin();
        console.log("onLogin called successfully");
      } else {
        console.log("Invalid credentials provided");
        setError("Invalid credentials. Use admin/admin for demo.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center mobile-no-scroll">
      <div className="container-responsive">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="text-5xl sm:text-6xl mb-4">🔐</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Admin Login
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Access the administrative dashboard
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm sm:text-base font-semibold text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-gray-500 focus:ring-4 focus:ring-gray-100 transition-all duration-200 text-base sm:text-lg"
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
                  placeholder="Enter password"
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-gray-500 focus:ring-4 focus:ring-gray-100 transition-all duration-200 text-base sm:text-lg"
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
                className="w-full btn-touch bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-800 text-sm sm:text-base text-center">
                <strong>Demo:</strong> Username: admin, Password: admin
              </p>
            </div>

            {/* Debug Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-xs text-center">
                <strong>Debug:</strong> Check browser console for login details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
