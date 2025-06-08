import React, { useState, useRef, useEffect } from "react";

const ExecutiveForm = () => {
   useEffect(() => {
    window.scrollTo(0, 0);
     }, []);
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
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
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
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4">
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-3xl shadow-xl mb-10 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">
          Company Executive Registration
        </h2>
        <p className="text-base md:text-lg text-white mt-3">
          Register now to connect with top employers and grow your career.
        </p>
        <div className="absolute top-0 right-0 m-4 text-white text-opacity-30 text-7xl font-extrabold pointer-events-none select-none hidden md:block">
          💼
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          value={formData.phone}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation (e.g., CFO, CMO)"
          value={formData.designation}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="department"
          placeholder="Department (e.g., Finance, Marketing)"
          value={formData.department}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="experience"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="company"
          placeholder="Current Company Name"
          value={formData.company}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="location"
          placeholder="Office Location / City"
          value={formData.location}
          onChange={handleChange}
          className="input"
        />

        <div className="md:col-span-2">
          <input
            type="text"
            name="skills"
            placeholder="Skills / Tools (e.g., SAP, Excel)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleChange}
            className="input"
            ref={resumeRef}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Upload Profile Photo (JPG/PNG)
          </label>
          <input
            type="file"
            name="photo"
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
            className="input"
            ref={photoRef}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            Submit Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExecutiveForm;
