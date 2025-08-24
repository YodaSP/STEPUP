import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";

const RegistrationNotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { userType, email, fullName } = location.state || {};

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Simulate animation loading
    const animTimer = setTimeout(() => setAnimationLoaded(true), 500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(animTimer);
    };
  }, []);

  const handleRegister = () => {
    // Navigate to appropriate registration page
    switch (userType) {
      case "student":
        navigate("/student-register", { 
          state: { 
            isNewUser: true, 
            email: email,
            fullName: fullName,
            fromGoogle: true
          } 
        });
        break;
      case "executive":
        navigate("/executive-register", { 
          state: { 
            isNewUser: true, 
            email: email,
            fullName: fullName,
            fromGoogle: true
          } 
        });
        break;
      case "employer":
        navigate("/employer-register", { 
          state: { 
            isNewUser: true, 
            email: email,
            fullName: fullName,
            fromGoogle: true
          } 
        });
        break;
      default:
        navigate("/");
    }
  };

  const handleBackToLogin = () => {
    // Navigate back to appropriate login page
    switch (userType) {
      case "student":
        navigate("/student-login");
        break;
      case "executive":
        navigate("/cxo-login");
        break;
      case "employer":
        navigate("/employer-login");
        break;
      default:
        navigate("/");
    }
  };

  const getThemeConfig = () => {
    switch (userType) {
      case "student":
        return {
          gradient: "from-blue-50 via-white to-purple-50",
          primaryColor: "blue",
          emoji: "🎓",
          title: "Student Registration Not Found",
          subtitle: "We couldn't find your student profile in our system",
          buttonGradient: "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
          accentColor: "blue"
        };
      case "executive":
        return {
          gradient: "from-green-50 via-white to-blue-50",
          primaryColor: "green",
          emoji: "🧑‍💼",
          title: "Executive Registration Not Found",
          subtitle: "We couldn't find your executive profile in our system",
          buttonGradient: "from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700",
          accentColor: "green"
        };
      case "employer":
        return {
          gradient: "from-orange-50 via-white to-red-50",
          primaryColor: "orange",
          emoji: "🏢",
          title: "Employer Registration Not Found",
          subtitle: "We couldn't find your company profile in our system",
          buttonGradient: "from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700",
          accentColor: "orange"
        };
      default:
        return {
          gradient: "from-gray-50 via-white to-blue-50",
          primaryColor: "gray",
          emoji: "❓",
          title: "Registration Not Found",
          subtitle: "We couldn't find your profile in our system",
          buttonGradient: "from-gray-600 to-blue-600 hover:from-gray-700 hover:to-blue-700",
          accentColor: "gray"
        };
    }
  };

  const theme = getThemeConfig();

  if (!userType) {
    navigate("/");
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex items-center justify-center mobile-no-scroll transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container-responsive">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Header Section */}
          <div className={`mb-8 sm:mb-12 transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* Animated Emoji */}
            <div className={`text-6xl sm:text-8xl mb-6 transition-all duration-1000 delay-500 ${animationLoaded ? 'scale-100 rotate-0' : 'scale-75 rotate-12'}`}>
              {theme.emoji}
            </div>
            
            {/* Title */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {theme.title}
            </h1>
            
            {/* Subtitle */}
            <p className={`text-lg sm:text-xl text-gray-600 mb-6 transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {theme.subtitle}
            </p>
          </div>

          {/* Main Content Card */}
          <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 mb-8 transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
            
            {/* User Info */}
            {email && (
              <div className={`mb-8 p-6 bg-${theme.accentColor}-50 rounded-xl border border-${theme.accentColor}-200 transition-all duration-700 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold text-gray-700">
                    Google Account: <span className="text-blue-600">{email}</span>
                  </span>
                </div>
                {fullName && (
                  <p className="text-gray-600 mt-2">Welcome, {fullName}!</p>
                )}
              </div>
            )}

            {/* Message */}
            <div className={`mb-8 transition-all duration-700 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                It looks like this is your first time here! Complete your registration to access all the features and opportunities available to {userType === 'student' ? 'students' : userType === 'executive' ? 'executives' : 'employers'}.
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center transition-all duration-700 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              
              {/* Primary Action - Register */}
              <button
                onClick={handleRegister}
                className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${theme.buttonGradient} text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 text-lg`}
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Complete Registration
                </span>
              </button>

              {/* Secondary Action - Back to Login */}
              <button
                onClick={handleBackToLogin}
                className={`w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg`}
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">←</span>
                  Back to Login
                </span>
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 transition-all duration-700 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            
            {userType === 'student' && (
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Career Opportunities</h3>
                  <p className="text-gray-600 text-sm">Access exclusive job postings and internships</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">📚</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Skill Development</h3>
                  <p className="text-gray-600 text-sm">Enhance your skills with industry insights</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">🤝</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Networking</h3>
                  <p className="text-gray-600 text-sm">Connect with professionals and peers</p>
                </div>
              </>
            )}

            {userType === 'executive' && (
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">💼</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Executive Roles</h3>
                  <p className="text-gray-600 text-sm">Access senior leadership opportunities</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">🌐</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Global Network</h3>
                  <p className="text-gray-600 text-sm">Connect with C-suite professionals worldwide</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">📈</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Career Growth</h3>
                  <p className="text-gray-600 text-sm">Advance your executive career path</p>
                </div>
              </>
            )}

            {userType === 'employer' && (
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">👥</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Talent Pool</h3>
                  <p className="text-gray-600 text-sm">Access qualified candidates and executives</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">🏢</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Company Growth</h3>
                  <p className="text-gray-600 text-sm">Build your team and expand operations</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">💡</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Innovation</h3>
                  <p className="text-gray-600 text-sm">Partner with cutting-edge professionals</p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className={`transition-all duration-700 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              <span className="mr-2">🏠</span>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationNotFound;
