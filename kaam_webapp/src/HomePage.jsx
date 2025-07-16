import React, { useRef } from "react";
import Lottie from "lottie-react";
import animationData from "./assets/animation.json";
import { useNavigate } from "react-router-dom";

const cardData = [
  {
    title: "I am a Student",
    description:
      "Register and explore job opportunities suited for your skills and education.",
    button: "Register as Student →",
    color: "blue",
    route: "/student-register",
  },
  {
    title: "I am a CXO",
    description: "Register yourself if you are a CXO.",
    button: "Register as CXO →",
    color: "green",
    route: "/executive-register",
  },
  {
    title: "I am an Employer",
    description:
      "Register your company to post job openings and find the right talent.",
    button: "Register as Employer →",
    color: "purple",
    route: "/employer-register",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const secondSectionRef = useRef(null);

  const scrollToSecondSection = () => {
    secondSectionRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 relative mobile-no-scroll">
      {/* Login Buttons - Responsive Header */}
      <header className="w-full fixed top-0 left-0 z-30 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="container-responsive">
          <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 space-y-2 sm:space-y-0">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                <span className="text-blue-600">StepUp</span>
              </h1>
            </div>
            
            {/* Login Buttons */}
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/student-login")}
                className="btn-touch bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-sm text-sm sm:text-base px-3 sm:px-4"
              >
                Student Login
              </button>
              <button
                onClick={() => navigate("/cxo-login")}
                className="btn-touch bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-sm text-sm sm:text-base px-3 sm:px-4"
              >
                CXO Login
              </button>
              <button
                onClick={() => navigate("/admin-login")}
                className="btn-touch bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-full shadow-sm text-sm sm:text-base px-3 sm:px-4"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to avoid content hiding behind fixed header */}
      <div className="h-16 sm:h-20" />

      {/* Intro Section - Fully Responsive */}
      <section className="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-between py-8 sm:py-12 lg:py-16 xl:py-24">
        <div className="container-responsive">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16">
            {/* Text Content */}
            <div className="flex-1 space-y-6 sm:space-y-8 text-center lg:text-left max-w-xl lg:max-w-2xl">
              <h1 className="heading-responsive font-extrabold text-gray-900 leading-tight tracking-tight">
                Welcome to <span className="text-blue-600">StepUp</span>
              </h1>
              <p className="text-responsive text-gray-700 leading-relaxed">
                Empowering students and executives to take their careers to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <span className="bg-blue-100 rounded-full px-4 py-2 text-sm sm:text-base font-medium text-gray-800">
                  🎓 <strong>25,000+</strong> Students Registered
                </span>
                <span className="bg-green-100 rounded-full px-4 py-2 text-sm sm:text-base font-medium text-gray-800">
                  🧑‍💼 <strong>10,000+</strong> CXOs Onboarded
                </span>
              </div>
              <button
                onClick={scrollToSecondSection}
                className="btn-touch mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-200 text-base sm:text-lg w-full sm:w-auto"
              >
                Click to Register Now
              </button>
            </div>

            {/* Animation */}
            <div className="flex-1 w-full flex justify-center lg:justify-end max-w-xs sm:max-w-sm lg:max-w-md">
              <div className="rounded-full bg-gradient-to-tr from-blue-100 via-white to-purple-100 p-4 sm:p-6 shadow-xl w-full max-w-[280px] sm:max-w-[320px]">
                <Lottie
                  animationData={animationData}
                  loop
                  style={{ width: "100%", height: "auto" }}
                  aria-label="Welcome animation"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section: Gateway + Cards - Responsive Grid */}
      <section
        ref={secondSectionRef}
        className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white py-12 sm:py-16 lg:py-20"
      >
        <div className="container-responsive">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 drop-shadow-lg">
              Welcome to STEPUP - Your Gateway to Interim Jobs
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10 sm:mb-14 leading-relaxed">
              Connect with top employers and find opportunities that match your skills.
              Start your journey today by registering your profile.
            </p>

            {/* CTA Cards container - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {cardData.map((card, idx) => (
                <div
                  key={card.title}
                  onClick={() => navigate(card.route)}
                  className={`
                    cursor-pointer rounded-2xl sm:rounded-3xl bg-white/90 p-6 sm:p-8 flex flex-col items-center h-full
                    shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2
                    border-transparent hover:border-${card.color}-500
                    text-gray-800 transform hover:-translate-y-1
                  `}
                  style={{
                    minHeight: '280px',
                    boxShadow:
                      idx === 1
                        ? "0 8px 32px 0 rgba(34,197,94,0.15)"
                        : idx === 2
                        ? "0 8px 32px 0 rgba(168,85,247,0.15)"
                        : "0 8px 32px 0 rgba(59,130,246,0.15)",
                  }}
                >
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 text-center">
                    {card.title}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-6 flex-1 text-center leading-relaxed">
                    {card.description}
                  </p>
                  <button
                    className={`
                      btn-touch px-4 sm:px-5 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base
                      bg-gradient-to-r from-${card.color}-500 to-${card.color}-600
                      text-white shadow hover:from-${card.color}-600 hover:to-${card.color}-700
                      transition-all duration-200 w-full sm:w-auto
                    `}
                  >
                    {card.button}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Responsive */}
      <footer className="bg-white border-t border-gray-200 text-xs sm:text-sm text-gray-500 text-center py-4 sm:py-6">
        <div className="container-responsive">
          &copy; {new Date().getFullYear()} STEPUP. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
