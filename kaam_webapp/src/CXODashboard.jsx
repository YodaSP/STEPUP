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

const CXODashboard = () => {
  const [cxoData, setCxoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Add a default field template at the top of the component
  const defaultCXOFields = {
    // Section 1: Personal Information
    fullName: '',
    email: '',
    country: 'IN',
    otherCountry: '',
    countryCode: '+91',
    phone: '',
    currentLocation: '',
    dateOfBirth: '',
    maritalStatus: 'Other',
    gender: 'Other',
    state: '',
    otherState: '',
    city: '',
    otherCity: '',

    // Section 2: Professional Information
    currentDesignation: '',
    totalYearsExperience: '',
    linkedinProfile: '',
    careerObjective: '',

    // Section 3: Education
    highestQualification: '',
    institutionName: '',
    yearOfCompletion: '',
    specialization: '',
    additionalCertifications: '',

    // Section 4: Work Experience
    workExperience: [],

    // Section 5: Skills
    technicalSkills: '',
    softSkills: '',
    toolsTechnologies: '',
    languagesKnown: '',

    // Section 6: Additional Information
    awardsRecognition: '',
    hobbiesInterests: '',
    professionalMemberships: '',

    // Legacy fields (for backward compatibility)
    company: '',
    position: '',
    experience: '',
    industry: '',
    preferredLocation: '',
    skills: '',

    // Files
    resume: null,
    photo: null,
  };

  useEffect(() => {
    const email = localStorage.getItem("cxoEmail");
    const storedData = localStorage.getItem("cxoData");

    console.log("🔍 CXO Dashboard: Email from localStorage:", email);
    console.log("🔍 CXO Dashboard: Stored data exists:", !!storedData);

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("🔍 CXO Dashboard: Parsed stored data:", parsedData);
      setCxoData(parsedData);
      setIsLoading(false);
    } else if (email) {
      // Fetch data from backend if not in localStorage
      console.log("🔍 CXO Dashboard: Fetching data from backend for email:", email);
      
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/executives/email/${encodeURIComponent(email)}`);
          console.log("🔍 CXO Dashboard: Backend response status:", response.status);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("🔍 CXO Dashboard: Backend data received:", data);
          setCxoData(data);
          localStorage.setItem("cxoData", JSON.stringify(data));
        } catch (error) {
          console.error("❌ CXO Dashboard: Error fetching CXO data:", error);
          // Show empty state if fetch fails
        } finally {
          setIsLoading(false);
        }
      };

      // Add a small delay to ensure backend is ready
      setTimeout(fetchData, 100);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cxoEmail");
    localStorage.removeItem("cxoData");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const normalizeCity = city => city.replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 mobile-no-scroll">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container-responsive">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-4 drop-shadow-lg">
                CXO Dashboard
              </h1>
              <p className="text-green-100 text-base sm:text-lg font-medium">
                Welcome back, {cxoData?.fullName || "Executive"}! 🧑‍💼
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
        {cxoData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl sm:text-3xl font-bold">
                      {cxoData.fullName?.charAt(0)?.toUpperCase() || "C"}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {cxoData.fullName}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {cxoData.currentDesignation || cxoData.position} • {cxoData.company}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">📧</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-sm sm:text-base text-gray-900">{cxoData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">📱</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                      <p className="text-sm sm:text-base text-gray-900">{cxoData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">📍</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                      <p className="text-sm sm:text-base text-gray-900">{cxoData.currentLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">⚧️</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Gender</p>
                      <p className="text-sm sm:text-base text-gray-900">{cxoData.gender}</p>
                    </div>
                  </div>

                  {cxoData.dateOfBirth && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-sm">🎂</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Date of Birth</p>
                        <p className="text-sm sm:text-base text-gray-900">{cxoData.dateOfBirth}</p>
                      </div>
                    </div>
                  )}

                  {cxoData.maritalStatus && cxoData.maritalStatus !== 'Other' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-sm">💍</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Marital Status</p>
                        <p className="text-sm sm:text-base text-gray-900">{cxoData.maritalStatus}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Edit Profile Button */}
              <div className="flex justify-center mt-6">
                <button
                  className="btn-touch px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-full shadow-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  onClick={() => {
                    setEditForm(prev => {
                      const base = { ...defaultCXOFields, ...cxoData, ...prev };
                      if (!base._id && cxoData && cxoData._id) base._id = cxoData._id;
                      const countryCode = countryList.find(opt =>
                        opt.code === base.country || opt.label === base.country
                      )?.code || 'IN';
                      base.country = countryCode;
                      // Prefill state/city from currentLocation if missing
                      if (base.country === 'IN' && (!base.state || !base.city) && base.currentLocation) {
                        const [state, city] = base.currentLocation.split(',').map(s => s.trim());
                        if (!base.state) base.state = state || '';
                        if (!base.city) base.city = city || '';
                      }
                      return base;
                    });
                    setEditModalOpen(true);
                  }}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Professional Information */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <span className="text-2xl mr-3">💼</span>
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Designation</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.currentDesignation || cxoData.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Experience</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.totalYearsExperience || cxoData.experience}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Industry</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.industry}</p>
                  </div>
                </div>
                {cxoData.careerObjective && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Career Objective</p>
                    <p className="text-sm sm:text-base text-gray-900">{cxoData.careerObjective}</p>
                  </div>
                )}
              </div>

              {/* Education */}
              {(cxoData.highestQualification || cxoData.institutionName) && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <span className="text-2xl mr-3">🎓</span>
                    Education
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Highest Qualification</p>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.highestQualification}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Institution</p>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.institutionName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Year of Completion</p>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.yearOfCompletion}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Specialization</p>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.specialization || "Not specified"}</p>
                    </div>
                  </div>
                  {cxoData.additionalCertifications && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Additional Certifications</p>
                      <p className="text-sm sm:text-base text-gray-900">{cxoData.additionalCertifications}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              {(cxoData.technicalSkills || cxoData.softSkills) && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <span className="text-2xl mr-3">🔧</span>
                    Skills & Competencies
                  </h3>
                  <div className="space-y-4">
                    {cxoData.technicalSkills && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Technical Skills</p>
                        <p className="text-sm sm:text-base text-gray-900">{cxoData.technicalSkills}</p>
                      </div>
                    )}
                    {cxoData.softSkills && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Soft Skills</p>
                        <p className="text-sm sm:text-base text-gray-900">{cxoData.softSkills}</p>
                      </div>
                    )}
                    {cxoData.toolsTechnologies && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tools & Technologies</p>
                        <p className="text-sm sm:text-base text-gray-900">{cxoData.toolsTechnologies}</p>
                      </div>
                    )}
                    {cxoData.languagesKnown && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Languages Known</p>
                        <p className="text-sm sm:text-base text-gray-900">{cxoData.languagesKnown}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {cxoData.workExperience && cxoData.workExperience.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <span className="text-2xl mr-3">💼</span>
                    Work Experience
                  </h3>
                  <div className="space-y-6">
                    {cxoData.workExperience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h4>
                            <p className="text-green-600 font-medium">{exp.companyName}</p>
                          </div>
                          <div className="text-sm text-gray-600 mt-1 sm:mt-0">
                            {exp.startDate && exp.endDate ? (
                              <span>{new Date(exp.startDate).toLocaleDateString()} - {exp.endDate === '' ? 'Present' : new Date(exp.endDate).toLocaleDateString()}</span>
                            ) : (
                              <span>Duration not specified</span>
                            )}
                          </div>
                        </div>
                        {exp.keyResponsibilities && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Key Responsibilities</p>
                            <p className="text-sm text-gray-900">{exp.keyResponsibilities}</p>
                          </div>
                        )}
                        {exp.majorAchievements && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Major Achievements</p>
                            <p className="text-sm text-gray-900">{exp.majorAchievements}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(cxoData.awardsRecognition || cxoData.hobbiesInterests || cxoData.professionalMemberships) && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <span className="text-2xl mr-3">📋</span>
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {cxoData.awardsRecognition && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Awards & Recognition</p>
                        <p className="text-sm sm:text-base text-gray-900">{cxoData.awardsRecognition}</p>
                      </div>
                    )}
                    {cxoData.hobbiesInterests && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Hobbies & Interests</p>
                        <p className="text-sm sm:text-base text-gray-900">{cxoData.hobbiesInterests}</p>
                      </div>
                    )}
                    {cxoData.professionalMemberships && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Professional Memberships</p>
                        <p className="text-sm sm:text-base text-gray-900">{cxoData.professionalMemberships}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Preferences & Contact */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <span className="text-2xl mr-3">📈</span>
                  Preferences & Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Preferred Location</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.preferredLocation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">LinkedIn Profile</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">
                      {cxoData.linkedinProfile ? (
                        <a 
                          href={cxoData.linkedinProfile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 underline"
                        >
                          View Profile
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl sm:text-8xl mb-4">🧑‍💼</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Welcome to Your Executive Dashboard!
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
              Your profile information will appear here once you complete your registration.
            </p>
            <button
              onClick={() => navigate("/executive-register")}
              className="btn-touch bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 text-base sm:text-lg"
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
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative mt-12 mb-12 px-8 sm:px-16 max-h-[85vh] overflow-y-auto">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setEditModalOpen(false)}>&times;</button>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Executive Profile</h2>
          
          <form onSubmit={async e => {
            e.preventDefault();
            setEditLoading(true);
            try {
              const { _id, ...allFields } = editForm;
              const execId = _id || (cxoData && cxoData._id);
              if (!execId) {
                alert('Error: Executive ID missing. Cannot update profile.');
                setEditLoading(false);
                return;
              }
              const data = new FormData();
              for (let key in allFields) {
                if (key === 'currentLocation') {
                  if (allFields.country === 'IN') {
                    let loc = allFields.state === 'Others' ? allFields.otherState : allFields.state;
                    loc += ', ' + (allFields.state === 'Others' ? allFields.otherCity : allFields.city);
                    data.append('currentLocation', loc);
                  } else {
                    data.append('currentLocation', allFields.currentLocation);
                  }
                } else if (key !== 'state' && key !== 'city' && key !== 'otherState' && key !== 'otherCity' && key !== 'otherCountry') {
                  data.append(key, allFields[key] ?? '');
                }
              }
              if (allFields.resume instanceof File) data.append('resume', allFields.resume);
              if (allFields.photo instanceof File) data.append('photo', allFields.photo);
              
              const response = await fetch(`http://localhost:5000/api/executives/${execId}`, {
                method: "PUT",
                body: data,
              });
              
              if (response.ok) {
                const updated = await response.json();
                setCxoData(updated);
                localStorage.setItem("cxoData", JSON.stringify(updated));
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
            <div className="mb-8">
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
                  <label className="text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
                  <input type="date" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.dateOfBirth || ""} onChange={e => setEditForm(f => ({ ...f, dateOfBirth: e.target.value }))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Marital Status</label>
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.maritalStatus || "Other"} onChange={e => setEditForm(f => ({ ...f, maritalStatus: e.target.value }))}>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Gender</label>
                  <div className="flex gap-4">
                    <label className="flex items-center"><input type="radio" name="gender" value="Male" checked={editForm.gender === 'Male'} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))} className="mr-2" /> Male</label>
                    <label className="flex items-center"><input type="radio" name="gender" value="Female" checked={editForm.gender === 'Female'} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))} className="mr-2" /> Female</label>
                    <label className="flex items-center"><input type="radio" name="gender" value="Other" checked={editForm.gender === 'Other'} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))} className="mr-2" /> Other</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">💼 Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Current Designation</label>
                  <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.currentDesignation || editForm.position || ""} onChange={e => setEditForm(f => ({ ...f, currentDesignation: e.target.value }))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Total Years Experience</label>
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.totalYearsExperience || editForm.experience || ""} onChange={e => setEditForm(f => ({ ...f, totalYearsExperience: e.target.value }))}>
                    <option value="">Select experience</option>
                    <option value="0-2 years">0-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10-15 years">10-15 years</option>
                    <option value="15-20 years">15-20 years</option>
                    <option value="20+ years">20+ years</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Company</label>
                  <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.company || ""} onChange={e => setEditForm(f => ({ ...f, company: e.target.value }))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Industry</label>
                  <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.industry || ""} onChange={e => setEditForm(f => ({ ...f, industry: e.target.value }))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">LinkedIn Profile</label>
                  <input type="url" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.linkedinProfile || ""} onChange={e => setEditForm(f => ({ ...f, linkedinProfile: e.target.value }))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Preferred Location</label>
                  <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.preferredLocation || ""} onChange={e => setEditForm(f => ({ ...f, preferredLocation: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">🎓 Education</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Highest Qualification</label>
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.highestQualification || ""} onChange={e => setEditForm(f => ({ ...f, highestQualification: e.target.value }))}>
                    <option value="">Select qualification</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="MBA">MBA</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Institution Name</label>
                  <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.institutionName || ""} onChange={e => setEditForm(f => ({ ...f, institutionName: e.target.value }))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Year of Completion</label>
                  <input type="number" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.yearOfCompletion || ""} onChange={e => setEditForm(f => ({ ...f, yearOfCompletion: e.target.value }))} min="1950" max="2030" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Specialization</label>
                  <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.specialization || ""} onChange={e => setEditForm(f => ({ ...f, specialization: e.target.value }))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Additional Certifications</label>
                  <textarea className="border border-gray-300 rounded px-3 py-2 text-sm" rows="3" value={editForm.additionalCertifications || ""} onChange={e => setEditForm(f => ({ ...f, additionalCertifications: e.target.value }))} placeholder="e.g., PMP, AWS Certified, etc." />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">🔧 Skills & Competencies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Technical Skills</label>
                  <textarea className="border border-gray-300 rounded px-3 py-2 text-sm" rows="3" value={editForm.technicalSkills || ""} onChange={e => setEditForm(f => ({ ...f, technicalSkills: e.target.value }))} placeholder="e.g., JavaScript, Python, React, AWS" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Soft Skills</label>
                  <textarea className="border border-gray-300 rounded px-3 py-2 text-sm" rows="3" value={editForm.softSkills || ""} onChange={e => setEditForm(f => ({ ...f, softSkills: e.target.value }))} placeholder="e.g., Leadership, Communication, Problem Solving" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Tools & Technologies</label>
                  <textarea className="border border-gray-300 rounded px-3 py-2 text-sm" rows="3" value={editForm.toolsTechnologies || ""} onChange={e => setEditForm(f => ({ ...f, toolsTechnologies: e.target.value }))} placeholder="e.g., Jira, Slack, Salesforce" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Languages Known</label>
                  <textarea className="border border-gray-300 rounded px-3 py-2 text-sm" rows="3" value={editForm.languagesKnown || ""} onChange={e => setEditForm(f => ({ ...f, languagesKnown: e.target.value }))} placeholder="e.g., English, Hindi, Spanish" />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">📋 Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Awards & Recognition</label>
                  <textarea className="border border-gray-300 rounded px-3 py-2 text-sm" rows="3" value={editForm.awardsRecognition || ""} onChange={e => setEditForm(f => ({ ...f, awardsRecognition: e.target.value }))} placeholder="e.g., Employee of the Year, Industry Awards" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Hobbies & Interests</label>
                  <textarea className="border border-gray-300 rounded px-3 py-2 text-sm" rows="3" value={editForm.hobbiesInterests || ""} onChange={e => setEditForm(f => ({ ...f, hobbiesInterests: e.target.value }))} placeholder="e.g., Reading, Traveling, Sports" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Professional Memberships</label>
                  <textarea className="border border-gray-300 rounded px-3 py-2 text-sm" rows="3" value={editForm.professionalMemberships || ""} onChange={e => setEditForm(f => ({ ...f, professionalMemberships: e.target.value }))} placeholder="e.g., IEEE, PMI, Local Chamber of Commerce" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Career Objective</label>
                  <textarea className="border border-gray-300 rounded px-3 py-2 text-sm" rows="3" value={editForm.careerObjective || ""} onChange={e => setEditForm(f => ({ ...f, careerObjective: e.target.value }))} placeholder="Brief professional summary and career objectives" />
                </div>
              </div>
            </div>

            {/* Files Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">📄 Files</h3>
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

            {/* Location Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">📍 Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Country</label>
                  <select
                    value={editForm.country || 'IN'}
                    onChange={e => setEditForm(f => {
                      const newCountry = e.target.value;
                      if (f.country !== newCountry) {
                        return {
                          ...f,
                          country: newCountry,
                          otherCountry: '',
                          state: '',
                          city: '',
                          otherState: '',
                          otherCity: '',
                          currentLocation: '',
                        };
                      }
                      return { ...f, country: newCountry };
                    })}
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
            <datalist id="city-list">
              {(citiesByState[editForm.state] || []).map(city => (
                <option key={city} value={city} />
              ))}
            </datalist>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8 border-t pt-6">
              <button 
                type="button" 
                className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors" 
                onClick={() => setEditModalOpen(false)} 
                disabled={editLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center" 
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
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CXODashboard; 