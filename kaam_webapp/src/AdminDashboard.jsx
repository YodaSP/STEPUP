import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import Modal from "react-modal";

const AdminDashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");
  const [searchField, setSearchField] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  // Add sortKey state for each tab
  const [studentSortKey, setStudentSortKey] = useState("fullName");
  const [executiveSortKey, setExecutiveSortKey] = useState("fullName");
  const [employerSortKey, setEmployerSortKey] = useState("companyName");

  // Define searchable fields for each tab
  const searchFields = {
    students: [
      { label: "Name", value: "fullName" },
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone" },
      { label: "University", value: "university" },
      { label: "Degree", value: "degree" },
      { label: "Location", value: "currentLocation" },
    ],
    executives: [
      { label: "Name", value: "fullName" },
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone" },
      { label: "Company", value: "company" },
      { label: "Position", value: "position" },
      { label: "Industry", value: "industry" },
      { label: "Location", value: "currentLocation" },
    ],
    employers: [
      { label: "Company Name", value: "companyName" },
      { label: "Email", value: "email" },
      { label: "Contact Person", value: "contactPerson" },
      { label: "Phone", value: "phone" },
      { label: "Industry", value: "industry" },
      { label: "Location", value: "location" },
    ],
  };

  // Modal field configs for each type
  const modalFields = {
    students: [
      { label: "Name", key: "fullName" },
      { label: "Email", key: "email" },
      { label: "Phone", key: "phone" },
      { label: "Country", key: "country" },
      { label: "Other Country", key: "otherCountry" },
      { label: "Country Code", key: "countryCode" },
      { label: "State", key: "state" },
      { label: "Other State", key: "otherState" },
      { label: "City", key: "city" },
      { label: "Other City", key: "otherCity" },
      { label: "Gender", key: "gender" },
      { label: "University", key: "university" },
      { label: "Degree", key: "degree" },
      { label: "Specialization", key: "specialization" },
      { label: "Passing Year", key: "passingDate" },
      { label: "CGPA/Percentage", key: "cgpa" },
      { label: "Skills", key: "skills" },
      { label: "Job Role", key: "jobRole" },
      { label: "Preferred Location", key: "preferredLocation" },
      { label: "Current Location", key: "currentLocation" },
      { label: "LinkedIn", key: "linkedin" },
      { label: "Resume", key: "resume" },
      { label: "Photo", key: "photo" },
    ],
    executives: [
      { label: "Name", key: "fullName" },
      { label: "Email", key: "email" },
      { label: "Phone", key: "phone" },
      { label: "Country", key: "country" },
      { label: "Other Country", key: "otherCountry" },
      { label: "Country Code", key: "countryCode" },
      { label: "State", key: "state" },
      { label: "Other State", key: "otherState" },
      { label: "City", key: "city" },
      { label: "Other City", key: "otherCity" },
      { label: "Current Location", key: "currentLocation" },
      { label: "Date of Birth", key: "dateOfBirth" },
      { label: "Marital Status", key: "maritalStatus" },
      { label: "Gender", key: "gender" },
      { label: "Current Designation", key: "currentDesignation" },
      { label: "Total Years Experience", key: "totalYearsExperience" },
      { label: "LinkedIn Profile", key: "linkedinProfile" },
      { label: "Career Objective", key: "careerObjective" },
      { label: "Highest Qualification", key: "highestQualification" },
      { label: "Institution Name", key: "institutionName" },
      { label: "Year of Completion", key: "yearOfCompletion" },
      { label: "Specialization", key: "specialization" },
      { label: "Additional Certifications", key: "additionalCertifications" },
      { label: "Work Experience", key: "workExperience" },
      { label: "Technical Skills", key: "technicalSkills" },
      { label: "Soft Skills", key: "softSkills" },
      { label: "Tools & Technologies", key: "toolsTechnologies" },
      { label: "Languages Known", key: "languagesKnown" },
      { label: "Awards & Recognition", key: "awardsRecognition" },
      { label: "Hobbies & Interests", key: "hobbiesInterests" },
      { label: "Professional Memberships", key: "professionalMemberships" },
      // Legacy fields
      { label: "Company", key: "company" },
      { label: "Position", key: "position" },
      { label: "Industry", key: "industry" },
      { label: "Experience", key: "experience" },
      { label: "Preferred Location", key: "preferredLocation" },
      { label: "Skills", key: "skills" },
      { label: "Resume", key: "resume" },
      { label: "Photo", key: "photo" },
    ],
    employers: [
      { label: "Company Name", key: "companyName" },
      { label: "Email", key: "email" },
      { label: "Contact Person", key: "contactPerson" },
      { label: "Phone", key: "phone" },
      { label: "Industry", key: "industry" },
      { label: "Location", key: "location" },
    ],
  };

  // Filtering logic
  const getFilteredList = (list, type) => {
    if (!searchField || !searchValue) return list;
    return list.filter((item) => {
      const fieldValue = item[searchField];
      if (!fieldValue) return false;
      return fieldValue.toString().toLowerCase().includes(searchValue.toLowerCase());
    });
  };

  // Modal open handler
  const openDetailsModal = (entry, type) => {
    setSelectedEntry(entry);
    setSelectedType(type);
    setEditMode(false);
    setEditData(entry);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedEntry(null);
    setSelectedType(null);
    setEditMode(false);
    setEditData({});
    setModalLoading(false);
  };

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  // Download handler for private S3 files via backend presigned endpoints
  const handleDownloadFile = async (type, id, fieldKey) => {
    try {
      let endpoint = "";
      if (type === "students") {
        endpoint = `${API_BASE}/api/students/${id}/${fieldKey}`;
      } else if (type === "executives") {
        endpoint = `${API_BASE}/api/executives/${id}/${fieldKey}`;
      } else if (type === "employers" && fieldKey === "logo") {
        endpoint = `${API_BASE}/api/employers/${id}/logo`;
      }
      if (!endpoint) return;
      const res = await fetch(endpoint);
      if (!res.ok) return alert("Failed to get download link");
      const { url } = await res.json();
      if (url) {
        window.open(url, "_blank");
      }
    } catch (_e) {
      alert("Download failed");
    }
  };

  // Edit handlers
  const handleEditChange = (key, value) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };
  const handleEditSubmit = async () => {
    setModalLoading(true);
    try {
      const credentials = btoa("admin:admin");
      const headers = {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      };
      let url = "";
      let method = "PUT";
      if (selectedType === "students") {
        url = `${API_BASE}/api/students/${selectedEntry._id}`;
      } else if (selectedType === "executives") {
        url = `${API_BASE}/api/executives/${selectedEntry._id}`;
      } else if (selectedType === "employers") {
        url = `${API_BASE}/api/employers/${selectedEntry._id}`;
      }
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        // Refresh data
        await fetchAllData();
        setEditMode(false);
        setModalOpen(false);
      } else {
        alert("Failed to update entry.");
      }
    } catch (err) {
      alert("Error updating entry.");
    } finally {
      setModalLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setModalLoading(true);
    try {
      const credentials = btoa("admin:admin");
      const headers = {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      };
      let url = "";
      if (selectedType === "students") {
        url = `${API_BASE}/api/students/${selectedEntry._id}`;
      } else if (selectedType === "executives") {
        url = `${API_BASE}/api/executives/${selectedEntry._id}`;
      } else if (selectedType === "employers") {
        url = `${API_BASE}/api/employers/${selectedEntry._id}`;
      }
      const res = await fetch(url, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        await fetchAllData();
        setModalOpen(false);
      } else {
        alert("Failed to delete entry.");
      }
    } catch (err) {
      alert("Error deleting entry.");
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    testBackendConnection();
    fetchAllData();
  }, []);

  const testBackendConnection = async () => {
    try {
      console.log("🧪 Testing backend connection...");
      const response = await fetch(`${API_BASE}/api/test`);
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend connection successful:", data);
      } else {
        console.error("❌ Backend connection failed:", response.status);
      }
    } catch (error) {
      console.error("❌ Backend connection error:", error);
    }
  };

  const fetchAllData = async () => {
    try {
      // Create Basic Auth header for admin access
      const credentials = btoa("admin:admin"); // base64 encode admin:admin
      const headers = {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      };

      const [studentsRes, executivesRes, employersRes] = await Promise.all([
        fetch(`${API_BASE}/api/students`, { headers }),
        fetch(`${API_BASE}/api/executives`, { headers }),
        fetch(`${API_BASE}/api/employers`, { headers }),
      ]);

      console.log("Students response status:", studentsRes.status);
      console.log("Executives response status:", executivesRes.status);
      console.log("Employers response status:", employersRes.status);

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        console.log("Students data:", studentsData);
        setStudents(studentsData);
      } else {
        console.error("Failed to fetch students:", studentsRes.status, studentsRes.statusText);
      }

      if (executivesRes.ok) {
        const executivesData = await executivesRes.json();
        console.log("Executives data:", executivesData);
        setExecutives(executivesData);
      } else {
        console.error("Failed to fetch executives:", executivesRes.status, executivesRes.statusText);
      }

      if (employersRes.ok) {
        const employersData = await employersRes.json();
        console.log("Employers data:", employersData);
        setEmployers(employersData);
      } else {
        console.error("Failed to fetch employers:", employersRes.status, employersRes.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    onLogout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Preparing your analytics...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Colors for pie chart (theme-matching)
  const pieColors = ["#2563eb", "#22c55e", "#a21caf"];

  // Prepare data for pie chart (user type proportions)
  const userTypeData = [
    { name: "Students", value: students.length },
    { name: "CXOs", value: executives.length },
    { name: "Employers", value: employers.length },
  ];

  // Prepare data for bar chart (location distribution)
  // Aggregate all locations from students, executives, and employers
  const locationMap = {};
  
  // Helper function to normalize location names
  const normalizeLocation = (location) => {
    if (!location) return null;
    
    // Convert to lowercase and trim
    let normalized = location.toLowerCase().trim();
    
    // Remove state names (common patterns)
    const statePatterns = [
      /,\s*(maharashtra|delhi|gujarat|madhya pradesh|punjab|rajasthan|tamil nadu|telangana|uttar pradesh|uttarakhand|west bengal|andhra pradesh|assam|bihar|chhattisgarh|goa|haryana|himachal pradesh|jharkhand|karnataka|kerala|odisha|chandigarh|jammu and kashmir|ladakh|arunachal pradesh|manipur|meghalaya|mizoram|nagaland|sikkim|tripura)/i,
      /^(maharashtra|delhi|gujarat|madhya pradesh|punjab|rajasthan|tamil nadu|telangana|uttar pradesh|uttarakhand|west bengal|andhra pradesh|assam|bihar|chhattisgarh|goa|haryana|himachal pradesh|jharkhand|karnataka|kerala|odisha|chandigarh|jammu and kashmir|ladakh|arunachal pradesh|manipur|meghalaya|mizoram|nagaland|sikkim|tripura),\s*/i
    ];
    
    statePatterns.forEach(pattern => {
      normalized = normalized.replace(pattern, '');
    });
    
    // Clean up any remaining commas and extra spaces
    normalized = normalized.replace(/^,\s*/, '').replace(/,\s*$/, '').trim();
    
    // If empty after cleaning, return null
    if (!normalized) return null;
    
    // Capitalize first letter and make rest lowercase
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  };
  
  // Process students
  students.forEach(s => {
    const normalizedLocation = normalizeLocation(s.currentLocation);
    if (normalizedLocation) {
      locationMap[normalizedLocation] = (locationMap[normalizedLocation] || 0) + 1;
    }
  });
  
  // Process executives
  executives.forEach(e => {
    const normalizedLocation = normalizeLocation(e.currentLocation);
    if (normalizedLocation) {
      locationMap[normalizedLocation] = (locationMap[normalizedLocation] || 0) + 1;
    }
  });
  
  // Process employers
  employers.forEach(emp => {
    const normalizedLocation = normalizeLocation(emp.location);
    if (normalizedLocation) {
      locationMap[normalizedLocation] = (locationMap[normalizedLocation] || 0) + 1;
    }
  });
  
  // Sort locations by value and take top 10, group rest as 'Other'
  const sortedLocations = Object.entries(locationMap).sort((a, b) => b[1] - a[1]);
  const topLocations = sortedLocations.slice(0, 10);
  const otherCount = sortedLocations.slice(10).reduce((sum, [, v]) => sum + v, 0);
  const locationData = topLocations.map(([name, value]) => ({ name, value }));
  if (otherCount > 0) locationData.push({ name: 'Other', value: otherCount });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 mobile-no-scroll">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 via-gray-900 to-black py-8 sm:py-12 lg:py-16">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-green-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-purple-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-indigo-500 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative container-responsive">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <div className="flex items-center justify-center sm:justify-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-gray-300 text-lg sm:text-xl font-medium max-w-2xl">
                Manage all registrations and user data with real-time analytics
              </p>
              <div className="mt-4 flex items-center justify-center sm:justify-start space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Live Data
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  Real-time Updates
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 text-base border border-white/20 hover:border-white/40 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="flex items-center">
                <span className="mr-2">🚪</span>
                Logout
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-responsive py-6 sm:py-8 lg:py-12 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-green-100 to-transparent rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-100 to-transparent rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          {/* Graphical Stats Section */}
          <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Pie Chart: User Type Proportions */}
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 lg:p-8 border border-gray-100 hover:border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">User Type Proportions</h3>
                  <p className="text-gray-600 text-sm lg:text-base">Distribution of registered users by type</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📊</span>
                </div>
              </div>
              <div className="relative">
                <ResponsiveContainer width="100%" height={280} minWidth={280} minHeight={280}>
                  <PieChart>
                    <defs>
                      <linearGradient id="studentGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="cxoGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="employerGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <Pie
                      data={userTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      paddingAngle={4}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationBegin={0}
                    >
                      {userTypeData.map((entry, idx) => (
                        <Cell 
                          key={`cell-${idx}`} 
                          fill={idx === 0 ? "url(#studentGradient)" : idx === 1 ? "url(#cxoGradient)" : "url(#employerGradient)"}
                          stroke="#fff" 
                          strokeWidth={3}
                          className="hover:opacity-80 transition-opacity duration-300"
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        padding: '12px 16px'
                      }}
                      formatter={(value, name) => [`${value} users`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center stats */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
                      {students.length + executives.length + employers.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart: Location Distribution */}
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 lg:p-8 border border-gray-100 hover:border-green-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Registrations by Location</h3>
                  <p className="text-gray-600 text-sm lg:text-base">Top 10 locations by total registrations</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🌍</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320} minWidth={280} minHeight={280}>
                <BarChart 
                  data={locationData} 
                  margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                  className="group-hover:scale-105 transition-transform duration-500"
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0} 
                    height={80} 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      padding: '12px 16px'
                    }}
                    formatter={(value, name) => [`${value} registrations`, 'Count']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]} 
                    barSize={40}
                    animationDuration={2000}
                    animationBegin={500}
                    className="hover:opacity-80 transition-opacity duration-300"
                  >
                    {locationData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={`hsl(${200 + index * 20}, 70%, 60%)`}
                        className="hover:opacity-80 transition-opacity duration-300"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-12">
            <div
              className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 lg:p-8 text-center cursor-pointer border border-blue-200 hover:border-blue-300 hover:scale-105 transform"
              onClick={() => {
                setActiveTab("students");
                setTimeout(() => {
                  document.getElementById("admin-tab-content")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <div className="relative">
                <div className="text-4xl lg:text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎓</div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{students.length}</span>
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">Students</h3>
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {students.length}
              </div>
              <p className="text-sm text-gray-600">Active registrations</p>
              <div className="mt-4 w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(students.length / Math.max(students.length + executives.length + employers.length, 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div
              className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 lg:p-8 text-center cursor-pointer border border-green-200 hover:border-green-300 hover:scale-105 transform"
              onClick={() => {
                setActiveTab("executives");
                setTimeout(() => {
                  document.getElementById("admin-tab-content")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <div className="relative">
                <div className="text-4xl lg:text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🧑‍💼</div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{executives.length}</span>
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">CXOs</h3>
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {executives.length}
              </div>
              <p className="text-sm text-gray-600">Active registrations</p>
              <div className="mt-4 w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(executives.length / Math.max(students.length + executives.length + employers.length, 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div
              className="group bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 lg:p-8 text-center cursor-pointer border border-purple-200 hover:border-purple-300 hover:scale-105 transform"
              onClick={() => {
                setActiveTab("employers");
                setTimeout(() => {
                  document.getElementById("admin-tab-content")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <div className="relative">
                <div className="text-4xl lg:text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🏢</div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{employers.length}</span>
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors duration-300">Employers</h3>
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                {employers.length}
              </div>
              <p className="text-sm text-gray-600">Active registrations</p>
              <div className="mt-4 w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(employers.length / Math.max(students.length + executives.length + employers.length, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div id="admin-tab-content" className="p-4 sm:p-6 lg:p-8">
            {/* Search Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchField}
                onChange={e => setSearchField(e.target.value)}
              >
                <option value="">Search by...</option>
                {searchFields[activeTab].map(field => (
                  <option key={field.value} value={field.value}>{field.label}</option>
                ))}
              </select>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter value..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                disabled={!searchField}
              />
              {(searchField || searchValue) && (
                <button
                  className="ml-2 text-xs text-gray-500 hover:text-red-600"
                  onClick={() => { setSearchField(""); setSearchValue(""); }}
                >
                  Clear
                </button>
              )}
            </div>

            {activeTab === "students" && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Student Registrations</h3>
                {/* Result count and sort dropdown */}
                <div className="flex items-center justify-between mb-2">
                  <div>Showing {getFilteredList(students, "students").length} result(s)</div>
                  <select value={studentSortKey} onChange={e => setStudentSortKey(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="fullName">Sort by Name</option>
                    <option value="currentLocation">Sort by Location</option>
                    <option value="createdAt_desc">Latest to Oldest</option>
                    <option value="createdAt_asc">Oldest to Latest</option>
                  </select>
                </div>
                {getFilteredList(students, "students").length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No students found.</p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {[...getFilteredList(students, "students")].sort((a, b) => {
                      if (studentSortKey === "createdAt_desc") {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                      }
                      if (studentSortKey === "createdAt_asc") {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                      }
                      if (!a[studentSortKey]) return 1;
                      if (!b[studentSortKey]) return -1;
                      return a[studentSortKey].localeCompare(b[studentSortKey]);
                    }).map((student, index) => (
                      <div 
                        key={index} 
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:border-blue-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => openDetailsModal(student, "students")}
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold text-sm">
                              {student.fullName?.charAt(0)?.toUpperCase() || "S"}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{student.fullName}</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">{student.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p className="flex items-baseline gap-1"><span className="font-medium">Phone:</span><span className="flex-1 min-w-0 truncate">{student.phone}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">University:</span><span className="flex-1 min-w-0 truncate">{student.university}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">Degree:</span><span className="flex-1 min-w-0 truncate">{student.degree}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">Location:</span><span className="flex-1 min-w-0 truncate">{normalizeLocation(student.currentLocation) || '-'}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "executives" && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">CXO Registrations</h3>
                {/* Result count and sort dropdown */}
                <div className="flex items-center justify-between mb-2">
                  <div>Showing {getFilteredList(executives, "executives").length} result(s)</div>
                  <select value={executiveSortKey} onChange={e => setExecutiveSortKey(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="fullName">Sort by Name</option>
                    <option value="currentLocation">Sort by Location</option>
                    <option value="createdAt_desc">Latest to Oldest</option>
                    <option value="createdAt_asc">Oldest to Latest</option>
                  </select>
                </div>
                {getFilteredList(executives, "executives").length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No CXOs found.</p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {[...getFilteredList(executives, "executives")].sort((a, b) => {
                      if (executiveSortKey === "createdAt_desc") {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                      }
                      if (executiveSortKey === "createdAt_asc") {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                      }
                      if (!a[executiveSortKey]) return 1;
                      if (!b[executiveSortKey]) return -1;
                      return a[executiveSortKey].localeCompare(b[executiveSortKey]);
                    }).map((executive, index) => (
                      <div 
                        key={index} 
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:border-green-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => openDetailsModal(executive, "executives")}
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-600 font-bold text-sm">
                              {executive.fullName?.charAt(0)?.toUpperCase() || "C"}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{executive.fullName}</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">{executive.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p className="flex items-baseline gap-1"><span className="font-medium">Phone:</span><span className="flex-1 min-w-0 truncate">{executive.phone}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">Company:</span><span className="flex-1 min-w-0 truncate">{executive.company}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">Position:</span><span className="flex-1 min-w-0 break-words overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{executive.position}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">Industry:</span><span className="flex-1 min-w-0 truncate">{executive.industry}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">Experience:</span><span className="flex-1 min-w-0 truncate">{executive.experience}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">Location:</span><span className="flex-1 min-w-0 truncate">{normalizeLocation(executive.currentLocation) || '-'}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "employers" && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Employer Registrations</h3>
                {/* Result count and sort dropdown */}
                <div className="flex items-center justify-between mb-2">
                  <div>Showing {getFilteredList(employers, "employers").length} result(s)</div>
                  <select value={employerSortKey} onChange={e => setEmployerSortKey(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="companyName">Sort by Name</option>
                    <option value="location">Sort by Location</option>
                    <option value="createdAt_desc">Latest to Oldest</option>
                    <option value="createdAt_asc">Oldest to Latest</option>
                  </select>
                </div>
                {getFilteredList(employers, "employers").length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No employers found.</p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {[...getFilteredList(employers, "employers")].sort((a, b) => {
                      if (employerSortKey === "createdAt_desc") {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                      }
                      if (employerSortKey === "createdAt_asc") {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                      }
                      if (!a[employerSortKey]) return 1;
                      if (!b[employerSortKey]) return -1;
                      return a[employerSortKey].localeCompare(b[employerSortKey]);
                    }).map((employer, index) => (
                      <div 
                        key={index} 
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:border-purple-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => openDetailsModal(employer, "employers")}
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-purple-600 font-bold text-sm">
                              {employer.companyName?.charAt(0)?.toUpperCase() || "E"}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{employer.companyName}</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">{employer.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p className="flex items-baseline gap-1"><span className="font-medium">Contact Person:</span><span className="flex-1 min-w-0 truncate">{employer.contactPerson}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">Phone:</span><span className="flex-1 min-w-0 truncate">{employer.phone}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">Industry:</span><span className="flex-1 min-w-0 truncate">{employer.industry}</span></p>
                          <p className="flex items-baseline gap-1"><span className="font-medium">Location:</span><span className="flex-1 min-w-0 truncate">{normalizeLocation(employer.location) || '-'}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Details Modal"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative mt-12 mb-12 px-8 sm:px-16 max-h-[80vh] overflow-y-auto">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl" onClick={closeModal}>&times;</button>
          {selectedEntry && selectedType && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Details</h2>
              <form onSubmit={e => { e.preventDefault(); handleEditSubmit(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {modalFields[selectedType].map(field => (
                    <div key={field.key} className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-600 mb-1">{field.label}</label>
                      {editMode ? (
                        (field.key === "resume" || field.key === "photo") ? (
                          <>
                            <input
                              type="file"
                              accept={field.key === "resume" ? ".pdf" : "image/*"}
                              onChange={e => handleEditChange(field.key, e.target.files[0])}
                              disabled={modalLoading}
                            />
                            {editData[field.key] && typeof editData[field.key] === 'object' && (
                              <span className="text-green-600 text-xs mt-1">{editData[field.key].name}</span>
                            )}
                          </>
                        ) : field.key === "workExperience" ? (
                          <div className="text-gray-600 text-sm py-1 px-2 bg-gray-50 rounded">
                            <span className="text-gray-400">Work experience editing not available in this view</span>
                          </div>
                        ) : field.key === "gender" ? (
                          <select
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                            value={editData[field.key] || "Other"}
                            onChange={e => handleEditChange(field.key, e.target.value)}
                            disabled={modalLoading}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : field.key === "country" ? (
                          <select
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                            value={editData[field.key] || "IN"}
                            onChange={e => handleEditChange(field.key, e.target.value)}
                            disabled={modalLoading}
                          >
                            <option value="IN">India</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="OTHERS">Others</option>
                          </select>
                        ) : field.key === "state" ? (
                          <select
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                            value={editData[field.key] || ""}
                            onChange={e => handleEditChange(field.key, e.target.value)}
                            disabled={modalLoading}
                          >
                            <option value="">Select State</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Others">Others</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                            value={editData[field.key] || ""}
                            onChange={e => handleEditChange(field.key, e.target.value)}
                            disabled={modalLoading}
                          />
                        )
                      ) : (
                        (field.key === "resume" || field.key === "photo") && selectedEntry[field.key] ? (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDownloadFile(selectedType, selectedEntry._id, field.key); }}
                            className="text-blue-600 underline text-xs text-left"
                          >
                            Download
                          </button>
                        ) : field.key === "workExperience" ? (
                          <div className="text-gray-800 text-sm py-1 px-2 bg-gray-50 rounded max-h-32 overflow-y-auto">
                            {selectedEntry[field.key] && Array.isArray(selectedEntry[field.key]) && selectedEntry[field.key].length > 0 ? (
                              selectedEntry[field.key].map((exp, index) => (
                                <div key={index} className="mb-2 p-2 border-l-2 border-blue-200">
                                  <div className="font-medium">{exp.companyName} - {exp.jobTitle}</div>
                                  <div className="text-xs text-gray-600">{exp.startDate} to {exp.endDate || 'Present'}</div>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-400">No work experience</span>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-800 text-sm py-1 px-2 bg-gray-50 rounded">
                            {typeof selectedEntry[field.key] === 'object' ? 
                              JSON.stringify(selectedEntry[field.key], null, 2) : 
                              (selectedEntry[field.key] || <span className="text-gray-400">-</span>)
                            }
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
                {/* Employer logo download (if available) */}
                {selectedType === 'employers' && selectedEntry?.logo && !editMode && (
                  <div className="mt-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Logo</label>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDownloadFile('employers', selectedEntry._id, 'logo'); }}
                      className="text-blue-600 underline text-xs"
                    >
                      Download
                    </button>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6 border-t pt-4">
                  {editMode ? (
                    <>
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                        onClick={() => setEditMode(false)}
                        disabled={modalLoading}
                      >Cancel</button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        disabled={modalLoading}
                      >{modalLoading ? "Saving..." : "Save"}</button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        onClick={() => { setEditMode(true); setEditData(selectedEntry); }}
                      >Edit</button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                        onClick={handleDelete}
                        disabled={modalLoading}
                      >{modalLoading ? "Deleting..." : "Delete"}</button>
                    </>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;