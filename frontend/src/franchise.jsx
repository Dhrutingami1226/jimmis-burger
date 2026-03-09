import React, { useState } from "react";
import "./franchise.css";

const Franchise = () => {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    phoneno: "",
    country: "",
    state: "",
    pincode: "",
    hrspmonth: "",
    scoutshop: "No"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation patterns
  const patterns = {
    name: /^[a-zA-Z0-9]+$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phoneno: /^[0-9]{10}$/,
    pincode: /^[0-9]{6}$/,
    hrspmonth: /^[0-9]{3}$/
  };

  // Validate individual field
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (!patterns.name.test(value)) {
          error = "Name must contain only letters and numbers";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!patterns.email.test(value)) {
          error = "Please enter a valid email";
        }
        break;

      case "phoneno":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!patterns.phoneno.test(value)) {
          error = "Please enter a valid 10-digit phone number";
        }
        break;

      case "country":
        if (!value.trim()) {
          error = "Country is required";
        }
        break;

      case "state":
        if (!value.trim()) {
          error = "State is required";
        }
        break;

      case "pincode":
        if (!value.trim()) {
          error = "Pincode is required";
        } else if (!patterns.pincode.test(value)) {
          error = "Please enter a valid 6-digit pincode";
        }
        break;

      case "hrspmonth":
        if (!value.trim()) {
          error = "Hours per month is required";
        } else if (!patterns.hrspmonth.test(value)) {
          error = "Please enter a valid 3-digit number";
        }
        break;

      case "userId":
        if (!value.trim()) {
          error = "User ID is required";
        } else if (isNaN(value)) {
          error = "User ID must be a number";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["userId", "name", "email", "phoneno", "country", "state", "pincode", "hrspmonth"];

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("https://jimmi-backend.onrender.com/api/Franchise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setFormData({
          userId: "",
          name: "",
          email: "",
          phoneno: "",
          country: "",
          state: "",
          pincode: "",
          hrspmonth: "",
          scoutshop: "No"
        });
        setErrors({});

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || "Failed to submit franchise application" });
      }
    } catch (error) {
      setErrors({ submit: "Error submitting form. Please try again." });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="franchise-container">
      <div className="franchise-header">
        <h1>Franchise Application</h1>
        <p>Join JIMIS BURGER and become a successful franchisee</p>
      </div>

      <form className="franchise-form" onSubmit={handleSubmit}>
        {/* Success Message */}
        {success && (
          <div className="success-message">
            ✓ Application submitted successfully! We will contact you soon.
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="error-message">
            ✗ {errors.submit}
          </div>
        )}

        {/* User ID */}
        <div className="form-group">
          <label htmlFor="userId">User ID *</label>
          <input
            type="number"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="Enter your user ID"
            className={errors.userId ? "input-error" : ""}
          />
          {errors.userId && <span className="error-text">{errors.userId}</span>}
        </div>

        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name (alphanumeric only)"
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
            placeholder="Enter your email address"
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="phoneno">Phone Number *</label>
          <input
            type="tel"
            id="phoneno"
            name="phoneno"
            value={formData.phoneno}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
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
            placeholder="Enter your country"
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
            placeholder="Enter your state"
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
            placeholder="Enter 6-digit pincode"
            maxLength="6"
            className={errors.pincode ? "input-error" : ""}
          />
          {errors.pincode && <span className="error-text">{errors.pincode}</span>}
        </div>

        {/* Hours Per Month */}
        <div className="form-group">
          <label htmlFor="hrspmonth">Hours Available Per Month *</label>
          <input
            type="number"
            id="hrspmonth"
            name="hrspmonth"
            value={formData.hrspmonth}
            onChange={handleChange}
            placeholder="Enter hours (3 digits)"
            maxLength="3"
            className={errors.hrspmonth ? "input-error" : ""}
          />
          {errors.hrspmonth && <span className="error-text">{errors.hrspmonth}</span>}
        </div>

        {/* Scout Shop */}
        <div className="form-group">
          <label htmlFor="scoutshop">Do you have a scout shop? *</label>
          <select
            id="scoutshop"
            name="scoutshop"
            value={formData.scoutshop}
            onChange={handleChange}
            className="select-input"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default Franchise;
