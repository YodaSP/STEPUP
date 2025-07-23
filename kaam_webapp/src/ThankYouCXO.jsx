import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYouCXO = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center mobile-no-scroll">
      <div className="container-responsive">
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          <div className="text-6xl sm:text-7xl mb-6">🎉</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-700 mb-4">Thank you for registering as a CXO!</h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Your registration was successful.<br />
            You can now proceed to login and access your CXO dashboard.
          </p>
          <button
            onClick={() => navigate("/cxo-login")}
            className="btn-touch bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold rounded-full px-8 py-4 text-lg shadow-lg transition-all duration-200"
          >
            Proceed to CXO Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouCXO; 