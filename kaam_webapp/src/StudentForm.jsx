import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const StudentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if this is a new Google auth user
    if (location.state?.isNewUser) {
      const { email, fullName, token } = location.state;
      setFormData(prev => ({
        ...prev,
        email: email || "",
        fullName: fullName || "",
      }));
      // Store the token for later use
      if (token) {
        localStorage.setItem("studentToken", token);
      }
    }
    // If on /student-edit, pre-fill form with studentData
    else if (location.pathname === "/student-edit") {
      const stored = localStorage.getItem("studentData");
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
        // No student data, redirect to dashboard
        navigate("/student-dashboard");
      }
    }
  }, [location.pathname, navigate, location.state]);
  
  // Add validation helpers
  const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const validatePhone = (phone) => /^\d{10,15}$/.test(phone);
  const validateYear = (year) => {
    const y = Number(year);
    const now = new Date().getFullYear();
    return y >= 1950 && y <= now + 1;
  };
  const validateCGPA = (cgpa) => cgpa === "" || (!isNaN(cgpa) && Number(cgpa) >= 0 && Number(cgpa) <= 100);
  const validateURL = (url) => url === "" || /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/.test(url);
  const validateSkills = (skills) => skills.split(",").map(s => s.trim()).filter(Boolean).length > 0;

  // Country code options
  const countryList = [
    { code: 'IN', label: '🇮🇳 India', phoneCode: '+91' },
    { code: 'US', label: '🇺🇸 United States', phoneCode: '+1' },
    { code: 'GB', label: '🇬🇧 United Kingdom', phoneCode: '+44' },
    { code: 'CA', label: '🇨🇦 Canada', phoneCode: '+1' },
    { code: 'AU', label: '🇦🇺 Australia', phoneCode: '+61' },
    { code: 'OTHERS', label: 'Others', phoneCode: '' },
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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: 'IN',
    otherCountry: '',
    countryCode: "+91",
    phone: "",
    university: "",
    degree: "",
    specialization: "",
    passingDate: "",
    cgpa: "",
    skills: "",
    jobRole: "",
    preferredLocation: "",
    currentLocation: "",
    resume: null,
    photo: null,
    linkedin: "",
    state: '',
    otherState: '',
    city: '',
    otherCity: '',
    gender: 'Other',
  });
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [stepWarning, setStepWarning] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resumeRef = useRef(null);
  const photoRef = useRef(null);

  const validate = () => {
    const errs = {};
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
    if (!formData.countryCode) errs.phone = "Country code required";
    if (!/^\d{10}$/.test(formData.phone)) errs.phone = "Phone must be exactly 10 digits";
    if (!formData.university.trim()) errs.university = "University/College is required";
    if (!formData.degree.trim()) errs.degree = "Degree is required";
    if (!validateYear(formData.passingDate)) errs.passingDate = "Valid passing year required";
    if (!validateCGPA(formData.cgpa)) errs.cgpa = "CGPA/Percentage must be 0-100";
    if (!validateSkills(formData.skills)) errs.skills = "At least one skill required";
    if (!formData.jobRole.trim()) errs.jobRole = "Preferred Job Role is required";
    if (!formData.preferredLocation.trim()) errs.preferredLocation = "Preferred Location is required";
    if (!formData.resume) errs.resume = "Resume (PDF, max 2MB) required";
    if (formData.resume && formData.resume.type !== "application/pdf") errs.resume = "Resume must be a PDF";
    if (formData.resume && formData.resume.size > 2 * 1024 * 1024) errs.resume = "Resume must be <= 2MB";
    if (formData.photo && !formData.photo.type.startsWith("image/")) errs.photo = "Profile photo must be an image";
    if (formData.photo && formData.photo.size > 2 * 1024 * 1024) errs.photo = "Profile photo must be <= 2MB";
    if (!validateURL(formData.linkedin)) errs.linkedin = "LinkedIn must be a valid URL";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    // Clear error when input changes
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setStepWarning("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[DEBUG] handleSubmit called, currentStep:', currentStep);
    const errs = validate();
    setErrors(errs);
    // If on Documents step and resume is missing, show error and do not submit
    if (currentStep === 4 && !formData.resume) {
      console.log('[DEBUG] Resume missing on submit');
      setErrors(prev => ({ ...prev, resume: "Resume (PDF, max 2MB) required" }));
      setStepWarning("Please upload your resume before submitting.");
      // Scroll to resume error
      setTimeout(() => {
        if (resumeRef.current) resumeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      setIsSubmitting(false);
      return;
    }
    if (Object.keys(errs).length > 0) {
      console.log('[DEBUG] Validation errors:', errs);
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);
    console.log('[DEBUG] Submitting form data:', formData);
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
        response = await fetch(`http://localhost:5000/api/students/${formData._id}`, {
          method: "PUT",
          headers: {}, // Let browser set Content-Type for FormData
          body: data,
        });
      } else {
        // Register new
        response = await fetch("http://localhost:5000/api/students", {
          method: "POST",
          body: data,
        });
      }

      console.log('[DEBUG] Backend response status:', response.status);
      if (response.ok) {
        const updated = await response.json();
        console.log('[DEBUG] Registration/update success:', updated);
        if (isEditMode) {
          alert("Profile updated successfully!");
          localStorage.setItem("studentData", JSON.stringify(updated));
         navigate("/student-dashboard");
        } else {
          navigate("/thank-you");
        }
      } else {
        let errorMsg = "Failed to register student";
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
        console.log('[DEBUG] Registration failed:', errorMsg);
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
    if (!stepValid()) {
      setStepWarning("Please fill all required fields correctly before proceeding.");
      // Set errors for all fields in this step
      const errs = { ...errors };
      if (currentStep === 1) {
        if (!formData.fullName.trim() || formData.fullName.length < 2) errs.fullName = "Full Name is required (min 2 chars)";
        if (!validateEmail(formData.email)) errs.email = "Valid email required";
        
        // Add password validation for new registrations
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
        if (!formData.countryCode) errs.phone = "Country code required";
        if (!/^\d{10}$/.test(formData.phone)) errs.phone = "Phone must be exactly 10 digits";
      }
      if (currentStep === 2) {
        if (!formData.university.trim()) errs.university = "University/College is required";
        if (!formData.degree.trim()) errs.degree = "Degree is required";
        if (!validateYear(formData.passingDate)) errs.passingDate = "Valid passing year required";
        if (!validateSkills(formData.skills)) errs.skills = "At least one skill required";
      }
      if (currentStep === 3) {
        if (!formData.jobRole.trim()) errs.jobRole = "Preferred Job Role is required";
        if (!formData.preferredLocation.trim()) errs.preferredLocation = "Preferred Location is required";
      }
      setErrors(errs);
      return;
    }
    setStepWarning("");
    setCurrentStep(currentStep + 1);
  };
  const prevStep = () => setCurrentStep(currentStep - 1);

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
        formData.university.trim() !== "" &&
        formData.degree.trim() !== "" &&
        validateYear(formData.passingDate) &&
        validateSkills(formData.skills)
      );
    }
    if (currentStep === 3) {
      return (
        formData.jobRole.trim() !== "" &&
        formData.preferredLocation.trim() !== ""
      );
    }
    return true;
  };

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
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                    required
                  />
                  {errors.fullName && <span className="text-red-600 text-xs">{errors.fullName}</span>}
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
                  {errors.email && <span className="text-red-600 text-xs">{errors.email}</span>}
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
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                        required
                      />
                      {errors.password && <span className="text-red-600 text-xs">{errors.password}</span>}
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
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base sm:text-lg"
                        required
                      />
                      {errors.confirmPassword && <span className="text-red-600 text-xs">{errors.confirmPassword}</span>}
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={e => setFormData(f => ({ ...f, countryCode: e.target.value }))}
                      className="px-2 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base"
                      required
                    >
                      {countryList.map(opt => (
                        <option key={opt.code} value={opt.phoneCode}>{opt.label}</option>
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
                      className="flex-1 px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base"
                      maxLength={10}
                      required
                    />
                  </div>
                  {errors.phone && <span className="text-red-600 text-xs">{errors.phone}</span>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Gender</label>
                  <div className="flex gap-4">
                    <label><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male</label>
                    <label><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female</label>
                    <label><input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} /> Other</label>
                  </div>
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
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base"
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
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base mt-2"
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
                        className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base"
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
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base mt-2"
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
                        className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base"
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
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base"
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
                    required
                  />
                  {errors.university && <span className="text-red-600 text-xs">{errors.university}</span>}
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
                  {errors.degree && <span className="text-red-600 text-xs">{errors.degree}</span>}
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
                  {errors.passingDate && <span className="text-red-600 text-xs">{errors.passingDate}</span>}
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
                    required
                  />
                  {errors.skills && <span className="text-red-600 text-xs">{errors.skills}</span>}
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
                  {errors.jobRole && <span className="text-red-600 text-xs">{errors.jobRole}</span>}
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
                    required
                  />
                  {errors.preferredLocation && <span className="text-red-600 text-xs">{errors.preferredLocation}</span>}
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
                      required
                    />
                    {errors.resume && <span className="text-red-600 text-xs">{errors.resume}</span>}
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

export default StudentForm;
