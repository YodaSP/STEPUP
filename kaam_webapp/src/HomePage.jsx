import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="py-6 px-8 bg-white shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <h1
            className="text-3xl md:text-4xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            STEPUP
          </h1>

          {/* Right: Navigation */}
          <nav className="space-x-6 text-sm md:text-base">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Admin Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Gateway to Your Dream Job
          </h2>
          <p className="text-lg md:text-xl text-blue-100">
            Connect with top employers and find opportunities that match your skills.
            Start your journey today by registering your profile.
          </p>
        </div>
      </section>

      {/* CTA Cards */}
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 p-8 -mt-20">
          {/* Student Card */}
          <div
            onClick={() => navigate("/student-register")}
            className="cursor-pointer border border-gray-200 rounded-2xl bg-white p-8 shadow hover:shadow-lg transition duration-300 hover:border-blue-500"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              I am a Student
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Register and explore job opportunities suited for your skills and education.
            </p>
            <button className="mt-2 text-blue-600 font-medium hover:underline">
              Register as Student →
            </button>
          </div>

          {/* Executive Card */}
          <div
            onClick={() => navigate("/executive-register")}
            className="cursor-pointer border border-gray-200 rounded-2xl bg-white p-8 shadow hover:shadow-lg transition duration-300 hover:border-green-500"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              I am a Company Executive
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Register yourself if you are a Company executive.
            </p>
            <button className="mt-2 text-green-600 font-medium hover:underline">
              Register as Executive →
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t text-sm text-gray-500 text-center py-4">
        &copy; {new Date().getFullYear()} STEPUP. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
