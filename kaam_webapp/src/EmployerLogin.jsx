import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const EmployerLogin = () => {
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError("");

      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google login successful:", decoded);

      // Send Google credential to backend
      const response = await fetch("http://localhost:5000/api/auth/employer/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem("employerToken", data.token);
        localStorage.setItem("employerData", JSON.stringify(data.user));
        localStorage.setItem("employerEmail", data.user.email);
        
        // Store profile data if available
        if (data.user.profile) {
          localStorage.setItem("employerProfile", JSON.stringify(data.user.profile));
        }
        
        if (data.user.isNewUser) {
          // Redirect to complete profile if new user
          navigate("/employer-register", { 
            state: { 
              isNewUser: true, 
              email: data.user.email,
              fullName: data.user.fullName,
              token: data.token 
            } 
          });
        } else {
          // Redirect to dashboard if existing user
          navigate("/employer-dashboard");
        }
      } else if (data.userNotFound) {
        // Redirect to registration not found page
        navigate("/registration-not-found", {
          state: {
            userType: "employer",
            email: data.user.email,
            fullName: data.user.fullName
          }
        });
      } else {
        setError(data.message || "Google authentication failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In failed. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (formData.email.trim() && formData.password.trim()) {
        // Try password-based login
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            userType: "employer",
          }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("employerToken", data.token);
          localStorage.setItem("employerData", JSON.stringify(data.user));
          localStorage.setItem("employerEmail", data.user.email);
          
          // Store profile data if available
          if (data.user.profile) {
            localStorage.setItem("employerProfile", JSON.stringify(data.user.profile));
          }
          
          navigate("/employer-dashboard");
        } else {
          setError(data.message || "Login failed");
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center mobile-no-scroll">
      <div className="container-responsive">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="text-5xl sm:text-6xl mb-4">🏢</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Employer Login
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Welcome back! Please sign in to your employer account
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Google Sign-In Button */}
            <div className="mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="100%"
                className="w-full"
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Password Login Form */}
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
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-base sm:text-lg"
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
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-base sm:text-lg"
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
                className="w-full btn-touch bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </span>
                ) : (
                  "Sign In with Password"
                )}
              </button>
            </form>

            {/* Info Section */}
            <div className="mt-6 sm:mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-orange-800 text-sm sm:text-base text-center">
                <strong>New users:</strong> Use Google Sign-In to create your account automatically
              </p>
              <p className="text-orange-800 text-sm sm:text-base text-center mt-2">
                <strong>Existing users:</strong> Use Google Sign-In or your password
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={() => navigate("/")}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm sm:text-base transition-colors duration-200"
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

export default EmployerLogin;
