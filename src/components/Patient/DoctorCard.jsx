import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope,
  faUserMd,
  faMapMarkerAlt,
  faPhone,
  faClock,
  faCalendarCheck
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axios from "axios";
import AppointmentForm from "./AppointmentForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorCard = ({ doctor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // UPDATED: Booking handler matches slot-based API and endpoint!
  const handleAppointmentSubmit = async (appointmentData) => {
    const patientId = localStorage.getItem("userId");
    // build payload for slot-based booking
    const payload = {
      patient: patientId,
      doctor: appointmentData.doctor,
      slotId: appointmentData.slotId,
      disease: appointmentData.disease
    };
    try {
      await axios.post(
        "https://backend-dashboard-v3o0.onrender.com/appointment/book",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment created successfully");
      closeModal();
    } catch (error) {
      toast.error("Error creating appointment");
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
      <div className="relative h-64 mb-4">
        <img
          src={doctor.profile}
          alt={`${doctor.firstName} ${doctor.lastName}`}
          className="w-full h-full rounded-lg"
        />
        <div className="absolute bottom-0 left-0 p-2 bg-cyan-700 text-white rounded-tr-lg">
          <FontAwesomeIcon icon={faStethoscope} className="mr-2" />
          {doctor.specialty}
        </div>
      </div>
      <div className="text-indigo-700 font-semibold mb-2">
        Dr. {doctor.firstName} {doctor.lastName}
      </div>
      <div className="text-gray-700 text-sm mb-2">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
        {doctor.clinicLocation}
      </div>
      <div className="text-gray-700 text-sm mb-2">
        <FontAwesomeIcon icon={faPhone} className="mr-2" />
        {doctor.contactNumber}
      </div>
      <div className="text-gray-700 text-sm mb-2">
        <FontAwesomeIcon icon={faClock} className="mr-2" />
        Working Hours: {doctor.workingHours}
      </div>
      <div className="text-gray-700 text-sm mb-2">
        <FontAwesomeIcon icon={faUserMd} className="mr-2" />
        {doctor.about}
      </div>
      <div className="text-center">
        <button
          onClick={openModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-indigo active:bg-indigo-800 transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
          Book Appointment
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Book Appointment"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <AppointmentForm
          doctor={doctor}
          onSubmit={handleAppointmentSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default DoctorCard;
