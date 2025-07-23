import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center mobile-no-scroll">
      <div className="container-responsive">
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          <div className="text-6xl sm:text-7xl mb-6">🎉</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Thank you for registering!</h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Your registration was successful.<br />
            You can now proceed to login and access your student dashboard.
          </p>
          <button
            onClick={() => navigate("/student-login")}
            className="btn-touch bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full px-8 py-4 text-lg shadow-lg transition-all duration-200"
          >
            Proceed to Student Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou; 