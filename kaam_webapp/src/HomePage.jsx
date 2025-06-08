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
    secondSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Login Buttons */}
      <header className="w-full fixed top-0 left-0 z-30 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm flex justify-end items-center px-6 md:px-20 py-4 space-x-3">
        <button
          onClick={() => navigate("/student-login")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow text-sm"
        >
          Student Login
        </button>
        <button
          onClick={() => navigate("/cxo-login")}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow text-sm"
        >
          CXO Login
        </button>
        <button
          onClick={() => navigate("/admin-login")}
          className="px-5 py-2 bg-black hover:bg-gray-900 text-white font-semibold rounded-full shadow text-sm"
        >
          Admin Login
        </button>
      </header>

      {/* Spacer to avoid content hiding behind fixed header */}
      <div className="h-16" />

      {/* Intro Section */}
      <section className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-16 md:py-24 max-w-7xl mx-auto w-full">
        {/* Text Content */}
        <div className="flex-1 space-y-7 text-center md:text-left max-w-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Welcome to <span className="text-blue-600">StepUp</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Empowering students and executives to take their careers to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start text-base font-medium text-gray-800">
            <span className="bg-blue-100 rounded-full px-4 py-1">
              🎓 <strong>25,000+</strong> Students Registered
            </span>
            <span className="bg-green-100 rounded-full px-4 py-1">
              🧑‍💼 <strong>10,000+</strong> CXOs Onboarded
            </span>
          </div>
          <button
            onClick={scrollToSecondSection}
            className="mt-7 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-200 text-lg"
          >
            Click to Register Now
          </button>
        </div>

        {/* Animation */}
        <div className="flex-1 w-full mb-10 md:mb-0 flex justify-center max-w-xs">
          <div className="rounded-full bg-gradient-to-tr from-blue-100 via-white to-purple-100 p-4 shadow-xl w-full">
            <Lottie
              animationData={animationData}
              loop
              style={{ width: "100%", height: "auto", maxWidth: 320 }}
              aria-label="Welcome animation"
            />
          </div>
        </div>
      </section>

      {/* Second Section: Gateway + Cards */}
      <section
        ref={secondSectionRef}
        className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white py-16 px-4 pb-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to STEPUP - Your Gateway to Interim Jobs
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-14">
            Connect with top employers and find opportunities that match your skills.
            Start your journey today by registering your profile.
          </p>

          {/* CTA Cards container */}
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {cardData.map((card, idx) => (
              <div
                key={card.title}
                onClick={() => navigate(card.route)}
                className={`
                  cursor-pointer rounded-3xl bg-white/90 p-8 flex flex-col items-center h-full
                  shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2
                  border-transparent hover:border-${card.color}-500
                  text-gray-800
                `}
                style={{
                  minHeight: 280,
                  boxShadow:
                    idx === 1
                      ? "0 8px 32px 0 rgba(34,197,94,0.15)"
                      : idx === 2
                      ? "0 8px 32px 0 rgba(168,85,247,0.15)"
                      : "0 8px 32px 0 rgba(59,130,246,0.15)",
                }}
              >
                <h2 className="text-xl font-bold mb-3 text-gray-900">{card.title}</h2>
                <p className="text-gray-600 text-base mb-6 flex-1">{card.description}</p>
                <button
                  className={`
                    px-5 py-2 rounded-full font-semibold text-sm
                    bg-gradient-to-r from-${card.color}-500 to-${card.color}-600
                    text-white shadow hover:from-${card.color}-600 hover:to-${card.color}-700
                    transition
                  `}
                >
                  {card.button}
                </button>
              </div>
            ))}
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
