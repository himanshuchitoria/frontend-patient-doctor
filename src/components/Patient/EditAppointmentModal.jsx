import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EditAppointmentModal = ({
  appointment,
  closeModal,
  updateAppointment
}) => {
  const doctorFirstName = appointment.doctor.firstName || "";
  const doctorLastName = appointment.doctor.lastName || "";

  // For slot-based editing
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(appointment.appointmentDate);
  const [selectedSlotId, setSelectedSlotId] = useState(
    appointment.slot && appointment.slot._id ? appointment.slot._id : ""
  );

  const [editedData, setEditedData] = useState({
    doctorId: appointment.doctor._id,
    doctorFirstName: doctorFirstName,
    doctorLastName: doctorLastName,
    appointmentDate: appointment.appointmentDate,
    slotId: "",
    disease: appointment.disease,
    status: appointment.status,
    additionalInfo: appointment.additionalInfo
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch available slots for patient to re-schedule
    const fetchSlots = async () => {
      if (
        appointment.doctor &&
        selectedDate &&
        appointment.doctor._id
      ) {
        try {
          const response = await axios.get(
            `https://backend-dashboard-v3o0.onrender.com/appointment/slots?doctorId=${appointment.doctor._id}&date=${selectedDate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          // Add current slot to selectable list if not available to others
          let slotsArr = response.data.slots || [];
          if (appointment.slot && appointment.slot._id && appointment.appointmentDate === selectedDate) {
            const already = slotsArr.find(
              (slot) => slot._id === appointment.slot._id
            );
            if (!already) {
              slotsArr.push({
                ...appointment.slot,
                _id: appointment.slot._id,
                startTime: appointment.slot.startTime,
                endTime: appointment.slot.endTime
              });
            }
          }
          slotsArr = slotsArr.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
          setAvailableSlots(slotsArr);
        } catch (error) {
          toast.error("Failed to fetch slots", { position: "top-right" });
        }
      }
    };
    fetchSlots();
  }, [appointment.doctor, selectedDate, appointment.slot, token]);

  useEffect(() => {
    // Set slotId as current slot when modal opens or date changes to same as original
    if (
      appointment.slot &&
      appointment.slot._id &&
      selectedDate === appointment.appointmentDate
    ) {
      setSelectedSlotId(appointment.slot._id);
    } else {
      setSelectedSlotId("");
    }
  }, [selectedDate, appointment.slot, appointment.appointmentDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "appointmentDate") {
      setSelectedDate(value);
      setEditedData({
        ...editedData,
        appointmentDate: value
      });
    } else if (name === "slotId") {
      setSelectedSlotId(value);
      setEditedData({
        ...editedData,
        slotId: value
      });
    } else {
      setEditedData({
        ...editedData,
        [name]: value
      });
    }
  };

  const handleSave = () => {
    if (!selectedSlotId) {
      toast.error("Please select a time slot.");
      return;
    }
    updateAppointment({ ...editedData, slotId: selectedSlotId });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-xs">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md bg-opacity-20 backdrop-blur-3xl ">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
          <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-600" />
          Edit Appointment
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-blue-700">
            Doctor
          </label>
          <input
            type="text"
            name="doctorFirstName"
            value={`${doctorFirstName} ${doctorLastName}`}
            readOnly
            className="mt-1 block w-full p-2 rounded-md shadow-sm focus:outline-none focus:border-indigo-700 border-b-4 border-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-blue-700">
            Appointment Date
          </label>
          <input
            type="date"
            name="appointmentDate"
            value={selectedDate}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-blue-700">
            Time Slot
          </label>
          <select
            name="slotId"
            value={selectedSlotId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
            disabled={!selectedDate || availableSlots.length === 0}
          >
            <option value="">
              {selectedDate
                ? availableSlots.length > 0
                  ? "Select a slot"
                  : "No slots available"
                : "Select date first"}
            </option>
            {availableSlots.map((slot) => (
              <option key={slot._id} value={slot._id}>
                {slot.startTime} - {slot.endTime}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-blue-700">
            Disease
          </label>
          <input
            type="text"
            name="disease"
            value={editedData.disease}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-blue-700">
            Status
          </label>
          <select
            name="status"
            value={editedData.status}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-blue-700">
            Additional Info
          </label>
          <textarea
            name="additionalInfo"
            value={editedData.additionalInfo}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="text-blue-600 hover:underline"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save
          </button>
          <button
            onClick={closeModal}
            className="text-red-600 ml-4 hover:underline"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
