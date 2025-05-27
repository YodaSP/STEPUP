import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [activeSection, setActiveSection] = useState("Dashboard");

  const [studentSkillFilter, setStudentSkillFilter] = useState("");
  const [execSkillFilter, setExecSkillFilter] = useState("");
  const [execDesignationFilter, setExecDesignationFilter] = useState("");

  // Fetch data
  useEffect(() => {
    fetchStudents();
    fetchExecutives();
  }, []);

  const fetchStudents = async () => {
    try {
      const authToken = localStorage.getItem("authToken"); // base64 username:password
      if (!authToken) throw new Error("No auth token found");
      const res = await axios.get("http://localhost:5000/api/students", {
        headers: {
          Authorization: `Basic ${authToken}`,   // Use Basic Auth header
        },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      if (err.response && err.response.status === 401) {
        alert("Session expired or unauthorized. Please login again.");
        handleLogout();
      }
    }
  };

  const fetchExecutives = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) throw new Error("No auth token found");
      const res = await axios.get("http://localhost:5000/api/executives", {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });
      setExecutives(res.data);
    } catch (err) {
      console.error("Error fetching executives:", err);
      if (err.response && err.response.status === 401) {
        alert("Session expired or unauthorized. Please login again.");
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/admin-login";
  };

  const SidebarItem = ({ name }) => (
    <li
      onClick={() => setActiveSection(name)}
      className={`cursor-pointer px-2 py-1 rounded ${
        activeSection === name
          ? "bg-blue-100 text-blue-700 font-bold"
          : "hover:text-blue-600"
      }`}
    >
      {name}
    </li>
  );

  const filteredStudents = students.filter((s) =>
    s.skills?.toLowerCase().includes(studentSkillFilter.toLowerCase())
  );

  const filteredExecutives = executives.filter(
    (e) =>
      e.skills?.toLowerCase().includes(execSkillFilter.toLowerCase()) &&
      e.designation?.toLowerCase().includes(execDesignationFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-blue-700 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-2xl font-bold">STEPUP Admin Dashboard</div>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-md p-6">
          <ul className="space-y-4 text-gray-700 font-semibold">
            <SidebarItem name="Dashboard" />
            <SidebarItem name="Students" />
            <SidebarItem name="Company Executives" />
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {activeSection === "Dashboard" && (
            <>
              <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, Admin</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                <div
                  onClick={() => setActiveSection("Students")}
                  className="bg-white p-8 rounded-2xl shadow-lg text-center cursor-pointer hover:bg-blue-50 transition"
                >
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">Total Students</h2>
                  <p className="text-4xl font-bold">{students.length}</p>
                </div>
                <div
                  onClick={() => setActiveSection("Company Executives")}
                  className="bg-white p-8 rounded-2xl shadow-lg text-center cursor-pointer hover:bg-blue-50 transition"
                >
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">Total Executives</h2>
                  <p className="text-4xl font-bold">{executives.length}</p>
                </div>
              </div>
            </>
          )}

          {activeSection === "Students" && (
            <>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Registered Students</h2>
              <input
                type="text"
                placeholder="Filter by Skills"
                className="mb-4 p-2 border border-gray-300 rounded w-full md:w-1/2"
                value={studentSkillFilter}
                onChange={(e) => setStudentSkillFilter(e.target.value)}
              />
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr key={s._id} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-6">{s.fullName}</td>
                        <td className="py-3 px-6">{s.email}</td>
                        <td className="py-3 px-6">{s.skills}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeSection === "Company Executives" && (
            <>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Registered Company Executives</h2>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                <input
                  type="text"
                  placeholder="Filter by Skills"
                  className="p-2 border border-gray-300 rounded w-full md:w-1/3"
                  value={execSkillFilter}
                  onChange={(e) => setExecSkillFilter(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Filter by Designation"
                  className="p-2 border border-gray-300 rounded w-full md:w-1/3"
                  value={execDesignationFilter}
                  onChange={(e) => setExecDesignationFilter(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Company</th>
                      <th className="py-3 px-6 text-left">Designation</th>
                      <th className="py-3 px-6 text-left">Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExecutives.map((e) => (
                      <tr key={e._id} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-6">{e.fullName}</td>
                        <td className="py-3 px-6">{e.currentCompanyName}</td>
                        <td className="py-3 px-6">{e.designation}</td>
                        <td className="py-3 px-6">{e.skills}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
