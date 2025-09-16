import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMd,
  faMapMarkerAlt,
  faPhone,
  faClock,
  faStethoscope,
  faUserPlus,
  faEdit,
  faTimes,
  faSave,
  faUser,
  faCheckCircle,
  faBan,
  faPencilAlt,
  faTrash,
  faSignOutAlt,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/Footer";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

import "./DoctorDashboard.css";

const statusColors = {
  scheduled: "text-blue-500",
  completed: "text-green-500",
  canceled: "text-red-500",
};

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [editedStatus, setEditedStatus] = useState({});
  const [slots, setSlots] = useState([]);
  const [slotDate, setSlotDate] = useState(() => {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  });
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editedSlotTimes, setEditedSlotTimes] = useState({
    startTime: "",
    endTime: "",
  });
  const token = localStorage.getItem("token");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Helper: time formatting
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

  // Fetch doctor
  useEffect(() => {
    const doctorId = localStorage.getItem("userId");
    if (doctorId && token) {
      axios
        .get(`https://backend-dashboard-v3o0.onrender.com/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setDoctor(res.data.doctor))
        .catch((err) => console.error("Doctor fetch:", err));
    }
  }, [token]);

  // Fetch appointments
  useEffect(() => {
    const doctorId = localStorage.getItem("userId");
    if (doctorId && token) {
      axios
        .get(`https://backend-dashboard-v3o0.onrender.com/appointment/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAppointments(res.data.appointment || []))
        .catch((err) => console.error("Appointments fetch:", err));
    }
  }, [token]);

  // Fetch slots for selected date
  useEffect(() => {
    const doctorId = localStorage.getItem("userId");
    if (doctorId && slotDate) {
      axios
        .get(
          `https://backend-dashboard-v3o0.onrender.com/appointment/doctor/slots?doctorId=${doctorId}&date=${slotDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) =>
          setSlots(
            (res.data?.slots || []).sort((a, b) => a.startTime.localeCompare(b.startTime))
          )
        )
        .catch(() => setSlots([]));
    }
  }, [token, slotDate, editingSlotId]);

  // Doctor detail update
  const updateDoctorDetail = async (field, value) => {
    const userId = localStorage.getItem("userId");
    const requestBody = { [field]: value, role: "doctor" };
    try {
      const response = await axios.patch(
        `https://backend-dashboard-v3o0.onrender.com/doctor/${userId}`,
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setDoctor({ ...doctor, [field]: value });
        setEditingField(null);
        toast.success(`Successfully updated ${field}`);
      } else {
        toast.error("Failed to update doctor detail");
      }
    } catch {
      toast.error(`Error updating ${field}`);
    }
  };

  // Appointment status update
  const updateEditedStatus = (appointmentId, status) => {
    setEditedStatus((prev) => ({ ...prev, [appointmentId]: status }));
  };
  const handleStatusChange = (event, appointment) => {
    updateEditedStatus(appointment._id, event.target.value);
  };
  const saveEditedStatus = async (appointmentId) => {
    const newStatus = editedStatus[appointmentId];
    const requestBody = { status: newStatus, role: "doctor" };
    try {
      const response = await axios.patch(
        `https://backend-dashboard-v3o0.onrender.com/appointment/${appointmentId}`,
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setAppointments(
          appointments.map((ap) =>
            ap._id === appointmentId ? { ...ap, status: newStatus } : ap
          )
        );
        toast.success("Appointment status updated successfully");
      } else {
        toast.error("Failed to update appointment status");
      }
    } catch {
      toast.error("Error updating appointment status");
    }
  };

  // Appointment delete
  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await axios.delete(
        `https://backend-dashboard-v3o0.onrender.com/appointment/${appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setAppointments(appointments.filter((ap) => ap._id !== appointmentId));
        toast.success("Appointment deleted successfully");
      } else {
        toast.error("Failed to delete appointment");
      }
    } catch {
      toast.error("Error deleting appointment");
    }
  };

  // Slot: mark available/unavailable
  const toggleSlotAvailability = async (slotId, available) => {
    try {
      await axios.patch(
        `https://backend-dashboard-v3o0.onrender.com/appointment/slot/${slotId}/availability`,
        { available },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSlots((prev) =>
        prev.map((slot) =>
          slot._id === slotId ? { ...slot, isAvailable: available } : slot
        )
      );
      toast.success(`Slot marked as ${available ? "available" : "unavailable"}`);
    } catch {
      toast.error("Failed to update slot availability");
    }
  };

  // Slot: edit timings
  const startEditSlot = (slotId, slot) => {
    setEditingSlotId(slotId);
    setEditedSlotTimes({ startTime: slot.startTime, endTime: slot.endTime });
  };
  const cancelEditSlot = () => {
    setEditingSlotId(null);
    setEditedSlotTimes({ startTime: "", endTime: "" });
  };
  const saveEditedSlot = async (slotId) => {
    if (!editedSlotTimes.startTime || !editedSlotTimes.endTime) {
      toast.error("Both times are required");
      return;
    }
    try {
      const response = await axios.patch(
        `https://backend-dashboard-v3o0.onrender.com/appointment/slot/${slotId}/timings`,
        editedSlotTimes,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSlots((prev) =>
        prev.map((slot) =>
          slot._id === slotId
            ? {
                ...slot,
                startTime: response.data.slot.startTime,
                endTime: response.data.slot.endTime,
              }
            : slot
        )
      );
      setEditingSlotId(null);
      toast.success("Slot timings updated");
    } catch {
      toast.error("Unable to update slot timings. Only unbooked slots can be edited.");
    }
  };

  // Slot: bulk generate slots for the day
  const generateSlots = async () => {
    if (!doctor || !slotDate) return;
    try {
      await axios.post(
        `https://backend-dashboard-v3o0.onrender.com/appointment/doctor/${doctor._id}/generate-slots`,
        { date: slotDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Slots generated for the day!");
      // Refresh slots
      const doctorId = doctor._id;
      const res = await axios.get(
        `https://backend-dashboard-v3o0.onrender.com/appointment/doctor/slots?doctorId=${doctorId}&date=${slotDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSlots(res.data.slots || []);
    } catch {
      toast.error("Error generating slots for the day.");
    }
  };

  // Group appointments by date
  const groupedAppointments = appointments.reduce((acc, ap) => {
    const date = ap.appointmentDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(ap);
    return acc;
  }, {});

  // Sort grouped appointment dates ascending (older first)
  const sortedDatesAsc = Object.keys(groupedAppointments).sort((a, b) => new Date(a) - new Date(b));

  // Today date string
  const todayStr = new Date().toISOString().split("T")[0];

  // Final date order: "Today" first if present, then the older dates ascending
  const finalOrderedDates = [
    ...(sortedDatesAsc.includes(todayStr) ? [todayStr] : []),
    ...sortedDatesAsc.filter((date) => date !== todayStr),
  ];

  // Format for date display
  function formatDateDisplay(dateStr) {
    if (dateStr === todayStr) return "Today";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="doctor-bg">
        <ToastContainer position="top-right" autoClose={3000} />
        <header className="main-header-theme">
          <div className="header-content">
            <h1 className="header-title-theme">
              <FontAwesomeIcon icon={faUserMd} className="icon-accent" />
              Welcome, Dr. {doctor ? `${doctor.firstName} ${doctor.lastName}` : "Loading..."}
            </h1>
            <button className="header-logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="icon-accent" /> Logout
            </button>
          </div>
        </header>

        <div className="main-content-container">
          {/* SLOT MANAGEMENT SECTION */}
          <div className="appointments-glass-card">
            <h2 className="appointments-title">
              <FontAwesomeIcon icon={faClock} className="icon-accent" /> Slot Management
            </h2>
            <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-2">
              <label className="slot-date-label mr-2 text-blue-800 font-bold">Select Date:</label>
              <input
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="profile-input"
                style={{ minWidth: 190, marginBottom: 8 }}
              />
              <button
  className="generate-slots-btn"
  onClick={generateSlots}
  
>
  <FontAwesomeIcon icon={faPlusCircle} className="mr-1" />
  Generate Slots
</button>

            </div>
            <div className="overflow-x-auto">
              <table className="modern-glass-table" style={{ minWidth: 500 }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Timing</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ color: "#6d7bf5", textAlign: "center" }}>
                        No slots found. Click "Generate Slots" for this date.
                      </td>
                    </tr>
                  ) : (
                    slots.map((slot, idx) => (
                      <tr key={slot._id}>
                        <td>{idx + 1}</td>
                        <td>
                          {editingSlotId === slot._id ? (
                            <div className="flex gap-2 items-center">
                              <input
                                type="time"
                                value={editedSlotTimes.startTime}
                                onChange={(e) =>
                                  setEditedSlotTimes((s) => ({ ...s, startTime: e.target.value }))
                                }
                                className="profile-input w-20"
                              />
                              {" - "}
                              <input
                                type="time"
                                value={editedSlotTimes.endTime}
                                onChange={(e) =>
                                  setEditedSlotTimes((s) => ({ ...s, endTime: e.target.value }))
                                }
                                className="profile-input w-20"
                              />
                            </div>
                          ) : (
                            `${formatTimeToAMPM(slot.startTime)} - ${formatTimeToAMPM(slot.endTime)}`
                          )}
                        </td>
                        <td style={{ fontWeight: "bold" }}>
                          {slot.isAvailable ? (
                            <span style={{ color: "green" }}>Available</span>
                          ) : (
                            <span style={{ color: "red" }}>Unavailable/Booked</span>
                          )}
                        </td>
                        <td>
                          {editingSlotId === slot._id ? (
                            <>
                              <button
                                className="btn btn-success"
                                onClick={() => saveEditedSlot(slot._id)}
                                title="Save"
                              >
                                <FontAwesomeIcon icon={faSave} />
                              </button>
                              <button
                                className="btn btn-danger ml-2"
                                onClick={cancelEditSlot}
                                title="Cancel"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-primary"
                                onClick={() => startEditSlot(slot._id, slot)}
                                disabled={!slot.isAvailable}
                                title="Edit slot (only if unbooked)"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              {slot.isAvailable ? (
                                <button
                                  className="btn btn-danger ml-2"
                                  onClick={() => toggleSlotAvailability(slot._id, false)}
                                  title="Mark Unavailable"
                                >
                                  <FontAwesomeIcon icon={faBan} />
                                </button>
                              ) : (
                                <button
                                  className="btn btn-success ml-2"
                                  onClick={() => toggleSlotAvailability(slot._id, true)}
                                  title="Mark Available"
                                >
                                  <FontAwesomeIcon icon={faCheckCircle} />
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DOCTOR INFO */}
          <div className="doctor-profile-glass-card">
            <div className="doctor-info-grid">
              <div className="doctor-info-block">
                {doctor ? (
                  <>
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
                          onClick={() => updateDoctorDetail("firstName", editedValue)}
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
                        <span className="field-value">{doctor.firstName}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("firstName");
                            setEditedValue(doctor.firstName);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

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
                          onClick={() => updateDoctorDetail("lastName", editedValue)}
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
                        <span className="field-value">{doctor.lastName}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("lastName");
                            setEditedValue(doctor.lastName);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {editingField === "specialty" ? (
                      <div className="field-edit-row">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="profile-edit-input"
                        />
                        <button
                          className="icon-accent"
                          onClick={() => updateDoctorDetail("specialty", editedValue)}
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
                        <FontAwesomeIcon icon={faStethoscope} className="icon-accent" />
                        <span className="field-label">Specialty:</span>
                        <span className="field-value">{doctor.specialty}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("specialty");
                            setEditedValue(doctor.specialty);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {editingField === "clinicLocation" ? (
                      <div className="field-edit-row">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="profile-edit-input"
                        />
                        <button
                          className="icon-accent"
                          onClick={() => updateDoctorDetail("clinicLocation", editedValue)}
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
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="icon-accent" />
                        <span className="field-label">Clinic Location:</span>
                        <span className="field-value">{doctor.clinicLocation}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("clinicLocation");
                            setEditedValue(doctor.clinicLocation);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {editingField === "contactNumber" ? (
                      <div className="field-edit-row">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="profile-edit-input"
                        />
                        <button
                          className="icon-accent"
                          onClick={() => updateDoctorDetail("contactNumber", editedValue)}
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
                        <span className="field-value">{doctor.contactNumber}</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("contactNumber");
                            setEditedValue(doctor.contactNumber);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {editingField === "workingHours" ? (
                      <div className="field-edit-row">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="profile-edit-input"
                        />
                        <button
                          className="icon-accent"
                          onClick={() => updateDoctorDetail("workingHours", editedValue)}
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
                        <FontAwesomeIcon icon={faClock} className="icon-accent" />
                        <span className="field-label">Working Hours:</span>
                        <span className="field-value">{doctor.workingHours} hours per day</span>
                        <button
                          className="icon-accent"
                          onClick={() => {
                            setEditingField("workingHours");
                            setEditedValue(doctor.workingHours);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="profile-loading">Loading doctor data...</p>
                )}
              </div>
              <div className="doctor-img-block">
                <div className="profile-img-wrapper">
                  <img
                    src={doctor ? doctor.profile : ""}
                    alt={doctor ? `${doctor.firstName} ${doctor.lastName}` : ""}
                    className="profile-img"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* APPOINTMENTS */}
          <div className="appointments-glass-card">
            <h2 className="appointments-title">
              <FontAwesomeIcon icon={faUserPlus} className="icon-accent" />
              Appointments
            </h2>
            <p className="appointments-count">Total Appointments: {appointments.length}</p>
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
                    <tbody>
                      {finalOrderedDates.map((date) => (
                        <React.Fragment key={date}>
                          <tr>
                            <td
                              colSpan="6"
                              style={{
                                fontWeight: 700,
                                fontSize: "1.09rem",
                                color: "#573cd5",
                                background: "rgba(176,196,252,0.12)",
                                textAlign: "left",
                                borderTop: "2px solid #e6ebf7",
                              }}
                            >
                              {date === todayStr ? "Today" : formatDateDisplay(date)}
                            </td>
                          </tr>
                          <tr>
                            <th>Patient</th>
                            <th>Phone</th>
                            <th>Time</th>
                            <th>Disease</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                          {groupedAppointments[date].map((appointment) => (
                            <tr key={appointment._id}>
                              <td>{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</td>
                              <td>{appointment.patient.contactNumber || "-"}</td>
                              <td>
                                {appointment.slot
                                  ? `${formatTimeToAMPM(appointment.slot.startTime)} - ${formatTimeToAMPM(appointment.slot.endTime)}`
                                  : "--"}
                              </td>
                              <td>{appointment.disease}</td>
                              <td>
                                {editingField === appointment._id ? (
                                  <div className="field-edit-row">
                                    <select
                                      value={editedStatus[appointment._id] || appointment.status}
                                      onChange={(e) => handleStatusChange(e, appointment)}
                                      className="profile-input"
                                    >
                                      <option value="scheduled">Scheduled</option>
                                      <option value="completed">Completed</option>
                                      <option value="canceled">Canceled</option>
                                    </select>
                                    <button
                                      className="btn btn-success ml-2"
                                      onClick={() => {
                                        saveEditedStatus(appointment._id);
                                        setEditingField(null);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faSave} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className={`status-pill ${statusColors[appointment.status]}`}>
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
                                      className="btn btn-primary ml-2"
                                      onClick={() => {
                                        setEditingField(appointment._id);
                                        setEditedStatus({
                                          ...editedStatus,
                                          [appointment._id]: appointment.status,
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
                                  className="btn btn-danger"
                                  onClick={() => deleteAppointment(appointment._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DoctorDashboard;
