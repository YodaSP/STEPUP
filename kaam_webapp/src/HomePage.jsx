import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MumbaiIcon, DelhiIcon, BengaluruIcon, HyderabadIcon, ChennaiIcon, PuneIcon, KolkataIcon, KochiIcon, ChandigarhIcon, AhmedabadIcon } from './assets/CityIcons';

// Custom hook for animated counter
const useAnimatedCounter = (targetValue, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = 0;
      
      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(targetValue);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [targetValue, duration, delay]);

  return { count, isAnimating };
};

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
    disabled: true, // Under construction
  },
];

// Define a fixed array of 10 major cities with icon mapping
const fixedCities = [
  { name: "Mumbai", icon: MumbaiIcon },
  { name: "Delhi", icon: DelhiIcon },
  { name: "Bengaluru", icon: BengaluruIcon },
  { name: "Hyderabad", icon: HyderabadIcon },
  { name: "Chandigarh", icon: ChandigarhIcon },
  { name: "Ahmedabad", icon: AhmedabadIcon },
  { name: "Chennai", icon: ChennaiIcon },
  { name: "Pune", icon: PuneIcon },
  { name: "Kolkata", icon: KolkataIcon },
  { name: "Kochi", icon: KochiIcon },
];

// Bar layout constants for 8 bars, strictly increasing, bottom-aligned
const ANIMATION_BAR_COUNT = 8;
const ANIMATION_PANEL_SIZE = 400; // circle diameter
const FLAT_BAR_HEIGHTS = [60, 90, 120, 150, 180, 220, 260, 320]; // strictly increasing
const FLAT_BAR_WIDTH = Math.floor((ANIMATION_PANEL_SIZE * 0.7) / ANIMATION_BAR_COUNT * 0.7); // thick bars
const FLAT_BAR_GAP = Math.floor((ANIMATION_PANEL_SIZE * 0.7 - ANIMATION_BAR_COUNT * FLAT_BAR_WIDTH) / (ANIMATION_BAR_COUNT - 1));
const FLAT_BARS_TOTAL_WIDTH = ANIMATION_BAR_COUNT * FLAT_BAR_WIDTH + (ANIMATION_BAR_COUNT - 1) * FLAT_BAR_GAP;
const FLAT_BARS_X_START = (ANIMATION_PANEL_SIZE - FLAT_BARS_TOTAL_WIDTH) / 2;
const FLAT_BAR_COLORS = [
  '#60a5fa', '#38bdf8', '#3b82f6', '#2563eb', '#6366f1', '#4338ca', '#1d4ed8', '#1e3a8a'
];
// Calculate bar width and gap for perfect centering
const TOTAL_BAR_WIDTH = ANIMATION_PANEL_SIZE * 0.7; // bars take up 70% of circle width
const BAR_WIDTH = Math.floor(TOTAL_BAR_WIDTH / (ANIMATION_BAR_COUNT * 1.5 - 0.5));
const BAR_GAP = BAR_WIDTH / 2;
const BARS_TOTAL_WIDTH = ANIMATION_BAR_COUNT * BAR_WIDTH + (ANIMATION_BAR_COUNT - 1) * BAR_GAP;

// Add a color override map for button gradients
const cardButtonGradients = {
  blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
  green: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800', // deeper green for CXO
  purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
};

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [showRegistrationPanel, setShowRegistrationPanel] = useState(false);
  const secondSectionRef = useRef(null);
  const [showTrendingHeading, setShowTrendingHeading] = useState(false);
  const [showCitiesPanel, setShowCitiesPanel] = useState(false);
  const citiesPanelRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Animated counters for stats
  const studentsCount = useAnimatedCounter(25000, 3500, 500); // 25k students, 3.5s duration, 0.5s delay
  const cxosCount = useAnimatedCounter(10000, 4000, 1000); // 10k CXOs, 4s duration, 1s delay

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stats/registrations-by-location");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Set empty stats array as fallback
        setStats([]);
      }
    };

    // Add a small delay to ensure backend is ready
    setTimeout(fetchStats, 200);
    
    const timer = setTimeout(() => setShowTrendingHeading(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showTrendingHeading && !showCitiesPanel) {
      const panelTimer = setTimeout(() => setShowCitiesPanel(true), 500);
      return () => clearTimeout(panelTimer);
    }
  }, [showTrendingHeading, showCitiesPanel]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowCitiesPanel(true);
      },
      { threshold: 0.2 }
    );
    if (citiesPanelRef.current) observer.observe(citiesPanelRef.current);
    return () => observer.disconnect();
  }, []);

  // Show a back-to-top button after scrolling a bit
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleRegisterClick = () => {
    setShowRegistrationPanel(true);
    setTimeout(() => {
      secondSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100); // allow panel to render
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 relative mobile-no-scroll">
      <div className="flex-1 flex flex-col">
        {/* Login Buttons - Responsive Header */}
        <header className="w-full fixed top-0 left-0 z-30 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm border-b border-gray-100">
          <div className="container-responsive">
            <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 space-y-2 sm:space-y-0">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <a href="/" onClick={e => { e.preventDefault(); navigate('/'); }} className="focus:outline-none">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    <span className="text-blue-600">StepUp</span>
                  </h1>
                </a>
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
        <div className="h-24 sm:h-20" />

        {/* Hero Section with Map and Stats */}
        {/* Use 100svh for correct height in mobile browsers (accounts for URL bar) */}
        <section className="min-h-[100svh] flex flex-col justify-center items-center w-full relative overflow-hidden">
          <div className="animated-hero-bg" />
          <div className="blobs-bg">
            <div className="blob blob1" />
            <div className="blob blob2" />
            <div className="blob blob3" />
          </div>
          <div className="container-responsive w-full relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Main content */}
            <div className="flex-1 max-w-2xl space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mt-0 mb-2">
                Welcome to <span className="text-blue-600">StepUp</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-2">
                Empowering students and executives to take their careers to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
                <span className={`bg-blue-100 rounded-full px-5 py-2 text-base sm:text-lg font-semibold text-gray-800 transition-all duration-300 ${
                  studentsCount.isAnimating ? 'scale-105 shadow-lg' : ''
                }`}>
                  🎓 <strong className="text-blue-700 transition-all duration-200">
  {studentsCount.count.toLocaleString()}+
    </strong>Students Registered
                </span>
                <span className={`bg-green-100 rounded-full px-5 py-2 text-base sm:text-lg font-semibold text-gray-800 transition-all duration-300 ${
                  cxosCount.isAnimating ? 'scale-105 shadow-lg' : ''
                }`}>
                  🧑‍💼 <strong className="text-green-700 transition-all duration-200">
  {cxosCount.count.toLocaleString()}+
</strong>CXOs Onboarded
                </span>
              </div>
              {/* Trending Cities Horizontal Tile */}
              <div className="w-full flex justify-center mb-2 min-h-[32px]">
                <h2
                  className={`text-base sm:text-lg font-bold text-blue-700 text-center transition-all duration-700 ease-out
                    ${showTrendingHeading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ willChange: 'opacity, transform' }}
                >
                  Talents from the cities below have already registered. Join them now!
                </h2>
              </div>
              <div className="w-full flex justify-center mb-4" ref={citiesPanelRef}>
                <div className={`bg-white/80 rounded-2xl shadow grid grid-cols-2 sm:grid-cols-5 gap-2 px-4 py-2 max-w-full border border-blue-100 justify-center items-center transition-all duration-700 ease-out
                  ${showCitiesPanel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  {fixedCities.map((city, idx) => {
                    const stat = stats.find(
                      s => s.location && s.location.toLowerCase().replace(/\s+/g, "") === city.name.toLowerCase().replace(/\s+/g, "")
                    );
                    const students = stat ? stat.students : 0;
                    const cxos = stat ? stat.cxos : 0;
                    const CityIcon = city.icon;
                    return (
                      <div
                        key={city.name}
                        className={`flex flex-col items-center min-w-[80px] px-2 transition-all duration-700 ease-out
                          ${showCitiesPanel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                          delay-[${idx * 120}ms] hover:scale-110 hover:shadow-lg hover:bg-blue-50/70 cursor-pointer`}
                        style={{ transitionDelay: `${idx * 120}ms` }}
                      >
                        <CityIcon style={{ width: 28, height: 28 }} />
                        <span className="text-xs font-bold text-blue-700 mt-1 mb-0.5">{city.name}</span>
                        <div className="flex flex-row gap-1">
                          <span className="bg-blue-100 text-blue-700 rounded-full px-1 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                            🎓 {students}
                          </span>
                          <span className="bg-green-100 text-green-700 rounded-full px-1 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                            🧑‍💼 {cxos}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Register Now button below trending panel, larger */}
              <div className="w-full flex justify-center py-6">
                <button
                  onClick={handleRegisterClick}
                  className="btn-touch px-10 py-4 text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transition-all duration-200"
                >
                  Click to Register Now
                </button>
              </div>
            </div>
            {/* Right: Large circle with animated rising bars */}
            <div className="flex-1 w-full flex justify-end items-center max-w-[400px]">
              <div className="relative flex items-end justify-center w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] overflow-visible">
                <svg width="100%" height="100%" viewBox={`0 0 ${ANIMATION_PANEL_SIZE} ${ANIMATION_PANEL_SIZE}`} className="absolute left-0 top-0">
                  {Array.from({ length: ANIMATION_BAR_COUNT }).map((_, i) => {
                    const barHeight = FLAT_BAR_HEIGHTS[i];
                    const x = FLAT_BARS_X_START + i * (FLAT_BAR_WIDTH + FLAT_BAR_GAP);
                    const bottomPadding = 32;
                    const y = ANIMATION_PANEL_SIZE - barHeight - bottomPadding;
                    return (
                      <rect
                        key={i}
                        x={x}
                        y={y}
                        width={FLAT_BAR_WIDTH}
                        height={barHeight}
                        rx={Math.floor(FLAT_BAR_WIDTH/2.5)}
                        fill={FLAT_BAR_COLORS[i]}
                        style={{
                          opacity: 0,
                          animation: `barRise 1s cubic-bezier(.4,0,.2,1) 1`,
                          animationDelay: `${i * 0.18}s`,
                          animationFillMode: 'forwards',
                          transformOrigin: `${x + FLAT_BAR_WIDTH/2}px ${ANIMATION_PANEL_SIZE - bottomPadding}px`,
                        }}
                        className={`animated-bar bar-${i}`}
                      />
                    );
                  })}
                  <style>{`
                    @keyframes barRise {
                      0% { opacity: 0; transform: scaleY(0); }
                      100% { opacity: 1; transform: scaleY(1); }
                    }
                  `}</style>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Second Section: Gateway + Cards - Responsive Grid */}
        {showRegistrationPanel && (
          <section
            ref={secondSectionRef}
            className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white py-12 sm:py-16 lg:py-20 min-h-screen flex flex-col justify-center"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                  {cardData.map((card) => (
                    <div
                      key={card.title}
                      onClick={card.disabled ? undefined : () => navigate(card.route)}
                      className={`
                        cursor-pointer rounded-2xl sm:rounded-3xl bg-white/90 p-6 sm:p-8 flex flex-col justify-between items-center h-full
                        shadow-xl ${card.disabled ? '' : 'hover:scale-105 hover:shadow-2xl'} transition-all duration-300 border-2
                        border-transparent hover:border-${card.color}-500
                        text-gray-800 transform hover:-translate-y-1
                        min-h-[320px] ${card.disabled ? 'opacity-60 cursor-not-allowed' : ''}
                      `}
                    >
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 text-center">
                        {card.title}
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base mb-6 flex-1 text-center leading-relaxed">
                        {card.description}
                      </p>
                      <button
                        className={`
                          btn-touch w-full px-4 sm:px-5 py-3 rounded-full font-semibold text-sm sm:text-base
                          bg-gradient-to-r ${cardButtonGradients[card.color]}
                          text-white shadow transition-all duration-200
                          min-h-[48px] whitespace-nowrap
                        `}
                        disabled={!!card.disabled}
                      >
                        {card.button}
                      </button>
                      {card.disabled && (
                        <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-100 border border-amber-200 rounded-full px-3 py-1">
                          <span className="text-lg leading-none">🚧</span>
                          Under construction
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 bg-gray-900 text-white rounded-full shadow-lg px-3 py-3 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
      {/* Footer - Responsive */}
      <footer className="bg-white border-t border-gray-200 text-xs sm:text-sm text-gray-500 text-center py-4 sm:py-6 mt-auto">
        <div className="container-responsive">
          &copy; {new Date().getFullYear()} STEPUP. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
