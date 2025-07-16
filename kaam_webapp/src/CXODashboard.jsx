import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CXODashboard = () => {
  const [cxoData, setCxoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("cxoEmail");
    const storedData = localStorage.getItem("cxoData");

    console.log("🔍 CXO Dashboard: Email from localStorage:", email);
    console.log("🔍 CXO Dashboard: Stored data exists:", !!storedData);

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("🔍 CXO Dashboard: Parsed stored data:", parsedData);
      setCxoData(parsedData);
    } else if (email) {
      // Fetch data from backend if not in localStorage
      console.log("🔍 CXO Dashboard: Fetching data from backend for email:", email);
      fetch(`http://localhost:5000/api/executives/email/${encodeURIComponent(email)}`)
        .then(response => {
          console.log("🔍 CXO Dashboard: Backend response status:", response.status);
          return response.json();
        })
        .then(data => {
          console.log("🔍 CXO Dashboard: Backend data received:", data);
          setCxoData(data);
          localStorage.setItem("cxoData", JSON.stringify(data));
        })
        .catch(error => {
          console.error("❌ CXO Dashboard: Error fetching CXO data:", error);
        });
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cxoEmail");
    localStorage.removeItem("cxoData");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 mobile-no-scroll">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container-responsive">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-4 drop-shadow-lg">
                CXO Dashboard
              </h1>
              <p className="text-green-100 text-base sm:text-lg font-medium">
                Welcome back, {cxoData?.fullName || "Executive"}! 🧑‍💼
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-touch bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 transition-all duration-200 text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-responsive py-6 sm:py-8 lg:py-12">
        {cxoData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl sm:text-3xl font-bold">
                      {cxoData.fullName?.charAt(0)?.toUpperCase() || "C"}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {cxoData.fullName}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {cxoData.position} • {cxoData.company}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">📧</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-sm sm:text-base text-gray-900">{cxoData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">📱</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                      <p className="text-sm sm:text-base text-gray-900">{cxoData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">📍</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                      <p className="text-sm sm:text-base text-gray-900">{cxoData.currentLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Professional Information */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <span className="text-2xl mr-3">💼</span>
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Position</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Industry</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Experience</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.experience}</p>
                  </div>
                </div>
              </div>

              {/* Preferences & Contact */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <span className="text-2xl mr-3">📈</span>
                  Preferences & Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Preferred Location</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.preferredLocation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">LinkedIn Profile</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">
                      {cxoData.linkedinProfile ? (
                        <a 
                          href={cxoData.linkedinProfile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 underline"
                        >
                          View Profile
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button className="btn-touch bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 text-sm sm:text-base">
                    Update Profile
                  </button>
                  <button className="btn-touch bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm sm:text-base">
                    Post Job
                  </button>
                  <button className="btn-touch bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-sm sm:text-base">
                    View Candidates
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl sm:text-8xl mb-4">🧑‍💼</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Welcome to Your Executive Dashboard!
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
              Your profile information will appear here once you complete your registration.
            </p>
            <button
              onClick={() => navigate("/executive-register")}
              className="btn-touch bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 text-base sm:text-lg"
            >
              Complete Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CXODashboard; 