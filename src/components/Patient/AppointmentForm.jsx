import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faExclamationCircle,
  faSave,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AppointmentForm = ({ doctor, onSubmit, onCancel }) => {
  const [appointmentData, setAppointmentData] = useState({
    doctor: doctor._id,
    appointmentDate: "",
    slotId: "",
    disease: ""
  });

  const [slots, setSlots] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch available slots when either doctor or date changes
    const fetchSlots = async () => {
      if (doctor && appointmentData.appointmentDate) {
        try {
          const response = await axios.get(
            `https://backend-dashboard-v3o0.onrender.com/appointment/slots?doctorId=${doctor._id}&date=${appointmentData.appointmentDate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setSlots(response.data.slots || []);
        } catch (error) {
          toast.error("Failed to fetch slots", { position: "top-right" });
        }
      } else {
        setSlots([]);
      }
    };
    fetchSlots();
  }, [doctor, appointmentData.appointmentDate, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appointmentData.slotId) {
      toast.error("Please select a time slot.", { position: "top-right" });
      return;
    }
    onSubmit(appointmentData); // Pass the slotId and disease, doctor, etc.
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-opacity-30 backdrop-blur-xs">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md bg-opacity-20 backdrop-blur-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold text-indigo-600">
            Book Appointment
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-indigo-600 hover:text-indigo-400 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-indigo-600 text-bold text-sm font-bold mb-2">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="mr-2 text-indigo-600"
              />
              Appointment Date
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={appointmentData.appointmentDate}
              onChange={handleInputChange}
              className="w-full border-2 border-indigo-600 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-indigo-600 text-sm font-bold mb-2">
              <FontAwesomeIcon
                icon={faClock}
                className="mr-2 text-indigo-600"
              />
              Time Slot
            </label>
            <select
              name="slotId"
              value={appointmentData.slotId}
              onChange={handleInputChange}
              className="w-full border-2 border-indigo-600 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-700"
              required
              disabled={!appointmentData.appointmentDate || slots.length === 0}
            >
              <option value="">
                {appointmentData.appointmentDate
                  ? slots.length > 0
                    ? "Select a slot"
                    : "No slots available"
                  : "Select date first"}
              </option>
              {slots.map((slot) => (
                <option key={slot._id} value={slot._id}>
                  {slot.startTime} - {slot.endTime}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-indigo-600 text-sm font-bold mb-2">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="mr-2 text-indigo-600"
              />
              Disease
            </label>
            <input
              type="text"
              name="disease"
              value={appointmentData.disease}
              onChange={handleInputChange}
              className="w-full border-2 border-indigo-600 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-700"
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline-indigo active:bg-indigo-800 transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
