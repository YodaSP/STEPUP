import React, { useState, useRef, useEffect } from "react";

const StudentForm = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
       }, []);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    university: "",
    degree: "",
    passingDate: "",
    skills: "",
    jobRole: "",
    preferredLocation: "",
    currentLocation: "",
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
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Student registered successfully!");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          university: "",
          degree: "",
          passingDate: "",
          skills: "",
          jobRole: "",
          preferredLocation: "",
          currentLocation: "",
          resume: null,
          photo: null,
        });
        resumeRef.current.value = null;
        photoRef.current.value = null;
      } else {
        alert("Failed to register student");
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
          Student Registration
        </h2>
        <p className="text-base md:text-lg text-white mt-3">
          Register now to connect with top employers and step into your dream job.
        </p>
        <div className="absolute top-0 right-0 m-4 text-white text-opacity-30 text-7xl font-extrabold pointer-events-none select-none hidden md:block">
          🎓
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
          name="university"
          placeholder="College / University"
          value={formData.university}
          onChange={handleChange}
          className="input"
        />

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Degree
          </label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Degree
            </option>
            <option>B.Tech</option>
            <option>B.Sc</option>
            <option>B.Com</option>
            <option>M.Tech</option>
            <option>MBA</option>
            <option>MCA</option>
            <option>Diploma</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Passing Year
          </label>
          <select
            name="passingDate"
            value={formData.passingDate}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="" disabled>
              Select Year
            </option>
            {Array.from({ length: 50 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <input
          type="text"
          name="skills"
          placeholder="Skills (e.g. React, Python)"
          value={formData.skills}
          onChange={handleChange}
          className="input"
        />

        <select
          name="jobRole"
          value={formData.jobRole}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="" disabled>
            Select Job Role
          </option>
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Data Analyst</option>
          <option>Digital Marketing</option>
          <option>UI/UX Designer</option>
          <option>DevOps Engineer</option>
        </select>

        <input
          type="text"
          name="preferredLocation"
          placeholder="Preferred Job Location"
          value={formData.preferredLocation}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="currentLocation"
          placeholder="Current Location"
          value={formData.currentLocation}
          onChange={handleChange}
          className="input"
        />

        <div>
          <label className="text-sm font-medium text-gray-600">
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
          <label className="text-sm font-medium text-gray-600">
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

export default StudentForm;
