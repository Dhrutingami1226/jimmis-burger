import React, { useState } from "react";
import "./franchiseform.css";

const FranchiseForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
    country: "",
    state: "",
    pincode: "",
    hrspmonth: "",
    scoutshop: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const patterns = {
    name: /^[a-zA-Z0-9]+$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phoneno: /^[0-9]{10}$/,
    pincode: /^[0-9]{6}$/,
    hrspmonth: /^[0-9]{3}$/
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = `${name.replace(/([A-Z])/g, " $1").trim()} is required`;
    } else if (name === "email" && !patterns.email.test(value)) {
      error = "Invalid email address";
    } else if (name === "phoneno" && !patterns.phoneno.test(value)) {
      error = "Phone number must be 10 digits";
    } else if (name === "pincode" && !patterns.pincode.test(value)) {
      error = "Pincode must be 6 digits";
    } else if (name === "hrspmonth" && !patterns.hrspmonth.test(value)) {
      error = "Hours must be 3 digits";
    } else if (name === "name" && !patterns.name.test(value)) {
      error = "Name must be alphanumeric";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/franchise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.message) {
        setSuccess(true);
        setMessage(data.message);
        setFormData({
          name: "",
          email: "",
          phoneno: "",
          country: "",
          state: "",
          pincode: "",
          hrspmonth: "",
          scoutshop: ""
        });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      setMessage("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="franchise-form-container">
      <div className="form-content">
        <h1>Join Jimmi Burger Family</h1>
        <p>Become a franchise partner and grow with us!</p>

        {success && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit} className="franchise-form">
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phoneno">Phone Number *</label>
              <input
                type="tel"
                id="phoneno"
                name="phoneno"
                value={formData.phoneno}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength="10"
                className={errors.phoneno ? "input-error" : ""}
              />
              {errors.phoneno && <span className="error-text">{errors.phoneno}</span>}
            </div>

            {/* Country */}
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                className={errors.country ? "input-error" : ""}
              />
              {errors.country && <span className="error-text">{errors.country}</span>}
            </div>

            {/* State */}
            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className={errors.state ? "input-error" : ""}
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>

            {/* Pincode */}
            <div className="form-group">
              <label htmlFor="pincode">Pincode *</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength="6"
                className={errors.pincode ? "input-error" : ""}
              />
              {errors.pincode && <span className="error-text">{errors.pincode}</span>}
            </div>

            {/* Hours per month */}
            <div className="form-group">
              <label htmlFor="hrspmonth">Hours Available/Month *</label>
              <input
                type="number"
                id="hrspmonth"
                name="hrspmonth"
                value={formData.hrspmonth}
                onChange={handleChange}
                placeholder="Hours (3 digits)"
                maxLength="3"
                className={errors.hrspmonth ? "input-error" : ""}
              />
              {errors.hrspmonth && <span className="error-text">{errors.hrspmonth}</span>}
            </div>

            {/* Scout Shop */}
            <div className="form-group">
              <label htmlFor="scoutshop">Do you have a shop? *</label>
              <select
                id="scoutshop"
                name="scoutshop"
                value={formData.scoutshop}
                onChange={handleChange}
                className={errors.scoutshop ? "input-error" : ""}
              >
                <option value="">Select option</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
              {errors.scoutshop && <span className="error-text">{errors.scoutshop}</span>}
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FranchiseForm;
