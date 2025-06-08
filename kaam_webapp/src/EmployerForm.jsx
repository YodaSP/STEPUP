import React, { useState, useRef, useEffect } from "react";

const EmployerForm = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    industry: "",
    companySize: "",
    website: "",
    location: "",
    logo: null,
  });

  const logoRef = useRef(null);

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
      const response = await fetch("http://localhost:5000/api/employers", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Employer registered successfully!");
        setFormData({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          industry: "",
          companySize: "",
          website: "",
          location: "",
          logo: null,
        });
        logoRef.current.value = null;
      } else {
        alert("Failed to register employer.");
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
          Employer Registration
        </h2>
        <p className="text-base md:text-lg text-white mt-3">
          Register your company to connect with top talent.
        </p>
        <div className="absolute top-0 right-0 m-4 text-white text-opacity-30 text-7xl font-extrabold pointer-events-none select-none hidden md:block">
          🏢
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="text"
          name="contactPerson"
          placeholder="Contact Person"
          value={formData.contactPerson}
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
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="text"
          name="industry"
          placeholder="Industry (e.g., IT, Manufacturing)"
          value={formData.industry}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="companySize"
          placeholder="Company Size (e.g., 50-200)"
          value={formData.companySize}
          onChange={handleChange}
          className="input"
        />
        <input
  type="url"
  name="website"
  placeholder="https://example.com"
  value={formData.website}
  onChange={handleChange}
  className="input"
  required
/>

        <input
          type="text"
          name="location"
          placeholder="Location / City"
          value={formData.location}
          onChange={handleChange}
          className="input"
        />

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Upload Company Logo (JPG/PNG)
          </label>
          <input
            type="file"
            name="logo"
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
            className="input"
            ref={logoRef}
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

export default EmployerForm;
