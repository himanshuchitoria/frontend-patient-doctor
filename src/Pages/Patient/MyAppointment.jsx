import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faVenusMars,
  faCalendar,
  faUser,
  faEdit,
  faSave,
  faTimes,
  faTrash,
  faClock,
  faCheckCircle,
  faBan,
  faPencilAlt,
  faSignOutAlt,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "../../components/Breadcrumb";
import EditAppointmentModal from "../../components/Patient/EditAppointmentModal";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import "./MyAppointment.css";

const statusColors = {
  scheduled: "text-blue-500",
  completed: "text-green-500",
  canceled: "text-red-500"
};

const MyAppointment = () => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAppointmentData, setEditAppointmentData] = useState(null);
  const [editedStatus, setEditedStatus] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const patientId = localStorage.getItem("userId");
    const fetchPatientData = async () => {
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
          setAppointments(response.data.appointment || []);
        }
      } catch (error) {
        console.error("Error fetching patient appointments:", error);
      }
    };
    fetchPatientData();
  }, [token]);

  useEffect(() => {
    const patientId = localStorage.getItem("userId");
    if (patientId) {
      axios
        .get(
          `https://backend-dashboard-v3o0.onrender.com/patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          setPatient(response.data.patient);
        })
        .catch((error) => {
          console.error("Error fetching patient data:", error);
        });
    }
  }, [token]);

  const updatePatientDetail = async (field, value) => {
    try {
      const userId = localStorage.getItem("userId");
      const requestBody = {
        [field]: value,
        role: "patient"
      };

      const response = await axios.patch(
        `https://backend-dashboard-v3o0.onrender.com/patient/${userId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setPatient({ ...patient, [field]: value });
        setEditingField(null);
        toast.success(`Successfully updated ${field}`);
      } else {
        toast.error("Failed to update patient detail");
      }
    } catch (error) {
      toast.error(`Error updating ${field}`);
    }
  };

  const openEditModal = (appointment) => {
    setEditAppointmentData(appointment);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const updateAppointmentData = async (updatedData) => {
    const requestBody = {
      updatedData,
      role: "patient"
    };
    try {
      const response = await axios.patch(
        `https://backend-dashboard-v3o0.onrender.com/appointment/${editAppointmentData._id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        const updatedAppointments = appointments.map((appointment) =>
          appointment._id === editAppointmentData._id
            ? { ...appointment, ...updatedData }
            : appointment
        );
        setAppointments(updatedAppointments);
        setEditModalOpen(false);
        toast.success("Appointment updated successfully");
      } else {
        toast.error("Failed to update appointment");
      }
    } catch (error) {
      toast.error("Error updating appointment");
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await axios.delete(
        `https://backend-dashboard-v3o0.onrender.com/appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        setAppointments(appointments.filter(
          (appointment) => appointment._id !== appointmentId
        ));
        toast.success("Appointment deleted successfully");
      } else {
        toast.error("Failed to delete appointment");
      }
    } catch (error) {
      toast.error("Error deleting appointment");
    }
  };

  const updateEditedStatus = (appointmentId, status) => {
    setEditedStatus((prevState) => ({
      ...prevState,
      [appointmentId]: status
    }));
  };

  const handleStatusChange = (event, appointment) => {
    updateEditedStatus(appointment._id, event.target.value);
  };

  const saveEditedStatus = async (appointmentId) => {
    const newStatus = editedStatus[appointmentId];
    const requestBody = {
      status: newStatus,
      role: "patient"
    };
    try {
      const response = await axios.patch(
        `https://backend-dashboard-v3o0.onrender.com/appointment/${appointmentId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        setAppointments(appointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        ));
        toast.success("Appointment status updated successfully");
      } else {
        toast.error("Failed to update appointment status");
      }
    } catch (error) {
      toast.error("Error updating appointment status");
    }
  };

  function formatTimeToAMPM(time) {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let period = "AM";
    let formattedHours = parseInt(hours, 10);
    if (formattedHours >= 12) {
      period = "PM";
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
    }
    return `${formattedHours}:${minutes} ${period}`;
  }

  const breadcrumbs = [
    { title: "Home", link: "/patient-dashboard" },
    { title: "My Appointment", link: "/myappointment" }
  ];
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="appointment-bg">
        <ToastContainer position="top-right" autoClose={3000} />
        <header className="main-header-theme">
          <div className="header-content">
            <h1 className="header-title-theme">
              <FontAwesomeIcon icon={faUser} className="icon-accent" />
              Welcome,{" "}
              {patient
                ? `${patient.firstName} ${patient.lastName}`
                : "Loading..."}
            </h1>
            <button
              className="header-logout-btn"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="icon-accent" />
              Logout
            </button>
          </div>
        </header>
        <div className="main-content-container">
          <div className="breadcrumb-appointment-wrapper">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <div className="profile-glass-card">
            <div className="profile-info-grid">
              <div className="profile-info-block">
                {patient ? (
                  <>
                    {/* First Name */}
                    {editingField === "firstName" ? (
                      <div className="field-edit-row">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="profile-edit-input"
                        />
                        <button
                          className="icon-accent"
                          onClick={() =>
                            updatePatientDetail("firstName", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="icon-red"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="field-row">
                        <FontAwesomeIcon icon={faUser} className="icon-accent" />
                        <span className="field-label">First Name:</span>
                        <span className="field-value">{patient.firstName}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("firstName");
                            setEditedValue(patient.firstName);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Last Name */}
                    {editingField === "lastName" ? (
                      <div className="field-edit-row">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="profile-edit-input"
                        />
                        <button
                          className="icon-accent"
                          onClick={() =>
                            updatePatientDetail("lastName", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="icon-red"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="field-row">
                        <FontAwesomeIcon icon={faUser} className="icon-accent" />
                        <span className="field-label">Last Name:</span>
                        <span className="field-value">{patient.lastName}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("lastName");
                            setEditedValue(patient.lastName);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Email */}
                    {editingField === "email" ? (
                      <div className="field-edit-row">
                        <input
                          type="email"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="profile-edit-input"
                        />
                        <button
                          className="icon-accent"
                          onClick={() =>
                            updatePatientDetail("email", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="icon-red"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="field-row">
                        <FontAwesomeIcon icon={faEnvelope} className="icon-accent" />
                        <span className="field-label">Email:</span>
                        <span className="field-value">{patient.email}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("email");
                            setEditedValue(patient.email);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Gender */}
                    {editingField === "gender" ? (
                      <div className="field-edit-row">
                        <input
                          type="radio"
                          value="male"
                          checked={editedValue === "male"}
                          onChange={() => setEditedValue("male")}
                        />
                        <label className="ml-2">Male</label>
                        <input
                          type="radio"
                          value="female"
                          checked={editedValue === "female"}
                          onChange={() => setEditedValue("female")}
                        />
                        <label className="ml-2">Female</label>
                        <button
                          className="icon-accent"
                          onClick={() =>
                            updatePatientDetail("gender", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="icon-red"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="field-row">
                        <FontAwesomeIcon icon={faVenusMars} className="icon-accent" />
                        <span className="field-label">Gender:</span>
                        <span className="field-value">{patient.gender}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("gender");
                            setEditedValue(patient.gender);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Date of Birth */}
                    {editingField === "dateOfBirth" ? (
                      <div className="field-edit-row">
                        <input
                          type="date"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="profile-edit-input"
                        />
                        <button
                          className="icon-accent"
                          onClick={() =>
                            updatePatientDetail("dateOfBirth", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="icon-red"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="field-row">
                        <FontAwesomeIcon icon={faCalendar} className="icon-accent" />
                        <span className="field-label">Date of Birth:</span>
                        <span className="field-value">{patient.dateOfBirth}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("dateOfBirth");
                            setEditedValue(patient.dateOfBirth);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Contact Number */}
                    {editingField === "contactNumber" ? (
                      <div className="field-edit-row">
                        <input
                          type="tel"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="profile-edit-input"
                        />
                        <button
                          className="icon-accent"
                          onClick={() =>
                            updatePatientDetail("contactNumber", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="icon-red"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="field-row">
                        <FontAwesomeIcon icon={faPhone} className="icon-accent" />
                        <span className="field-label">Contact Number:</span>
                        <span className="field-value">{patient.contactNumber}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("contactNumber");
                            setEditedValue(patient.contactNumber);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="profile-loading">Loading patient data...</p>
                )}
              </div>
              <div className="profile-img-block">
                <div className="profile-img-wrapper">
                  <img
                    src={
                      patient
                        ? patient.gender === "female"
                          ? "https://png.pngtree.com/png-vector/20190130/ourlarge/pngtree-cute-girl-avatar-material-png-image_678035.jpg"
                          : "https://yt3.googleusercontent.com/ytc/AGIKgqNO2Cz7ILUFn2DRPVjta3eANRPAhbI8eMeqcSjA=s900-c-k-c0x00ffffff-no-rj"
                        : ""
                    }
                    alt={patient ? `${patient.firstName} ${patient.lastName}` : ""}
                    className="profile-img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="appointments-glass-card">
            <h2 className="appointments-title">
              <FontAwesomeIcon icon={faUserPlus} className="icon-accent" />
              Appointments
            </h2>
            <p className="appointments-count">
              Total Appointments: {appointments.length}
            </p>
          </div>
          <hr className="divider-theme" />
          <div className="appointment-table-block">
            {appointments.length > 0 ? (
              <>
                <h2 className="upcoming-appointments-title">
                  <FontAwesomeIcon icon={faUserPlus} className="icon-accent" />
                  Upcoming Appointments
                </h2>
                <div className="table-responsive-theme">
                  <table className="modern-glass-table">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Disease</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                          <td>
                            {appointment.doctor
                              ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}` : "--"}
                          </td>
                          <td>{appointment.appointmentDate}</td>
                          <td>
                            {appointment.slot
                              ? `${formatTimeToAMPM(appointment.slot.startTime)} - ${formatTimeToAMPM(appointment.slot.endTime)}`
                              : "--"}
                          </td>
                          <td>
                            <span>{appointment.disease}</span>
                          </td>
                          <td>
                            {editingField === appointment._id ? (
                              <div className="field-edit-row">
                                <select
                                  value={
                                    editedStatus[appointment._id] ||
                                    appointment.status
                                  }
                                  onChange={(event) =>
                                    handleStatusChange(event, appointment)
                                  }
                                  className="profile-edit-input"
                                >
                                  <option value="scheduled">Scheduled</option>
                                  <option value="completed">Completed</option>
                                  <option value="canceled">Canceled</option>
                                </select>
                                <button
                                  className="icon-accent"
                                  onClick={() => {
                                    saveEditedStatus(appointment._id);
                                    setEditingField(null);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faSave} />
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`status-pill ${statusColors[appointment.status]}`}
                              >
                                {appointment.status}
                                <span className="ml-2">
                                  {appointment.status === "scheduled" && (
                                    <FontAwesomeIcon icon={faClock} />
                                  )}
                                  {appointment.status === "completed" && (
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                  )}
                                  {appointment.status === "canceled" && (
                                    <FontAwesomeIcon icon={faBan} />
                                  )}
                                </span>
                                <button
                                  className="icon-accent ml-2"
                                  onClick={() => {
                                    setEditingField(appointment._id);
                                    setEditedStatus({
                                      ...editedStatus,
                                      [appointment._id]: appointment.status
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                              </div>
                            )}
                          </td>
                          <td>
                            <button
                              className="icon-accent"
                              onClick={() => openEditModal(appointment)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="icon-red ml-1"
                              onClick={() => deleteAppointment(appointment._id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </div>
          {editModalOpen && (
            <EditAppointmentModal
              appointment={editAppointmentData}
              closeModal={closeEditModal}
              updateAppointment={updateAppointmentData}
            />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MyAppointment;
