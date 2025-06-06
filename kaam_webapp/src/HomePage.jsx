import React, { useRef } from "react";
import Lottie from "lottie-react";
import animationData from "./assets/animation.json"; 
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const secondSectionRef = useRef(null);

  const scrollToSecondSection = () => {
    secondSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Intro Section with Animation */}
      <section className="min-h-screen bg-white flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-16 py-20">
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Welcome to <span className="text-blue-600">StepUp</span>
          </h1>
          <p className="text-lg text-gray-700">
            Empowering students and executives to take their careers to the next level.
          </p>
          <p className="text-md text-gray-800 font-medium">
            🎓 <strong>25,000+</strong> Students Registered<br />
            🧑‍💼 <strong>10,000+</strong> CXOs Onboarded
          </p>
          <button
            onClick={scrollToSecondSection}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition"
          >
            Click to Register Now
          </button>
        </div>

        <div className="md:w-1/2 w-full mb-10 md:mb-0 flex justify-center">
          <Lottie
            animationData={animationData}
            loop
            style={{ height: 300, width: 300 }}
            aria-label="Welcome animation"
          />
        </div>
      </section>

      {/* Second Section: Hero + Admin Login + CTA Cards */}
      <section
        ref={secondSectionRef}
        className="bg-blue-600 text-white py-12 md:py-16 px-4 md:px-6 relative"
      >
        {/* Admin Login Button in top-right corner */}
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="absolute top-4 right-4 bg-white text-blue-600 font-semibold py-1 px-3 rounded shadow hover:bg-gray-100 transition"
        >
          Admin Login
        </button>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Welcome to STEPUP - Your Gateway to Interim Jobs
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-12">
            Connect with top employers and find opportunities that match your skills.
            Start your journey today by registering your profile.
          </p>

          {/* CTA Cards container */}
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Student Card */}
            <div
              onClick={() => navigate("/student-register")}
              className="cursor-pointer border border-gray-200 rounded-2xl bg-white p-6 md:p-8 shadow hover:shadow-lg transition duration-300 hover:border-blue-500 text-gray-800"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                I am a Student
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Register and explore job opportunities suited for your skills and education.
              </p>
              <button className="mt-2 text-blue-600 font-medium hover:underline">
                Register as Student →
              </button>
            </div>

            {/* Executive Card */}
            <div
              onClick={() => navigate("/executive-register")}
              className="cursor-pointer border border-gray-200 rounded-2xl bg-white p-6 md:p-8 shadow hover:shadow-lg transition duration-300 hover:border-green-500 text-gray-800"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                I am a CXO
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Register yourself if you are a CXO.
              </p>
              <button className="mt-2 text-green-600 font-medium hover:underline">
                Register as CXO →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t text-xs sm:text-sm text-gray-500 text-center py-4">
        &copy; {new Date().getFullYear()} STEPUP. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
