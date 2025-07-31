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
        url = `http://localhost:5000/api/students/${selectedEntry._id}`;
      } else if (selectedType === "executives") {
        url = `http://localhost:5000/api/executives/${selectedEntry._id}`;
      } else if (selectedType === "employers") {
        url = `http://localhost:5000/api/employers/${selectedEntry._id}`;
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
        url = `http://localhost:5000/api/students/${selectedEntry._id}`;
      } else if (selectedType === "executives") {
        url = `http://localhost:5000/api/executives/${selectedEntry._id}`;
      } else if (selectedType === "employers") {
        url = `http://localhost:5000/api/employers/${selectedEntry._id}`;
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
      const response = await fetch("http://localhost:5000/api/test");
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
        fetch("http://localhost:5000/api/students", { headers }),
        fetch("http://localhost:5000/api/executives", { headers }),
        fetch("http://localhost:5000/api/employers", { headers }),
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
  students.forEach(s => {
    if (s.currentLocation) {
      locationMap[s.currentLocation] = (locationMap[s.currentLocation] || 0) + 1;
    }
  });
  executives.forEach(e => {
    if (e.currentLocation) {
      locationMap[e.currentLocation] = (locationMap[e.currentLocation] || 0) + 1;
    }
  });
  employers.forEach(emp => {
    if (emp.location) {
      locationMap[emp.location] = (locationMap[emp.location] || 0) + 1;
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
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container-responsive">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-4 drop-shadow-lg">
                Admin Dashboard
              </h1>
              <p className="text-gray-300 text-base sm:text-lg font-medium">
                Manage all registrations and user data
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
        {/* Graphical Stats Section */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie Chart: User Type Proportions */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2 mt-2 text-gray-700">User Type Proportions</h3>
            <p className="text-gray-500 mb-4 text-sm">Distribution of registered users by type</p>
            <ResponsiveContainer width="100%" height={220} minWidth={220} minHeight={220}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  label={false}
                  labelLine={false}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {userTypeData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value, name) => [`${value}`, name]} />
                <Legend iconType="circle" layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: 14, marginTop: 16 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Bar Chart: Location Distribution */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2 text-gray-700">Registrations by Location</h3>
            <p className="text-gray-500 mb-4 text-sm">Top 10 locations by total registrations</p>
            <ResponsiveContainer width="100%" height={260} minWidth={220} minHeight={220}>
              <BarChart data={locationData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={70} tick={{ fontSize: 13 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                <RechartsTooltip formatter={(value, name) => [`${value}`, name]} />
                <Legend wrapperStyle={{ fontSize: 14 }} />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={32} label={{ position: 'top', fontSize: 13, fill: '#222' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div
            className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center cursor-pointer hover:shadow-2xl transition"
            onClick={() => {
              setActiveTab("students");
              setTimeout(() => {
                document.getElementById("admin-tab-content")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            <div className="text-3xl sm:text-4xl mb-2">🎓</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Students</h3>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600">{students.length}</p>
          </div>
          <div
            className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center cursor-pointer hover:shadow-2xl transition"
            onClick={() => {
              setActiveTab("executives");
              setTimeout(() => {
                document.getElementById("admin-tab-content")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            <div className="text-3xl sm:text-4xl mb-2">🧑‍💼</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">CXOs</h3>
            <p className="text-3xl sm:text-4xl font-bold text-green-600">{executives.length}</p>
          </div>
          <div
            className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center cursor-pointer hover:shadow-2xl transition"
            onClick={() => {
              setActiveTab("employers");
              setTimeout(() => {
                document.getElementById("admin-tab-content")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            <div className="text-3xl sm:text-4xl mb-2">🏢</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Employers</h3>
            <p className="text-3xl sm:text-4xl font-bold text-purple-600">{employers.length}</p>
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
                      <div key={index} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition"
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
                          <p><span className="font-medium">Phone:</span> {student.phone}</p>
                          <p><span className="font-medium">University:</span> {student.university}</p>
                          <p><span className="font-medium">Degree:</span> {student.degree}</p>
                          <p><span className="font-medium">Location:</span> {student.currentLocation}</p>
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
                      <div key={index} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition"
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
                          <p><span className="font-medium">Phone:</span> {executive.phone}</p>
                          <p><span className="font-medium">Company:</span> {executive.company}</p>
                          <p><span className="font-medium">Position:</span> {executive.position}</p>
                          <p><span className="font-medium">Industry:</span> {executive.industry}</p>
                          <p><span className="font-medium">Experience:</span> {executive.experience}</p>
                          <p><span className="font-medium">Location:</span> {executive.currentLocation}</p>
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
                      <div key={index} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition"
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
                          <p><span className="font-medium">Contact Person:</span> {employer.contactPerson}</p>
                          <p><span className="font-medium">Phone:</span> {employer.phone}</p>
                          <p><span className="font-medium">Industry:</span> {employer.industry}</p>
                          <p><span className="font-medium">Location:</span> {employer.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
                          <a
                            href={selectedEntry[field.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs"
                          >
                            Download
                          </a>
                        ) : (
                          <div className="text-gray-800 text-sm py-1 px-2 bg-gray-50 rounded">
                            {selectedEntry[field.key] || <span className="text-gray-400">-</span>}
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
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
