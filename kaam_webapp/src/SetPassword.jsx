import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { email, userType, fullName } = location.state || {};

  useEffect(() => {
    if (!email || !userType) {
      navigate("/");
    }
  }, [email, userType, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: formData.password,
          userType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Password set successfully! You can now use both Google Sign-In and password login.");
        setTimeout(() => {
          // Redirect based on user type
          switch (userType) {
            case "student":
              navigate("/student-dashboard");
              break;
            case "executive":
              navigate("/cxo-dashboard");
              break;
            case "employer":
              navigate("/employer-dashboard");
              break;
            default:
              navigate("/");
          }
        }, 2000);
      } else {
        setError(data.message || "Failed to set password");
      }
    } catch (error) {
      console.error("Set password error:", error);
      setError("Failed to set password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const skipPassword = () => {
    // Redirect based on user type without setting password
    switch (userType) {
      case "student":
        navigate("/student-dashboard");
        break;
      case "executive":
        navigate("/cxo-dashboard");
        break;
      case "employer":
        navigate("/employer-dashboard");
        break;
      default:
        navigate("/");
    }
  };

  if (!email || !userType) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center mobile-no-scroll">
      <div className="container-responsive">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="text-5xl sm:text-6xl mb-4">🔐</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Set Password
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Welcome, {fullName || email}! Set a password for additional security
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                  required
                />
                <p className="text-sm text-gray-500">Enter your desired password</p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm sm:text-base font-semibold text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <p className="text-red-600 text-sm sm:text-base">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <p className="text-green-600 text-sm sm:text-base">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-touch bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Setting Password...
                  </span>
                ) : (
                  "Set Password"
                )}
              </button>

              {/* Skip Button */}
              <button
                type="button"
                onClick={skipPassword}
                className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 text-base sm:text-lg"
              >
                Skip for Now
              </button>
            </form>

            {/* Info Section */}
            <div className="mt-6 sm:mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm sm:text-base text-center">
                <strong>Why set a password?</strong> You can still use Google Sign-In, but having a password provides an additional login option and enhances security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
