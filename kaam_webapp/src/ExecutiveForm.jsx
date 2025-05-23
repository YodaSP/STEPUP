import React, { useState } from "react";

const ExecutiveForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    experience: "",
    company: "",
    location: "",
    skills: "",
    resume: null,
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Executive Data:", formData);
    // Future: send form data to backend
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 rounded-lg shadow">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 px-4 shadow-md text-center mb-8">
        <h2 className="text-3xl font-bold">Company Executive Registration</h2>
        <p className="text-sm mt-2 text-blue-100">
          Register now to connect with top employers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-b-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation (e.g., CFO, CMO)"
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="department"
          placeholder="Department (e.g., Finance, Marketing)"
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="experience"
          placeholder="Years of Experience"
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="company"
          placeholder="Current Company Name"
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="location"
          placeholder="Office Location / City"
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills / Tools (e.g., SAP, Excel)"
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Upload Resume (PDF)</label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Upload Profile Photo (JPG/PNG)</label>
          <input
            type="file"
            name="photo"
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExecutiveForm;
