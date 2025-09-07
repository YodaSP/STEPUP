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
  'Delhi': ['delhi'],
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
          workExperience: parsed.workExperience && parsed.workExperience.length > 0 
            ? parsed.workExperience 
            : [{
                companyName: "",
                jobTitle: "",
                startDate: "",
                endDate: "",
                keyResponsibilities: "",
                majorAchievements: ""
              }],
          resume: null, // don't prefill file fields
          photo: null,
        }));
        setIsEditMode(true);
      } else {
        // No CXO data, redirect to dashboard
        navigate("/cxo-dashboard");
      }
    } else {
      // Initialize with at least one work experience entry for new registrations
      setFormData(prev => ({
        ...prev,
        workExperience: [{
          companyName: "",
          jobTitle: "",
          startDate: "",
          endDate: "",
          keyResponsibilities: "",
          majorAchievements: ""
        }]
      }));
    }
  }, [location.pathname, navigate]);
  
  // Remove countryCode from state, store full phone in formData.phone
  const [formData, setFormData] = useState({
    // Section 1: Personal Information
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: 'IN',
    otherCountry: '',
    countryCode: "+91",
    phone: "",
    currentLocation: "",
    dateOfBirth: "",
    maritalStatus: "Other",
    gender: "Other",
    state: '',
    otherState: '',
    city: '',
    otherCity: '',

    // Section 2: Professional Information
    currentDesignation: "",
    totalYearsExperience: "",
    linkedinProfile: "",
    careerObjective: "",

    // Section 3: Education
    highestQualification: "",
    institutionName: "",
    yearOfCompletion: "",
    specialization: "",
    additionalCertifications: "",

    // Section 4: Work Experience
    workExperience: [],

    // Section 5: Skills
    technicalSkills: "",
    softSkills: "",
    toolsTechnologies: "",
    languagesKnown: "",

    // Section 6: Additional Information
    awardsRecognition: "",
    hobbiesInterests: "",
    professionalMemberships: "",

    // Legacy fields (for backward compatibility)
    company: "",
    position: "",
    experience: "",
    industry: "",
    preferredLocation: "",
    skills: "",

    // Files
    resume: null,
    photo: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resumeRef = useRef(null);
  const photoRef = useRef(null);
  const [stepWarning, setStepWarning] = useState("");
  const [errors, setErrors] = useState({});
  
  // Animation states for progressive reveal
  const [visibleFields, setVisibleFields] = useState({
    awardsRecognition: false,
    hobbiesInterests: false,
    professionalMemberships: false,
  });
  const [animationStep, setAnimationStep] = useState(0);
  const [stepAnimation, setStepAnimation] = useState(false);

  // Progressive reveal animation for step 6
  useEffect(() => {
    if (currentStep === 6) {
      // Reset animation state
      setVisibleFields({
        awardsRecognition: false,
        hobbiesInterests: false,
        professionalMemberships: false,
      });
      setAnimationStep(0);
      
      // Start progressive reveal animation
      const timer1 = setTimeout(() => {
        setVisibleFields(prev => ({ ...prev, awardsRecognition: true }));
        setAnimationStep(1);
      }, 200);
      
      const timer2 = setTimeout(() => {
        setVisibleFields(prev => ({ ...prev, hobbiesInterests: true }));
        setAnimationStep(2);
      }, 500);
      
      const timer3 = setTimeout(() => {
        setVisibleFields(prev => ({ ...prev, professionalMemberships: true }));
        setAnimationStep(3);
      }, 800);
      
      // Cleanup timers
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [currentStep]);

  // Step transition animation
  useEffect(() => {
    setStepAnimation(false);
    const timer = setTimeout(() => {
      setStepAnimation(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

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
    
    // Step 1: Personal Information
    if (currentStep === 1) {
      if (!formData.fullName.trim() || formData.fullName.length < 2) errs.fullName = "Full Name is required (min 2 chars)";
      if (!validateEmail(formData.email)) errs.email = "Valid email required";
      
      // Password validation (only for new registrations, not for edits)
      if (!isEditMode) {
        if (!formData.password) errs.password = "Password is required";
        if (!formData.confirmPassword) errs.confirmPassword = "Please confirm your password";
        else if (formData.password !== formData.confirmPassword) {
          errs.confirmPassword = "Passwords do not match";
        }
      }
      
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
    }

    // Step 2: Professional Information
    if (currentStep === 2) {
      if (!formData.currentDesignation.trim()) errs.currentDesignation = "Current Designation is required";
      if (!formData.totalYearsExperience.trim()) errs.totalYearsExperience = "Years of Experience is required";
      if (!formData.company.trim()) errs.company = "Company is required";
      if (!formData.position.trim()) errs.position = "Position is required";
      if (!formData.industry.trim()) errs.industry = "Industry is required";
    }

    // Step 3: Education
    if (currentStep === 3) {
      if (!formData.highestQualification.trim()) errs.highestQualification = "Highest Qualification is required";
      if (!formData.institutionName.trim()) errs.institutionName = "Institution Name is required";
      if (!formData.yearOfCompletion.trim()) errs.yearOfCompletion = "Year of Completion is required";
    }

    // Step 4: Work Experience (at least one entry required)
    if (currentStep === 4) {
      if (!formData.workExperience || formData.workExperience.length === 0) {
        errs.workExperience = "At least one work experience entry is required";
      }
    }

    // Step 5: Skills
    if (currentStep === 5) {
      if (!formData.technicalSkills.trim()) errs.technicalSkills = "Technical Skills are required";
      if (!formData.softSkills.trim()) errs.softSkills = "Soft Skills are required";
    }

    // Step 6: Additional Information (optional, no validation needed)

    // Step 7: Documents
    if (currentStep === 7) {
      if (!formData.resume) errs.resume = "Resume (PDF, max 2MB) required";
    }

    return errs;
  };

  // On submit, send formData.phone as is to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    // If on Documents step and resume is missing, show error and do not submit
    if (currentStep === 7 && !formData.resume) {
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
      // Set errors for all fields in this step
      const stepErrs = { ...errors };
      if (currentStep === 1) {
        if (!formData.fullName.trim() || formData.fullName.length < 2) stepErrs.fullName = "Full Name is required (min 2 chars)";
        if (!validateEmail(formData.email)) stepErrs.email = "Valid email required";
        
        // Add password validation for new registrations
        if (!isEditMode) {
          if (!formData.password) stepErrs.password = "Password is required";
          if (!formData.confirmPassword) stepErrs.confirmPassword = "Please confirm your password";
          else if (formData.password !== formData.confirmPassword) {
            stepErrs.confirmPassword = "Passwords do not match";
          }
        }
        
        if (!formData.country) stepErrs.country = 'Country is required';
        if (formData.country === 'OTHERS' && !formData.otherCountry.trim()) stepErrs.country = 'Please specify your country';
        if (formData.country === 'IN') {
          if (!formData.countryCode) stepErrs.phone = "Country code required";
          if (!/^\d{10}$/.test(formData.phone)) stepErrs.phone = "Phone must be exactly 10 digits";
          if (!formData.state) stepErrs.state = 'State is required';
          if (formData.state === 'Others') {
            if (!formData.otherState.trim()) stepErrs.state = 'Please specify your state';
            if (!formData.otherCity.trim()) stepErrs.city = 'Please specify your city';
          } else {
            if (!formData.city) stepErrs.city = 'City is required';
            if (!formData.city.trim()) stepErrs.city = 'City is required';
          }
        } else {
          if (!formData.currentLocation.trim()) stepErrs.currentLocation = 'Current Location is required';
        }
      }
      setErrors(stepErrs);
      return;
    }
    setStepWarning("");
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    // Reset animation state when leaving step 6
    if (currentStep === 6) {
      setVisibleFields({
        awardsRecognition: false,
        hobbiesInterests: false,
        professionalMemberships: false,
      });
      setAnimationStep(0);
    }
  };

  // Helper functions for work experience management
  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        companyName: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        keyResponsibilities: "",
        majorAchievements: ""
      }]
    }));
  };

  const updateWorkExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: "👤" },
    { number: 2, title: "Professional", icon: "💼" },
    { number: 3, title: "Education", icon: "🎓" },
    { number: 4, title: "Work Experience", icon: "💼" },
    { number: 5, title: "Skills", icon: "🔧" },
    { number: 6, title: "Additional Info", icon: "📋" },
    { number: 7, title: "Documents", icon: "📄" },
  ];

  // Add step-specific validation
  const stepValid = () => {
    if (currentStep === 1) {
      const basicValid = (
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
      
      // Add password validation for new registrations
      if (!isEditMode) {
        return basicValid && 
          formData.password && 
          formData.confirmPassword &&
          formData.password === formData.confirmPassword;
      }
      
      return basicValid;
    }
    if (currentStep === 2) {
      return (
        formData.currentDesignation.trim() !== "" &&
        formData.totalYearsExperience.trim() !== "" &&
        formData.company.trim() !== "" &&
        formData.position.trim() !== "" &&
        formData.industry.trim() !== ""
      );
    }
    if (currentStep === 3) {
      return (
        formData.highestQualification.trim() !== "" &&
        formData.institutionName.trim() !== "" &&
        formData.yearOfCompletion.trim() !== ""
      );
    }
    if (currentStep === 4) {
      return (
        formData.workExperience && formData.workExperience.length > 0
      );
    }
    if (currentStep === 5) {
      return (
        formData.technicalSkills.trim() !== "" &&
        formData.softSkills.trim() !== ""
      );
    }
    if (currentStep === 6) {
      return true; // Additional info is optional
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
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center min-w-0 flex-1 max-w-[120px] sm:max-w-[140px]">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full text-sm sm:text-base lg:text-lg font-bold transition-all duration-300 ${
                  currentStep >= step.number 
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.number ? '✓' : step.icon}
                </div>
                <div className="mt-1 sm:mt-2 text-center">
                  <div className={`text-xs font-semibold leading-tight ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-4 lg:w-8 h-1 mx-1 lg:mx-2 rounded-full transition-all duration-300 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-green-600 to-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          {/* Current Step Indicator */}
          <div className="text-center">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-medium">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="container-responsive py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className={`bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 ease-out ${
            stepAnimation ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-98'
          }`}>
            {stepWarning && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-center font-semibold">
                {stepWarning}
              </div>
            )}
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className={`p-4 sm:p-6 md:p-8 lg:p-12 transform transition-all duration-700 ease-out ${
              stepAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 animate-bounce">👤</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Personal Information</h2>
                <p className="text-gray-600 text-base sm:text-lg">Let's start with your basic details</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className={`space-y-2 transform transition-all duration-500 ease-out delay-100 ${
                  stepAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
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
                
                {/* Password fields - only show for new registrations */}
                {!isEditMode && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                        required
                      />
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                      <p className="text-xs text-gray-500">Must be at least 8 characters with uppercase, lowercase, and number</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                        required
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </>
                )}
                
                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Gender</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="mr-2" />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="mr-2" />
                      Female
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} className="mr-2" />
                      Other
                    </label>
                  </div>
                </div>

                {/* Marital Status */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg bg-white"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Other">Other</option>
                  </select>
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
            <div className={`p-4 sm:p-6 md:p-8 lg:p-12 transform transition-all duration-700 ease-out ${
              stepAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 animate-bounce">💼</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Professional Information</h2>
                <p className="text-gray-600 text-base sm:text-lg">Tell us about your current role and experience</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Current Designation</label>
                  <input
                    type="text"
                    name="currentDesignation"
                    placeholder="e.g., CEO, CTO, VP Engineering"
                    value={formData.currentDesignation}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.currentDesignation && <p className="text-red-500 text-xs mt-1">{errors.currentDesignation}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Total Years of Experience</label>
                  <select
                    name="totalYearsExperience"
                    value={formData.totalYearsExperience}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg bg-white"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-2 years">0-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10-15 years">10-15 years</option>
                    <option value="15-20 years">15-20 years</option>
                    <option value="20+ years">20+ years</option>
                  </select>
                  {errors.totalYearsExperience && <p className="text-red-500 text-xs mt-1">{errors.totalYearsExperience}</p>}
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
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Career Objective</label>
                  <textarea
                    name="careerObjective"
                    placeholder="Brief professional summary and career objectives"
                    value={formData.careerObjective}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Company</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Current company name"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Position</label>
                  <input
                    type="text"
                    name="position"
                    placeholder="Current job title/position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    placeholder="e.g., Technology, Healthcare, Finance"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
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

          {/* Step 3: Education */}
          {currentStep === 3 && (
            <div className={`p-4 sm:p-6 md:p-8 lg:p-12 transform transition-all duration-700 ease-out ${
              stepAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 animate-bounce">🎓</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Education & Qualifications</h2>
                <p className="text-gray-600 text-base sm:text-lg">Tell us about your educational background</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Highest Qualification</label>
                  <select
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg bg-white"
                    required
                  >
                    <option value="">Select qualification</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="MBA">MBA</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.highestQualification && <p className="text-red-500 text-xs mt-1">{errors.highestQualification}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Institution Name</label>
                  <input
                    type="text"
                    name="institutionName"
                    placeholder="University/College name"
                    value={formData.institutionName}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.institutionName && <p className="text-red-500 text-xs mt-1">{errors.institutionName}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Year of Completion</label>
                  <input
                    type="number"
                    name="yearOfCompletion"
                    placeholder="e.g., 2020"
                    value={formData.yearOfCompletion}
                    onChange={handleChange}
                    min="1950"
                    max="2030"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.yearOfCompletion && <p className="text-red-500 text-xs mt-1">{errors.yearOfCompletion}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Specialization/Major</label>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="e.g., Computer Science, Finance, Marketing"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                  />
                </div>
                
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Additional Certifications</label>
                  <textarea
                    name="additionalCertifications"
                    placeholder="e.g., CA, CFA, PMP, AWS Certified, etc."
                    value={formData.additionalCertifications}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
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
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Work Experience */}
          {currentStep === 4 && (
            <div className={`p-4 sm:p-6 md:p-8 lg:p-12 transform transition-all duration-700 ease-out ${
              stepAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 animate-bounce">💼</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Work Experience</h2>
                <p className="text-gray-600 text-base sm:text-lg">Add your professional work history</p>
              </div>
              
              <div className="space-y-6">
                {formData.workExperience.map((exp, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Experience #{index + 1}</h3>
                      {formData.workExperience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWorkExperience(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Company Name</label>
                        <input
                          type="text"
                          value={exp.companyName}
                          onChange={(e) => updateWorkExperience(index, 'companyName', e.target.value)}
                          placeholder="Company name"
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Job Title</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateWorkExperience(index, 'jobTitle', e.target.value)}
                          placeholder="Job title"
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Start Date</label>
                        <input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">End Date</label>
                        <input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base"
                        />
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id={`present-${index}`}
                            checked={exp.endDate === ''}
                            onChange={(e) => updateWorkExperience(index, 'endDate', e.target.checked ? '' : new Date().toISOString().split('T')[0])}
                            className="mr-2"
                          />
                          <label htmlFor={`present-${index}`} className="text-sm text-gray-600">Currently working here</label>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Key Responsibilities</label>
                        <textarea
                          value={exp.keyResponsibilities}
                          onChange={(e) => updateWorkExperience(index, 'keyResponsibilities', e.target.value)}
                          placeholder="Describe your key responsibilities"
                          rows="3"
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base"
                        />
                      </div>
                      
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Major Achievements</label>
                        <textarea
                          value={exp.majorAchievements}
                          onChange={(e) => updateWorkExperience(index, 'majorAchievements', e.target.value)}
                          placeholder="Describe your major achievements and contributions"
                          rows="3"
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addWorkExperience}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-all duration-200 font-medium"
                >
                  + Add Another Work Experience
                </button>
              </div>
              
              {errors.workExperience && <p className="text-red-500 text-xs mt-2">{errors.workExperience}</p>}
              
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

          {/* Step 5: Skills */}
          {currentStep === 5 && (
            <div className={`p-4 sm:p-6 md:p-8 lg:p-12 transform transition-all duration-700 ease-out ${
              stepAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 animate-bounce">🔧</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Skills & Competencies</h2>
                <p className="text-gray-600 text-base sm:text-lg">Tell us about your skills and expertise</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Technical Skills</label>
                  <textarea
                    name="technicalSkills"
                    placeholder="e.g., JavaScript, Python, React, AWS, Docker, etc."
                    value={formData.technicalSkills}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.technicalSkills && <p className="text-red-500 text-xs mt-1">{errors.technicalSkills}</p>}
                </div>
                
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Soft Skills</label>
                  <textarea
                    name="softSkills"
                    placeholder="e.g., Leadership, Communication, Problem Solving, Team Management, etc."
                    value={formData.softSkills}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.softSkills && <p className="text-red-500 text-xs mt-1">{errors.softSkills}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Tools & Technologies</label>
                  <textarea
                    name="toolsTechnologies"
                    placeholder="e.g., Jira, Slack, Salesforce, Tableau, etc."
                    value={formData.toolsTechnologies}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Languages Known</label>
                  <textarea
                    name="languagesKnown"
                    placeholder="e.g., English, Hindi, Spanish, French, etc."
                    value={formData.languagesKnown}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base sm:text-lg"
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
                  className="btn-touch px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Additional Information */}
          {currentStep === 6 && (
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 animate-bounce">📋</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Additional Information</h2>
                <p className="text-gray-600 text-base sm:text-lg">Tell us about your achievements and interests (Optional)</p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Awards & Recognition Field */}
                <div 
                  className={`transform transition-all duration-700 ease-out ${
                    visibleFields.awardsRecognition 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'translate-y-8 opacity-0 scale-95'
                  }`}
                >
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <label className="text-sm sm:text-base font-semibold text-gray-700 mb-4 block flex items-center">
                      <span className="text-xl mr-3">🏆</span>
                      Awards & Recognition
                    </label>
                    <textarea
                      name="awardsRecognition"
                      placeholder="Share your professional achievements, awards, recognition, certifications..."
                      value={formData.awardsRecognition}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-base resize-none"
                    />
                  </div>
                </div>

                {/* Hobbies & Interests Field */}
                <div 
                  className={`transform transition-all duration-700 ease-out delay-300 ${
                    visibleFields.hobbiesInterests 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'translate-y-8 opacity-0 scale-95'
                  }`}
                >
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <label className="text-sm sm:text-base font-semibold text-gray-700 mb-4 block flex items-center">
                      <span className="text-xl mr-3">🎯</span>
                      Hobbies & Interests
                    </label>
                    <textarea
                      name="hobbiesInterests"
                      placeholder="Tell us about your hobbies, interests, and activities outside work..."
                      value={formData.hobbiesInterests}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base resize-none"
                    />
                  </div>
                </div>

                {/* Professional Memberships Field */}
                <div 
                  className={`transform transition-all duration-700 ease-out delay-600 ${
                    visibleFields.professionalMemberships 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'translate-y-8 opacity-0 scale-95'
                  }`}
                >
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <label className="text-sm sm:text-base font-semibold text-gray-700 mb-4 block flex items-center">
                      <span className="text-xl mr-3">👥</span>
                      Professional Memberships
                    </label>
                    <textarea
                      name="professionalMemberships"
                      placeholder="List your professional memberships, associations, or industry organizations..."
                      value={formData.professionalMemberships}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-base resize-none"
                    />
                  </div>
                </div>

                {/* Progress Indicator */}
                {animationStep > 0 && (
                  <div className="flex justify-center mt-8 mb-4">
                    <div className="flex space-x-3">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`w-4 h-4 rounded-full transition-all duration-500 ${
                            step <= animationStep 
                              ? 'bg-gradient-to-r from-green-500 to-blue-500 scale-110 shadow-lg' 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 sm:mt-10 gap-4 sm:gap-6 max-w-3xl mx-auto">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-touch w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 font-bold rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all duration-200 text-base sm:text-lg order-2 sm:order-1"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-touch w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg order-1 sm:order-2"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 7: Documents */}
          {currentStep === 7 && (
            <div className={`p-4 sm:p-6 md:p-8 lg:p-12 transform transition-all duration-700 ease-out ${
              stepAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="text-center mb-8 sm:mb-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 animate-pulse">📄</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Upload Documents</h2>
                <p className="text-gray-600 text-base sm:text-lg">Complete your profile with your resume and photo</p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                  {/* Resume Upload */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 shadow-sm">
                    <label className="text-sm sm:text-base font-semibold text-gray-700 mb-4 block flex items-center">
                      <span className="text-xl mr-2">📄</span>
                      Resume (PDF)
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-all duration-200 min-h-[160px] flex flex-col justify-center bg-white/60 backdrop-blur-sm">
                      <div className="text-3xl mb-3">📄</div>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">Drop your resume here or click to browse</p>
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
                        className="btn-touch mx-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm sm:text-base"
                      >
                        Choose PDF File
                      </button>
                      {formData.resume && (
                        <p className="mt-3 text-sm text-green-600 font-medium flex items-center justify-center">
                          <span className="mr-2">✓</span>
                          {formData.resume.name}
                        </p>
                      )}
                      {errors.resume && (
                        <p className="mt-2 text-red-500 text-sm">{errors.resume}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Photo Upload */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-sm">
                    <label className="text-sm sm:text-base font-semibold text-gray-700 mb-4 block flex items-center">
                      <span className="text-xl mr-2">📷</span>
                      Profile Photo (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all duration-200 min-h-[160px] flex flex-col justify-center bg-white/60 backdrop-blur-sm">
                      <div className="text-3xl mb-3">📷</div>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">Drop your photo here or click to browse</p>
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
                        className="btn-touch mx-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm sm:text-base"
                      >
                        Choose Image File
                      </button>
                      {formData.photo && (
                        <p className="mt-3 text-sm text-blue-600 font-medium flex items-center justify-center">
                          <span className="mr-2">✓</span>
                          {formData.photo.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 sm:mt-10 gap-4 sm:gap-6 max-w-3xl mx-auto">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-touch w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 font-bold rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all duration-200 text-base sm:text-lg order-2 sm:order-1"
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-touch w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update Profile" : "Complete Registration")}
                </button>
              </div>
            </div>
          )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveForm;
