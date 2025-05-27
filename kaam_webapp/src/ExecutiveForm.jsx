import React, { useState, useRef } from "react";

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

  const resumeRef = useRef(null);
  const photoRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch("http://localhost:5000/api/executives", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Executive registered successfully!");
        setFormData({
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
        resumeRef.current.value = null;
        photoRef.current.value = null;
      } else {
        alert("Failed to register executive.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 rounded-lg shadow">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 px-4 shadow-md text-center mb-8">
        <h2 className="text-3xl font-bold">Company Executive Registration</h2>
        <p className="text-sm mt-2 text-blue-100">
          Register now to connect with top employers
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-b-lg grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          value={formData.phone}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation (e.g., CFO, CMO)"
          value={formData.designation}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="department"
          placeholder="Department (e.g., Finance, Marketing)"
          value={formData.department}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="experience"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="company"
          placeholder="Current Company Name"
          value={formData.company}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="location"
          placeholder="Office Location / City"
          value={formData.location}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
<div className="md:col-span-2">
  <input
    type="text"
    name="skills"
    placeholder="Skills / Tools (e.g., SAP, Excel)"
    value={formData.skills}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-600 mb-1">
    Upload Resume (PDF)
  </label>
  <input
    type="file"
    name="resume"
    accept=".pdf"
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    ref={resumeRef}
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-600 mb-1">
    Upload Profile Photo (JPG/PNG)
  </label>
  <input
    type="file"
    name="photo"
    accept=".jpg,.jpeg,.png"
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    ref={photoRef}
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
