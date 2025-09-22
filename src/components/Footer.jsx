import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <>
      <style>{`
        .clinic-footer-bg {
          background: linear-gradient(90deg, #e6ebf7 50%, #b0c4fc 100%);
          padding: 2.2rem 0 1.3rem 0;
          box-shadow: 0 -6px 28px rgba(85, 120, 220, 0.09);
          margin-top: 4rem;
        }
        .clinic-footer-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .clinic-footer-title {
          color: #573cd5;
          font-weight: 700;
          font-size: 1.12rem;
          letter-spacing: 0.8px;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .clinic-footer-text {
          color: #23326e;
          font-size: 0.98rem;
          text-align: center;
          margin-bottom: 1.1rem;
          font-weight: 500;
        }
        .clinic-footer-social {
          display: flex;
          justify-content: center;
          gap: 18px;
          margin-bottom: 0.5rem;
        }
        .clinic-footer-icon {
          width: 26px;
          height: 26px;
          color: #573cd5;
          transition: color 0.16s;
        }
        .clinic-footer-icon:hover {
          color: #5a6dfd;
        }
        .clinic-footer-tagline {
          color: #5a6dfd;
          font-size: 0.97rem;
          margin-bottom: 0.6rem;
          text-align: center;
          font-weight: 600;
        }
        .clinic-footer-link {
          color: #573cd5;
          font-weight: 700;
          text-decoration: underline;
          transition: color 0.15s;
        }
        .clinic-footer-link:hover {
          color: #23326e;
        }
      `}</style>
      <footer className="clinic-footer-bg">
        <div className="clinic-footer-container">
          <div>
            <div className="clinic-footer-title">
              ReformMe Healthcare Clinic, Gurugram
            </div>
            <p className="clinic-footer-text">
              Dedicated to expert physiotherapy, nutrition, and complete rehabilitation care.<br />
              Your health, comfort, and recovery are our priorities.
            </p>
          </div>
          <div className="clinic-footer-social">
            <a
              href="mailto:contact@reformmehealthcare.com"
              rel="noreferrer"
              target="_blank"
              aria-label="Email ReformMe Healthcare"
            >
              <MdEmail className="clinic-footer-icon" />
            </a>
           
            <a
              href="https://www.linkedin.com/company/reformmehealthcare/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ReformMe Healthcare LinkedIn"
            >
              <FaLinkedin className="clinic-footer-icon" />
            </a>
          </div>
          <div className="clinic-footer-tagline">
            Open Mon-Sat, 9am–7pm | Sector 54, Gurugram &nbsp;|&nbsp; <span style={{ fontWeight: '400' }}>Call: +91-9876543210</span>
          </div>
          <p className="clinic-footer-text">
            Learn more about our approach and experts on our &nbsp;
            <a
              className="clinic-footer-link"
              href="https://www.reformmehealthcare.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              website
            </a>
            .
          </p>
          <p className="clinic-footer-text" style={{ fontSize: '0.93rem', color: '#8389d8', fontWeight: 500, marginTop: "0.5rem" }}>
            &copy; {new Date().getFullYear()} ReformMe Healthcare. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
