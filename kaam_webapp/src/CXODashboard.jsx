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
  'Delhi': ['New Delhi'],
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
    fullName: '',
    email: '',
    country: 'IN',
    otherCountry: '',
    countryCode: '+91',
    phone: '',
    company: '',
    position: '',
    experience: '',
    industry: '',
    currentLocation: '',
    preferredLocation: '',
    linkedinProfile: '',
    resume: null,
    photo: null,
    state: '',
    otherState: '',
    city: '',
    otherCity: '',
    gender: 'Other',
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
    } else if (email) {
      // Fetch data from backend if not in localStorage
      console.log("🔍 CXO Dashboard: Fetching data from backend for email:", email);
      fetch(`http://localhost:5000/api/executives/email/${encodeURIComponent(email)}`)
        .then(response => {
          console.log("🔍 CXO Dashboard: Backend response status:", response.status);
          return response.json();
        })
        .then(data => {
          console.log("🔍 CXO Dashboard: Backend data received:", data);
          setCxoData(data);
          localStorage.setItem("cxoData", JSON.stringify(data));
        })
        .catch(error => {
          console.error("❌ CXO Dashboard: Error fetching CXO data:", error);
        });
    }
    setIsLoading(false);
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
                    {cxoData.position} • {cxoData.company}
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
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Position</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Industry</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Experience</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{cxoData.experience}</p>
                  </div>
                </div>
              </div>

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
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setEditModalOpen(false)}>&times;</button>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>
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
              // Debug: print editForm and position before sending
              console.log('DEBUG: editForm before submit:', editForm);
              console.log('DEBUG: position value:', allFields.position);
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
                  data.append(key, allFields[key] ?? ''); // Always send all fields, default to empty string
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Editable fields */}
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
                <label className="text-xs font-semibold text-gray-600 mb-1">Company</label>
                <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.company || ""} onChange={e => setEditForm(f => ({ ...f, company: e.target.value }))} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">Position</label>
                <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.position || ""} onChange={e => setEditForm(f => ({ ...f, position: e.target.value }))} required placeholder="Enter your position/title" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">Industry</label>
                <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.industry || ""} onChange={e => setEditForm(f => ({ ...f, industry: e.target.value }))} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">Experience</label>
                <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.experience || ""} onChange={e => setEditForm(f => ({ ...f, experience: e.target.value }))} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">Preferred Location</label>
                <input type="text" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.preferredLocation || ""} onChange={e => setEditForm(f => ({ ...f, preferredLocation: e.target.value }))} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">LinkedIn</label>
                <input type="url" className="border border-gray-300 rounded px-3 py-2 text-sm" value={editForm.linkedinProfile || ""} onChange={e => setEditForm(f => ({ ...f, linkedinProfile: e.target.value }))} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">Update Resume (PDF, max 2MB)</label>
                <input type="file" accept="application/pdf" onChange={e => setEditForm(f => ({ ...f, resume: e.target.files[0] }))} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">Update Profile Photo (Image, max 2MB)</label>
                <input type="file" accept="image/*" onChange={e => setEditForm(f => ({ ...f, photo: e.target.files[0] }))} />
              </div>
              {/* Add country/state/city fields */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">Country</label>
                <select
                  value={editForm.country || 'IN'}
                  onChange={e => setEditForm(f => {
                    const newCountry = e.target.value;
                    // Only reset state/city if country is changed
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
                  className="border border-gray-300 rounded px-3 py-2 text-sm mb-2"
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
                    className="border border-gray-300 rounded px-3 py-2 text-sm mb-2"
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
                      className="border border-gray-300 rounded px-3 py-2 text-sm mb-2"
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
                        className="border border-gray-300 rounded px-3 py-2 text-sm mb-2"
                        placeholder="Enter your state"
                        required
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      value={editForm.city || ''}
                      onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}
                      className="border border-gray-300 rounded px-3 py-2 text-sm w-full mb-2"
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1">Current Location</label>
                  <input
                    type="text"
                    value={editForm.currentLocation || ''}
                    onChange={e => setEditForm(f => ({ ...f, currentLocation: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-2 text-sm mb-2"
                    placeholder="Enter your city and country"
                    required
                  />
                </div>
              )}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">Gender</label>
                <div className="flex gap-4">
                  <label><input type="radio" name="gender" value="Male" checked={editForm.gender === 'Male'} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))} /> Male</label>
                  <label><input type="radio" name="gender" value="Female" checked={editForm.gender === 'Female'} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))} /> Female</label>
                  <label><input type="radio" name="gender" value="Other" checked={editForm.gender === 'Other'} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))} /> Other</label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300" onClick={() => setEditModalOpen(false)} disabled={editLoading}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center justify-center" disabled={editLoading}>{editLoading ? (<span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>) : null} {editLoading ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CXODashboard; 