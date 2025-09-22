import React, { useEffect,useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RegistrationForm.css"; // CSS file import

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: ""
    },
    bloodGroup: "",
    specialty: "",
    clinicLocation: "",
    workingHours: "",
    about: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name.substring(8)]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        role === "doctor"
          ? "https://backend-dashboard-v3o0.onrender.com/doctor/register"
          : "https://backend-dashboard-v3o0.onrender.com/patient/register",
        formData
      );

      if (response.data.status) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(
        "An error occurred while registering. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2 className="text-3xl font-bold text-center text-700 mb-6"
         style={{ color: '#36a4af' }}>
          Registration
        </h2>

        {/* Role Selection */}
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <label className="block text-700 text-sm font-bold mb-2"
             style={{ color: '#36a4af' }}>
              Role
            </label>
            <div className="flex items-center -mt-2 text-600 font-bold"
             style={{ color: '#36a4af' }}>
              <label className="mr-4">
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={role === "patient"}
                  onChange={handleRoleChange}
                  className="mr-2 leading-tight text-600"
                   style={{ color: '#36a4af' }}
                />
                Patient
              </label>
              
            </div>
          </div>
        </div>

        {/* Patient Form */}
        <form
          onSubmit={handleSubmit}
          className={`mb-4 ${role === "doctor" ? "hidden" : ""}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "First Name", name: "firstName", type: "text" },
              { label: "Last Name", name: "lastName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
              { label: "Date of Birth", name: "dateOfBirth", type: "date" },
              { label: "Contact Number", name: "contactNumber", type: "tel" }
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-700 text-sm font-bold mb-2" style={{ color: '#36a4af' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="w-full border-b-4 border-600 rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-700 text-gray-700 placeholder-gray-400" style={{ color: '#36a4af' }}
                  placeholder={`Enter ${field.label}`}
                  required
                />
              </div>
            ))}
          </div>

          {/* Gender & Blood Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-700 text-sm font-bold mb-2" style={{ color: '#36a4af' }}>
                Gender<span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full border-b-4 border-600 rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-700 text-gray-700"
              >
                <option value="" disabled>
                  Select your gender
                </option>
                {["male", "female", "other"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-700 text-sm font-bold mb-2" style={{ color: '#36a4af' }}>
                Blood Group<span className="text-red-500">*</span>
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full border-b-4 border-600 rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-700 text-gray-700"
              >
                <option value="" disabled>
                  Select your blood group
                </option>
                {[
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                  "Other"
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Street", name: "address.street", type: "text" },
              { label: "City", name: "address.city", type: "text" },
              { label: "State", name: "address.state", type: "text" },
              { label: "Postal Code", name: "address.postalCode", type: "text" }
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-700 text-sm font-bold mb-2" style={{ color: '#36a4af' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={
                    field.name.startsWith("address.")
                      ? formData.address[field.name.split(".")[1]]
                      : formData[field.name]
                  }
                  onChange={handleInputChange}
                  className="w-full border-b-4 border-cyan-600 rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-700 text-gray-700"
                  placeholder={`Enter ${field.label}`}
                  required
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register as Patient"}
            </button>
          </div>
          <div className="text-center mt-4">
            <span className="text-white">Already registered?</span>{" "}
            <Link to="/login" className="text-cyan-700 hover:underline">
              Login here.
            </Link>
          </div>
        </form>
         
        {/* Doctor Form */}
        <form
          onSubmit={handleSubmit}
          className={`mb-4 ${role === "doctor" ? "" : "hidden"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "First Name", name: "firstName", type: "text" },
              { label: "Last Name", name: "lastName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
              { label: "Specialty", name: "specialty", type: "text" },
              { label: "Clinic Location", name: "clinicLocation", type: "text" },
              { label: "Contact Number", name: "contactNumber", type: "tel" },
              { label: "Working Hours", name: "workingHours", type: "text" }
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-cyan-700 text-sm font-bold mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="w-full border-b-4 border-cyan-600 rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-700 text-gray-700"
                  placeholder={`Enter ${field.label}`}
                  required
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-cyan-700 text-sm font-bold mb-2">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              className="w-full border-b-4 border-cyan-600 rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-700 text-gray-700"
              placeholder="Tell us about yourself"
              rows="4"
            ></textarea>
          </div>

          <div className="text-center">
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register as Doctor"}
            </button>
          </div>
          <div className="text-center mt-4">
            <span className="text-black">Already registered?</span>{" "}
            <Link to="/login" className="text-700 font-bold" style={{ color: '#36a4af' }}>
              Login here.
            </Link>
          </div>
        </form>
    
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegistrationForm;
