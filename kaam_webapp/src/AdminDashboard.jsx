import React, { useState } from "react";

const AdminDashboard = () => {
  // Example data for demo
  const [students] = useState([
    { id: 1, name: "Rahul Kumar", email: "rahul@example.com", skills: "React, Node" },
    { id: 2, name: "Priya Singh", email: "priya@example.com", skills: "Python, Django" },
  ]);

  const [executives] = useState([
    { id: 1, name: "Mr. Sharma", company: "ABC Corp", designation: "CFO" },
    { id: 2, name: "Mrs. Mehta", company: "XYZ Ltd", designation: "CMO" },
  ]);

  // State to track which section to show
  const [activeSection, setActiveSection] = useState("Dashboard");

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // example
    window.location.href = "/admin-login";
  };

  // Sidebar item component for better reuse and active styling
  const SidebarItem = ({ name }) => (
    <li
      onClick={() => setActiveSection(name)}
      className={`cursor-pointer px-2 py-1 rounded ${
        activeSection === name ? "bg-blue-100 text-blue-700 font-bold" : "hover:text-blue-600"
      }`}
    >
      {name}
    </li>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-blue-700 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-2xl font-bold">STEPUP Admin Dashboard</div>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-md p-6">
          <ul className="space-y-4 text-gray-700 font-semibold">
            <SidebarItem name="Dashboard" />
            <SidebarItem name="Students" />
            <SidebarItem name="Company Executives" />
            <SidebarItem name="Settings" />
          </ul>
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Render different content based on active section */}
          {activeSection === "Dashboard" && (
            <>
              <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, Admin</h1>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow text-center">
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">Total Students</h2>
                  <p className="text-3xl font-bold">{students.length}</p>
                </div>
                <div className="bg-white p-6 rounded shadow text-center">
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">Total Executives</h2>
                  <p className="text-3xl font-bold">{executives.length}</p>
                </div>
                <div className="bg-white p-6 rounded shadow text-center">
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">Active Jobs</h2>
                  <p className="text-3xl font-bold">12</p> {/* Example */}
                </div>
              </div>
            </>
          )}

          {activeSection === "Students" && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Registered Students</h2>
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
                    {students.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-6">{student.name}</td>
                        <td className="py-3 px-6">{student.email}</td>
                        <td className="py-3 px-6">{student.skills}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeSection === "Company Executives" && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Registered Company Executives</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Company</th>
                      <th className="py-3 px-6 text-left">Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executives.map((exec) => (
                      <tr key={exec.id} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-6">{exec.name}</td>
                        <td className="py-3 px-6">{exec.company}</td>
                        <td className="py-3 px-6">{exec.designation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeSection === "Settings" && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Settings</h2>
              <p>This is the settings section. You can add your settings form or options here.</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
