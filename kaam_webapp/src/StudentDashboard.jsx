import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

const countryList = [
  { code: 'IN', label: '🇮🇳 India', phoneCode: '+91' },
  { code: 'US', label: '🇺🇸 United States', phoneCode: '+1' },
  { code: 'GB', label: '🇬🇧 United Kingdom', phoneCode: '+44' },
  { code: 'CA', label: '🇨🇦 Canada', phoneCode: '+1' },
  { code: 'AU', label: '🇦🇺 Australia', phoneCode: '+61' },
  { code: 'OTHERS', label: 'Others', phoneCode: '' },
];
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
};

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Add a default field template at the top of the component
  const defaultStudentFields = {
    fullName: '',
    email: '',
    country: 'IN',
    otherCountry: '',
    countryCode: '+91',
    phone: '',
    university: '',
    degree: '',
    specialization: '',
    passingDate: '',
    cgpa: '',
    skills: '',
    jobRole: '',
    preferredLocation: '',
    currentLocation: '',
    resume: null,
    photo: null,
    linkedin: '',
    state: '',
    otherState: '',
    city: '',
    otherCity: '',
    gender: 'Other',
  };

  useEffect(() => {
    const email = localStorage.getItem("studentEmail");
    const storedData = localStorage.getItem("studentData");
    const storedProfile = localStorage.getItem("studentProfile");

    if (storedProfile) {
      // If we have profile data from Google OAuth, use that
      setStudentData(JSON.parse(storedProfile));
    } else if (storedData) {
      // Fallback to studentData if no profile
      setStudentData(JSON.parse(storedData));
    } else if (email) {
      // Fetch data from backend if not in localStorage
      fetch(`http://localhost:5000/api/students/email/${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(data => {
          setStudentData(data);
          localStorage.setItem("studentData", JSON.stringify(data));
        })
        .catch(error => {
          console.error("Error fetching student data:", error);
        });
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("studentData");
    localStorage.removeItem("studentProfile");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const normalizeCity = city => city.replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mobile-no-scroll">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container-responsive">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-4 drop-shadow-lg">
                Student Dashboard
              </h1>
              <p className="text-blue-100 text-base sm:text-lg font-medium">
                Welcome back, {studentData?.fullName || "Student"}! 🎓
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-touch bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 transition-all duration-200 text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-responsive py-6 sm:py-8 lg:py-12">
        {studentData ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl sm:text-3xl font-bold">
                        {studentData.fullName?.charAt(0)?.toUpperCase() || "S"}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {studentData.fullName}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {studentData.degree} • {studentData.university}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📧</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm sm:text-base text-gray-900">{studentData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm">⚧️</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Gender</p>
                        <p className="text-sm sm:text-base text-gray-900">{studentData.gender}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📱</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="text-sm sm:text-base text-gray-900">{studentData.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📍</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                        <p className="text-sm sm:text-base text-gray-900">{studentData.currentLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Edit Profile Button */}
                <div className="flex justify-center mt-6">
                  <button
                    className="btn-touch px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    onClick={() => {
                      setEditForm({ ...defaultStudentFields, ...studentData });
                      setEditModalOpen(true);
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Education & Skills */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <span className="text-2xl mr-3">🎓</span>
                    Education & Skills
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">University</p>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{studentData.university}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Degree</p>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{studentData.degree}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Passing Year</p>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{studentData.passingDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Skills</p>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{studentData.skills}</p>
                    </div>
                  </div>
                </div>

                {/* Career Preferences */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <span className="text-2xl mr-3">💼</span>
                    Career Preferences
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Preferred Role</p>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{studentData.jobRole}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Preferred Location</p>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{studentData.preferredLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl sm:text-8xl mb-4">🎓</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard!
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
              Your profile information will appear here once you complete your registration.
            </p>
            <button
              onClick={() => navigate("/student-register")}
              className="btn-touch bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-base sm:text-lg"
            >
              Complete Registration
            </button>
          </div>
        )}
      </div>

      {/* Modal for Edit Profile */}
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        contentLabel="Edit Profile"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
            <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={() => setEditModalOpen(false)}>&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <form id="edit-profile-form" onSubmit={async e => {
              e.preventDefault();
              setEditLoading(true);
              try {
                const { _id, resume, photo, state, city, otherState, otherCity, country, currentLocation, ...formData } = editForm;
                if (formData.city) formData.city = normalizeCity(formData.city);
                if (formData.otherCity) formData.otherCity = normalizeCity(formData.otherCity);
                const formDataToSend = new FormData();
                // Compose currentLocation as in registration
                let locationToSend = '';
                let stateToSend = state;
                let cityToSend = city;
                let otherStateToSend = otherState;
                let otherCityToSend = otherCity;
                if (country === 'IN') {
                  locationToSend = (state === 'Others' ? otherState : state) + ', ' + (state === 'Others' ? otherCity : city);
                  // Always send state/city/otherState/otherCity
                  formDataToSend.append('state', state);
                  formDataToSend.append('city', city);
                  formDataToSend.append('otherState', otherState);
                  formDataToSend.append('otherCity', otherCity);
                } else {
                  locationToSend = currentLocation;
                  formDataToSend.append('state', '');
                  formDataToSend.append('city', '');
                  formDataToSend.append('otherState', '');
                  formDataToSend.append('otherCity', '');
                }
                formDataToSend.append('currentLocation', locationToSend);
                // Append all other fields except state/city/otherState/otherCity
                for (const key in formData) {
                  if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                  }
                }
                if (resume instanceof File) {
                  formDataToSend.append('resume', resume);
                }
                if (photo instanceof File) {
                  formDataToSend.append('photo', photo);
                }
                const response = await fetch(`http://localhost:5000/api/students/${editForm._id}`, {
                  method: "PUT",
                  body: formDataToSend,
                });
                if (response.ok) {
                  const updated = await response.json();
                  setStudentData(updated);
                  localStorage.setItem("studentData", JSON.stringify(updated));
                  setEditModalOpen(false);
                } else {
                  const errorText = await response.text();
                  alert("Failed to update profile: " + errorText);
                }
              } catch (err) {
                alert("Error updating profile: " + err.message);
              } finally {
                setEditLoading(false);
              }
            }}>
              
                            {/* Personal Information Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">👤 Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                    <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.fullName || ""} onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))} required />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input type="email" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.email || ""} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="border border-gray-300 rounded px-3 py-2 text-sm pr-10 w-full" 
                        value={editForm.password || ""} 
                        onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} 
                        placeholder="Enter new password (optional)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep current password</p>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Phone</label>
                    <div className="flex gap-2">
                      <select value={editForm.countryCode || '+91'} onChange={e => setEditForm(f => ({ ...f, countryCode: e.target.value }))} className="px-2 py-2 border border-gray-300 rounded">
                        {countryList.map(opt => (
                          <option key={opt.code} value={opt.phoneCode}>{opt.label}</option>
                        ))}
                      </select>
                      <input type="text" value={editForm.phone || ''} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} className="flex-1 px-3 py-2 border border-gray-300 rounded" maxLength={10} required />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Gender</label>
                    <select
                      value={editForm.gender || 'Other'}
                      onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))}
                      className="border border-gray-300 rounded px-3 py-2 text-sm"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Education & Skills Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">🎓 Education & Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">University</label>
                    <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.university || ""} onChange={e => setEditForm(f => ({ ...f, university: e.target.value }))} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Degree</label>
                    <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.degree || ""} onChange={e => setEditForm(f => ({ ...f, degree: e.target.value }))} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Passing Year</label>
                    <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.passingDate || ""} onChange={e => setEditForm(f => ({ ...f, passingDate: e.target.value }))} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">CGPA / Percentage</label>
                    <input type="number" min="0" max="100" step="0.01" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.cgpa || ""} onChange={e => setEditForm(f => ({ ...f, cgpa: e.target.value }))} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Skills</label>
                    <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.skills || ""} onChange={e => setEditForm(f => ({ ...f, skills: e.target.value }))} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Specialization</label>
                    <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.specialization || ""} onChange={e => setEditForm(f => ({ ...f, specialization: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Career Preferences Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">💼 Career Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Preferred Role</label>
                    <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.jobRole || ""} onChange={e => setEditForm(f => ({ ...f, jobRole: e.target.value }))} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Preferred Location</label>
                    <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.preferredLocation || ""} onChange={e => setEditForm(f => ({ ...f, preferredLocation: e.target.value }))} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">LinkedIn</label>
                    <input type="url" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.linkedin || ""} onChange={e => setEditForm(f => ({ ...f, linkedin: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">📍 Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Country</label>
                    <select
                      value={editForm.country || 'IN'}
                      onChange={e => setEditForm(f => ({
                        ...f,
                        country: e.target.value,
                        otherCountry: '',
                        state: '',
                        city: '',
                        otherState: '',
                        otherCity: '',
                        currentLocation: '',
                      }))}
                      className="border border-gray-300 rounded px-3 py-2 text-sm"
                      required
                    >
                      {countryList.map(opt => (
                        <option key={opt.code} value={opt.code}>{opt.label}</option>
                      ))}
                    </select>
                    {editForm.country === 'OTHERS' && (
                      <input
                        type="text"
                        value={editForm.otherCountry || ''}
                        onChange={e => setEditForm(f => ({ ...f, otherCountry: e.target.value }))}
                        className="border border-gray-300 rounded px-3 py-2 text-sm mt-2"
                        placeholder="Enter your country"
                        required
                      />
                    )}
                  </div>
                  {editForm.country === 'IN' ? (
                    <>
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">State</label>
                        <select
                          value={editForm.state || ''}
                          onChange={e => setEditForm(f => ({ ...f, state: e.target.value, city: '', otherState: '', otherCity: '' }))}
                          className="border border-gray-300 rounded px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Select State</option>
                          {indianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {editForm.state === 'Others' && (
                          <input
                            type="text"
                            value={editForm.otherState || ''}
                            onChange={e => setEditForm(f => ({ ...f, otherState: e.target.value }))}
                            className="border border-gray-300 rounded px-3 py-2 text-sm mt-2"
                            placeholder="Enter your state"
                            required
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">City</label>
                        {editForm.state === 'Others' ? (
                          <input
                            type="text"
                            value={editForm.otherCity || ''}
                            onChange={e => setEditForm(f => ({ ...f, otherCity: e.target.value }))}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                            placeholder="Enter your city"
                            required
                          />
                        ) : (
                          <input
                            type="text"
                            list="city-list"
                            value={editForm.city || ''}
                            onChange={e => setEditForm(f => ({ ...f, city: e.target.value, otherCity: '' }))}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                            placeholder="Type or select your city"
                            required
                            disabled={!editForm.state}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-600 mb-1">Current Location</label>
                      <input
                        type="text"
                        value={editForm.currentLocation || ''}
                        onChange={e => setEditForm(f => ({ ...f, currentLocation: e.target.value }))}
                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="Enter your city and country"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Files Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">📁 Files</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Update Resume (PDF, max 2MB)</label>
                    <input type="file" accept="application/pdf" onChange={e => setEditForm(f => ({ ...f, resume: e.target.files[0] }))} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Update Profile Photo (Image, max 2MB)</label>
                    <input type="file" accept="image/*" onChange={e => setEditForm(f => ({ ...f, photo: e.target.files[0] }))} />
                  </div>
                </div>
              </div>
              <datalist id="city-list">
                {(citiesByState[editForm.state] || []).map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </form>
          </div>
          
          {/* Footer with buttons */}
          <div className="flex gap-3 justify-end p-6 border-t border-gray-200 bg-gray-50">
            <button 
              type="button" 
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors" 
              onClick={() => setEditModalOpen(false)} 
              disabled={editLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="edit-profile-form"
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center justify-center transition-colors" 
              disabled={editLoading}
            >
              {editLoading ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentDashboard; 