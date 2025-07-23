import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Add validation helpers
const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
const validatePhone = (phone) => /^\d{10,15}$/.test(phone);

// Country code options for phone input
const countryOptions = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+1', label: '🇨🇦 +1' },
];

// List of Indian states and sample cities
const indianStates = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Others'
];
const citiesByState = {
  'Delhi': ['New Delhi'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Karnataka': ['Bangalore', 'Mysore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore'],
  'Uttar Pradesh': ['Lucknow', 'Noida'],
  'West Bengal': ['Kolkata'],
  // ... add more as needed
};

const countryList = [
  { code: 'IN', label: '🇮🇳 India', phoneCode: '+91' },
  { code: 'US', label: '🇺🇸 United States', phoneCode: '+1' },
  { code: 'GB', label: '🇬🇧 United Kingdom', phoneCode: '+44' },
  { code: 'CA', label: '🇨🇦 Canada', phoneCode: '+1' },
  { code: 'AU', label: '🇦🇺 Australia', phoneCode: '+61' },
  { code: 'OTHERS', label: 'Others', phoneCode: '' },
];

const ExecutiveForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    // If on /cxo-edit, pre-fill form with cxoData
    if (location.pathname === "/cxo-edit") {
      const stored = localStorage.getItem("cxoData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          resume: null, // don't prefill file fields
          photo: null,
        }));
        setIsEditMode(true);
      } else {
        // No CXO data, redirect to dashboard
        navigate("/cxo-dashboard");
      }
    }
  }, [location.pathname, navigate]);
  
  // Remove countryCode from state, store full phone in formData.phone
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: 'IN',
    otherCountry: '',
    countryCode: "+91",
    phone: "",
    company: "",
    position: "",
    experience: "",
    industry: "",
    currentLocation: "",
    preferredLocation: "",
    linkedinProfile: "",
    resume: null,
    photo: null,
    state: '',
    otherState: '',
    city: '',
    otherCity: '',
    gender: 'Other',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resumeRef = useRef(null);
  const photoRef = useRef(null);
  const [stepWarning, setStepWarning] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setStepWarning("");
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.length < 2) errs.fullName = "Full Name is required (min 2 chars)";
    if (!validateEmail(formData.email)) errs.email = "Valid email required";
    if (!formData.country) errs.country = 'Country is required';
    if (formData.country === 'OTHERS' && !formData.otherCountry.trim()) errs.country = 'Please specify your country';
    if (formData.country === 'IN') {
      if (!formData.countryCode) errs.phone = "Country code required";
      if (!/^\d{10}$/.test(formData.phone)) errs.phone = "Phone must be exactly 10 digits";
      if (!formData.state) errs.state = 'State is required';
      if (formData.state === 'Others') {
        if (!formData.otherState.trim()) errs.state = 'Please specify your state';
        if (!formData.otherCity.trim()) errs.city = 'Please specify your city';
      } else {
        if (!formData.city) errs.city = 'City is required';
        if (!formData.city.trim()) errs.city = 'City is required';
      }
    } else {
      if (!formData.currentLocation.trim()) errs.currentLocation = 'Current Location is required';
    }
    if (currentStep === 2) {
      if (!formData.company.trim()) errs.company = "Company is required";
      if (!formData.position.trim()) errs.position = "Position is required";
      if (!formData.industry.trim()) errs.industry = "Industry is required";
      // experience removed from step 2
    }
    if (currentStep === 3) {
      if (!formData.experience.trim()) errs.experience = "Experience is required";
      if (!formData.preferredLocation.trim()) errs.preferredLocation = "Preferred Location is required";
    }
    return errs;
  };

  // On submit, send formData.phone as is to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    // If on Documents step and resume is missing, show error and do not submit
    if (currentStep === 4 && !formData.resume) {
      setErrors(prev => ({ ...prev, resume: "Resume (PDF, max 2MB) required" }));
      setStepWarning("Please upload your resume before submitting.");
      // Scroll to resume error
      setTimeout(() => {
        if (resumeRef.current) resumeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      setIsSubmitting(false);
      return;
    }
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);
    const data = new FormData();
    // Special handling for currentLocation
    if (formData.country === 'IN') {
      let loc;
      if (formData.state === 'Others') {
        loc = [formData.otherState, formData.otherCity].filter(Boolean).join(', ');
      } else {
        loc = [formData.state, formData.city].filter(Boolean).join(', ');
      }
      data.append('currentLocation', loc);
    } else {
      data.append('currentLocation', formData.currentLocation);
    }
    // Append all other fields except currentLocation
    for (let key in formData) {
      if (key === 'currentLocation') continue;
      data.append(key, formData[key]);
    }

    try {
      let response;
      if (isEditMode && formData._id) {
        // Update profile
        response = await fetch(`http://localhost:5000/api/executives/${formData._id}`, {
          method: "PUT",
          headers: {},
          body: data,
        });
      } else {
        // Register new
        response = await fetch("http://localhost:5000/api/executives", {
          method: "POST",
          body: data,
        });
      }

      if (response.ok) {
        const updated = await response.json();
        if (isEditMode) {
          alert("Profile updated successfully!");
          localStorage.setItem("cxoData", JSON.stringify(updated));
         navigate("/cxo-dashboard");
        } else {
          navigate("/thank-you-cxo");
        }
      } else {
        let errorMsg = "Failed to register executive";
        try {
          const errData = await response.json();
          if (errData && errData.message) errorMsg = errData.message;
        } catch (e) {
          // fallback: try text
          try {
            const errText = await response.text();
            if (errText) errorMsg = errText;
          } catch {}
        }
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Step-specific validation
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStepWarning("Please fill all required fields correctly before proceeding.");
      return;
    }
    setStepWarning("");
    setCurrentStep(currentStep + 1);
  };
  const prevStep = () => setCurrentStep(currentStep - 1);

  const steps = [
    { number: 1, title: "Personal Info", icon: "👤" },
    { number: 2, title: "Professional", icon: "💼" },
    { number: 3, title: "Experience", icon: "📈" },
    { number: 4, title: "Documents", icon: "📄" },
  ];

  // Add step-specific validation
  const stepValid = () => {
    if (currentStep === 1) {
      return (
        formData.fullName.trim().length >= 2 &&
        validateEmail(formData.email) &&
        formData.country &&
        (formData.country !== 'OTHERS' || formData.otherCountry.trim()) &&
        formData.countryCode &&
        /^\d{10}$/.test(formData.phone) &&
        (formData.country === 'IN'
          ? formData.state && (formData.state !== 'Others' ? formData.city : formData.otherState && formData.otherCity)
          : formData.currentLocation.trim())
      );
    }
    if (currentStep === 2) {
      return (
        formData.company.trim() !== "" &&
        formData.position.trim() !== "" &&
        formData.industry.trim() !== ""
        // experience removed from step 2
      );
    }
    if (currentStep === 3) {
      return (
        formData.experience.trim() !== "" &&
        formData.preferredLocation.trim() !== ""
      );
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 mobile-no-scroll">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container-responsive text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 drop-shadow-lg">
            CXO Registration
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-green-100 font-medium">
            Join our network of executive leaders and industry experts
          </p>
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white text-opacity-20 text-4xl sm:text-6xl lg:text-8xl font-black pointer-events-none">
            🧑‍💼
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
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg' 
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
                    currentStep > step.number ? 'bg-gradient-to-r from-green-600 to-blue-600' : 'bg-gray-200'
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
          {stepWarning && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-center font-semibold">
              {stepWarning}
            </div>
          )}
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
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                {/* After name and email fields, insert gender radio group */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Gender</label>
                  <div className="flex gap-4">
                    <label><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male</label>
                    <label><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female</label>
                    <label><input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} /> Other</label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={e => setFormData(f => ({ ...f, countryCode: e.target.value }))}
                      className="px-2 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base"
                      required
                    >
                      {countryOptions.map(opt => (
                        <option key={opt.code} value={opt.code}>{opt.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="phone"
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "");
                        setFormData(f => ({ ...f, phone: val.slice(0, 10) }));
                        setErrors(prev => ({ ...prev, phone: undefined }));
                        setStepWarning("");
                      }}
                      className="flex-1 px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base"
                      maxLength={10}
                      required
                    />
                  </div>
                  {errors.phone && <span className="text-red-600 text-xs">{errors.phone}</span>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={e => {
                      const selected = countryList.find(c => c.code === e.target.value);
                      setFormData(f => ({
                        ...f,
                        country: selected.code,
                        otherCountry: '',
                        countryCode: selected.phoneCode,
                        state: '',
                        city: '',
                        otherState: '',
                        otherCity: '',
                        currentLocation: '',
                      }));
                      setErrors(prev => ({ ...prev, country: undefined }));
                      setStepWarning("");
                    }}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base"
                    required
                  >
                    {countryList.map(opt => (
                      <option key={opt.code} value={opt.code}>{opt.label}</option>
                    ))}
                  </select>
                  {formData.country === 'OTHERS' && (
                    <input
                      type="text"
                      name="otherCountry"
                      placeholder="Enter your country"
                      value={formData.otherCountry}
                      onChange={e => setFormData(f => ({ ...f, otherCountry: e.target.value }))}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base mt-2"
                      required
                    />
                  )}
                  {errors.country && <span className="text-red-600 text-xs">{errors.country}</span>}
                </div>
                
                {formData.country === 'IN' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={e => setFormData(f => ({ ...f, state: e.target.value, city: '', otherState: '', otherCity: '' }))}
                        className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base"
                        required
                      >
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {formData.state === 'Others' && (
                        <input
                          type="text"
                          name="otherState"
                          placeholder="Enter your state"
                          value={formData.otherState}
                          onChange={e => setFormData(f => ({ ...f, otherState: e.target.value }))}
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base mt-2"
                          required
                        />
                      )}
                      {errors.state && <span className="text-red-600 text-xs">{errors.state}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base"
                        required
                      />
                      {errors.city && <span className="text-red-600 text-xs">{errors.city}</span>}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Current Location</label>
                    <input
                      type="text"
                      name="currentLocation"
                      placeholder="Enter your city and country"
                      value={formData.currentLocation}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 text-base"
                      required
                    />
                    {errors.currentLocation && <span className="text-red-600 text-xs">{errors.currentLocation}</span>}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {currentStep === 2 && (
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">💼</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Professional Background</h2>
                <p className="text-gray-600 text-base sm:text-lg">Tell us about your current role and company</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Current Company</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Position/Title</label>
                  <input
                    type="text"
                    name="position"
                    placeholder="e.g., CEO, CTO, VP Engineering"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Industry</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg bg-white"
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                  />
                </div>
                {errors.linkedinProfile && <p className="text-red-500 text-xs mt-1">{errors.linkedinProfile}</p>}
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
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Experience Information */}
          {currentStep === 3 && (
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📈</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Experience & Preferences</h2>
                <p className="text-gray-600 text-base sm:text-lg">Help us understand your experience and preferences</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Years of Experience</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg bg-white"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10-15 years">10-15 years</option>
                    <option value="15-20 years">15-20 years</option>
                    <option value="20+ years">20+ years</option>
                  </select>
                  {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Preferred Location</label>
                  <input
                    type="text"
                    name="preferredLocation"
                    placeholder="e.g., New York, Remote, Bangalore"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                  />
                  {errors.preferredLocation && <p className="text-red-500 text-xs mt-1">{errors.preferredLocation}</p>}
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
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-green-500 transition-all duration-200">
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
                      className="btn-touch px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm sm:text-base"
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-green-500 transition-all duration-200">
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
                      className="btn-touch px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm sm:text-base"
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
                  {isSubmitting ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update Profile" : "Complete Registration")}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ExecutiveForm;
