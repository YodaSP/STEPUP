import React, { useState, useRef, useEffect } from "react";

const StudentForm = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    university: "",
    degree: "",
    passingDate: "",
    skills: "",
    jobRole: "",
    preferredLocation: "",
    currentLocation: "",
    resume: null,
    photo: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resumeRef = useRef(null);
  const photoRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Student registered successfully!");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          university: "",
          degree: "",
          passingDate: "",
          skills: "",
          jobRole: "",
          preferredLocation: "",
          currentLocation: "",
          resume: null,
          photo: null,
        });
        resumeRef.current.value = null;
        photoRef.current.value = null;
        setCurrentStep(1);
      } else {
        alert("Failed to register student");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const steps = [
    { number: 1, title: "Personal Info", icon: "👤" },
    { number: 2, title: "Education", icon: "🎓" },
    { number: 3, title: "Professional", icon: "💼" },
    { number: 4, title: "Documents", icon: "📄" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mobile-no-scroll">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container-responsive text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 drop-shadow-lg">
            Student Registration
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 font-medium">
            Join thousands of students connecting with top employers
          </p>
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white text-opacity-20 text-4xl sm:text-6xl lg:text-8xl font-black pointer-events-none">
            🎓
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="container-responsive -mt-4 sm:-mt-6 lg:-mt-8 relative z-10">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full text-base sm:text-lg font-bold transition-all duration-300 ${
                  currentStep >= step.number 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.number ? '✓' : step.icon}
                </div>
                <div className="ml-2 sm:ml-3">
                  <div className={`text-xs sm:text-sm font-semibold ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-12 lg:w-16 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="container-responsive py-6 sm:py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">👤</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Personal Information</h2>
                <p className="text-gray-600 text-base sm:text-lg">Let's start with your basic details</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Current Location</label>
                  <input
                    type="text"
                    name="currentLocation"
                    placeholder="City, State"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Educational Information */}
          {currentStep === 2 && (
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🎓</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Educational Background</h2>
                <p className="text-gray-600 text-base sm:text-lg">Tell us about your academic journey</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">University/College</label>
                  <input
                    type="text"
                    name="university"
                    placeholder="Your university name"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Degree</label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg bg-white"
                    required
                  >
                    <option value="">Select your degree</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="B.Com">B.Com</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MBA">MBA</option>
                    <option value="MCA">MCA</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Passing Year</label>
                  <select
                    name="passingDate"
                    value={formData.passingDate}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg bg-white"
                    required
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 50 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Skills</label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="e.g., React, Python, Machine Learning"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 font-bold rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all duration-200 text-base sm:text-lg order-2 sm:order-1"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg order-1 sm:order-2"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Professional Information */}
          {currentStep === 3 && (
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">💼</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Professional Goals</h2>
                <p className="text-gray-600 text-base sm:text-lg">Help us understand your career aspirations</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Preferred Job Role</label>
                  <select
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg bg-white"
                    required
                  >
                    <option value="">Select job role</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Preferred Location</label>
                  <input
                    type="text"
                    name="preferredLocation"
                    placeholder="e.g., New York, Remote, Bangalore"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 font-bold rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all duration-200 text-base sm:text-lg order-2 sm:order-1"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg order-1 sm:order-2"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📄</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Upload Documents</h2>
                <p className="text-gray-600 text-base sm:text-lg">Complete your profile with your resume and photo</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Resume (PDF)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-blue-500 transition-all duration-200">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📄</div>
                    <p className="text-gray-600 mb-2 text-sm sm:text-base">Drop your resume here or click to browse</p>
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf"
                      onChange={handleChange}
                      className="hidden"
                      ref={resumeRef}
                    />
                    <button
                      type="button"
                      onClick={() => resumeRef.current.click()}
                      className="btn-touch px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm sm:text-base"
                    >
                      Choose File
                    </button>
                    {formData.resume && (
                      <p className="mt-2 text-sm text-green-600">✓ {formData.resume.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Profile Photo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-blue-500 transition-all duration-200">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📷</div>
                    <p className="text-gray-600 mb-2 text-sm sm:text-base">Drop your photo here or click to browse</p>
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      ref={photoRef}
                    />
                    <button
                      type="button"
                      onClick={() => photoRef.current.click()}
                      className="btn-touch px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm sm:text-base"
                    >
                      Choose File
                    </button>
                    {formData.photo && (
                      <p className="mt-2 text-sm text-green-600">✓ {formData.photo.name}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 font-bold rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all duration-200 text-base sm:text-lg order-2 sm:order-1"
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Complete Registration"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
