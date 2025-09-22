import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUserMd, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../../components/Patient/DoctorCard";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/Footer";
import { AuthContext } from "../../Context/AuthContext";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "https://backend-dashboard-v3o0.onrender.com/doctor/all",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data.doctors) {
          setDoctors(response.data.doctors.reverse());
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchTotalAppointments = async () => {
      const patientId = localStorage.getItem("userId");
      try {
        if (patientId) {
          const response = await axios.get(
            `https://backend-dashboard-v3o0.onrender.com/appointment/patient/${patientId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          const data = response.data;
          setTotalAppointments(data.appointment.length);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchDoctors();
    fetchTotalAppointments();
  }, [token]);

  const breadcrumbs = [{ title: "Home", link: "/patient-dashboard" }];
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header>
        <div className="container header-container">
          <h1 className="header-title">
            <FontAwesomeIcon icon={faUserMd} />
            ReformMe Healthcare
          </h1>
          <button
            className="btn-transparent logout-btn small"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="icon-spacing" />
            Logout
          </button>
        </div>
      </header>

      <div className="patient-dashboard-container">
        <div className="container">
          <div className="breadcrumb-appointment-wrapper">
            <Breadcrumb items={breadcrumbs} />
            <button
              className="my-appointment-btn"
              onClick={() => navigate("/myappointment")}
              aria-label={`My Appointment, ${totalAppointments} appointments`}
            >
              <FontAwesomeIcon icon={faCalendarPlus} />
              My Appointment
              {totalAppointments > 0 && (
                <span className="appointment-count">{totalAppointments}</span>
              )}
            </button>
          </div>

          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div className="card-container" key={doctor._id}>
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
          
          <section className="reformme-info glass-gradient" aria-label="Information about ReformMe Healthcare Gurugram and Dr. Monika">
            <h2>ReformMe Healthcare Gurugram</h2>
            <p>
              ReformMe Healthcare is Gurugram's trusted physiotherapy and wellness center, where expert care meets cutting-edge practice. Our team is devoted to restoring movement, managing pain, and empowering every patient with holistic, evidence-based therapies in a modern, friendly environment.
            </p>
            <article className="doctor-profile" aria-label="Profile of Dr. Monika">
              <img 
                className="doctor-photo"
                src="https://www.bing.com/th/id/OIP.JW_4m4RVV4ywf0aiB6TWrgHaLH?w=150&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
                alt="Dr. Monika - Physiotherapist and Dietician at ReformMe Healthcare"
                loading="lazy"
              />
              <div className="doctor-details">
                <h3>Dr. Monika Sharma</h3>
                <span className="role">
                  Senior Physiotherapist & Certified Dietician
                </span>
                <p className="doctor-description">
                  Dr. Monika is acclaimed for her compassionate approach and multidisciplinary expertise in physiotherapy, diet planning, manual therapy, and functional rehabilitation. She customizes each programme based on the patient’s unique health goals—supporting rapid recovery and sustainable lifestyle transformation. Her verified credentials, patient stories, and ratings are featured below.
                </p>
                <button
                  className="practo-profile-btn"
                  aria-label="View Dr. Monika's Practo Profile"
                  onClick={() => window.open("https://www.practo.com/gurgaon/clinic/dr-monika-physiotherapist-chiropractor-and-dietician-best-physiotherapy-clinic-in-sector-54-gurugram-gurgaon-sector-54", "_blank")}
                >
                  View Dr. Monika’s Practo Profile
                </button>
              </div>
            </article>
            <section className="review-section" aria-label="Verified Patient Reviews on Practo">
              <h3>Verified Patient Reviews</h3>
              <div className="review">
                <blockquote>
                  “ReformMe Healthcare is truly life-changing. Dr. Monika helped me regain mobility and energy—her guidance is spot-on and trustworthy.”
                </blockquote>
                <cite>— Verified Practo Reviewer</cite>
              </div>
              <div className="review">
                <blockquote>
                  “Dr. Monika’s combination of therapy and nutrition advice made my recovery smoother and faster. Highly recommend her for holistic physiotherapy.”
                </blockquote>
                <cite>— Verified Practo Reviewer</cite>
              </div>
              <div className="review">
                <blockquote>
                  “I chose ReformMe based on Dr. Monika’s Practo rating. Every session exceeded expectations. Professional, empathetic, and knowledgeable.”
                </blockquote>
                <cite>— Verified Practo Reviewer</cite>
              </div>
            </section>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PatientDashboard;
