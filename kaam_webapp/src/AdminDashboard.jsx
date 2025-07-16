import React, { useState, useEffect } from "react";

const AdminDashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");

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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center">
            <div className="text-3xl sm:text-4xl mb-2">🎓</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Students</h3>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600">{students.length}</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center">
            <div className="text-3xl sm:text-4xl mb-2">🧑‍💼</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">CXOs</h3>
            <p className="text-3xl sm:text-4xl font-bold text-green-600">{executives.length}</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center">
            <div className="text-3xl sm:text-4xl mb-2">🏢</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Employers</h3>
            <p className="text-3xl sm:text-4xl font-bold text-purple-600">{employers.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-200 ${
                activeTab === "students"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab("executives")}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-200 ${
                activeTab === "executives"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              CXOs ({executives.length})
            </button>
            <button
              onClick={() => setActiveTab("employers")}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-200 ${
                activeTab === "employers"
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Employers ({employers.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === "students" && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Student Registrations</h3>
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No students registered yet.</p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {students.map((student, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
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
                {executives.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No CXOs registered yet.</p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {executives.map((executive, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
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
                {employers.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No employers registered yet.</p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {employers.map((employer, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
