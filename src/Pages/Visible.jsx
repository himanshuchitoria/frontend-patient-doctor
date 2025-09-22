import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSignInAlt,
  faArrowRight,
  faChevronDown,
  faUserMd,
  faClinicMedical,
  faBookMedical,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./visible.css";

// 3 curated top physiotherapy blogs (external, with links)
const featuredBlogs = [
  {
    title: "Why Physiotherapy Is More Than Pain Relief",
    url: "https://www.moveforwardpt.com",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    body:
      "Physiotherapy transcends short-term pain intervention. It is a multi-disciplinary, proactive, and educational approach to restoring movement, function, and wellbeing for all ages.",
    source: "Move Forward PT",
    time: "Today",
  },
  {
    title: "Best Desk Stretches According to Physical Therapists",
    url: "https://www.choosept.com/guide/physical-therapy-guide",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    body:
      "Sitting for long hours? These stretches, recommended by physiotherapy experts, help boost blood flow, improve posture and can be done anywhere to reduce chronic aches.",
    source: "Choose PT",
    time: "Mon",
  },
  {
    title: "The Science Behind Sports Recovery",
    url: "https://www.physio-pedia.com/Sports_Physiotherapy",
    image:
      "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=600&q=80",
    body:
      "Physiotherapists are crucial in every athlete’s recovery—by customizing programs that blend manual therapy, modalities, and training techniques, they minimize downtime and maximize performance.",
    source: "Physio-Pedia",
    time: "Fri",
  },
];

const sections = [
  { label: "BLOGS", refName: "blogsRef" },
  { label: "ABOUT", refName: "reformmeRef" },
  { label: "DR. MONIKA SHARMA", refName: "monikaRef" },
];

const Visible = () => {
  // Refs
  const blogsRef = useRef(null);
  const reformmeRef = useRef(null);
  const monikaRef = useRef(null);
  const sectionRefs = { blogsRef, reformmeRef, monikaRef };

  // All fetched doctor blogs
  const [doctorBlogs, setDoctorBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch all blogs posted by doctors
  useEffect(() => {
    axios
      .get("https://backend-dashboard-v3o0.onrender.com/doctor/blogs/public")
      .then((res) => setDoctorBlogs(res.data.blogs || []))
      .catch(() => setDoctorBlogs([]));
  }, []);

  // Helper for "Today", otherwise formatted date
  const formatTime = (dateStr) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const blogDateStr = new Date(dateStr).toISOString().split("T")[0];
    if (blogDateStr === todayStr) return "Today";
    const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Scroll and tab
  const handleTab = (ref, idx) => {
    setActiveTab(idx);
    if (sectionRefs[ref]) sectionRefs[ref].current.scrollIntoView({ behavior: "smooth" });
  };

  // Footer login
  const handleLogin = () => (window.location.href = "/login");

  return (
    <div className="physionews-root">
      {/* Header Brand */}
      <div className="psn-brand-header">
        <span className="psn-logo">
          <FontAwesomeIcon icon={faBookMedical} className="psn-logo-ico" />
          REFORMME  HEALTHCARE
        </span>
        <span className="psn-menu">
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </div>

      {/* Section Navigation Tabs */}
      <nav className="psn-tabs">
        {sections.map((s, i) => (
          <span
            key={s.label}
            className={`psn-tab${activeTab === i ? " active" : ""}`}
            onClick={() => handleTab(s.refName, i)}
          >
            {s.label}
          </span>
        ))}
      </nav>

      {/* Blogs Section: Top 3 best */}
      <section ref={blogsRef} className="psn-section psn-blogs-section">
        <h2>Book your appointment now ! Click on Login</h2>
        <div className="psn-headline">HEADLINE</div>
        
        {/* Main hero blog */}
        <div className="psn-blog-main">
          <a href={featuredBlogs[0].url} className="psn-blog-link" target="_blank" rel="noopener noreferrer">
            <h2>—{featuredBlogs[0].title}</h2>
            <div className="psn-img-main-wrap">
              <img src={featuredBlogs[0].image} alt={featuredBlogs[0].title} />
            </div>
            <div className="psn-blog-desc">{featuredBlogs[0].body}</div>
            <div className="psn-blog-meta">
              <span>{featuredBlogs[0].source}</span>
              <span>
                <FontAwesomeIcon icon={faClock} /> {featuredBlogs[0].time}
              </span>
            </div>
          </a>
        </div>
        {/* Two more blogs */}
        <div className="psn-blogs-list">
          {featuredBlogs.slice(1).map((b, idx) => (
            <a
              href={b.url}
              key={idx}
              className="psn-blog-sidecard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={b.image} alt={b.title} />
              <div>
                <span className="psn-card-label">FEATURED</span>
                <span className="psn-card-title">
                  {b.title.length > 32 ? b.title.slice(0, 32) + "…" : b.title}
                </span>
                <div className="psn-card-meta">
                  <span>{b.source}</span>
                  <span>
                    <FontAwesomeIcon icon={faClock} /> {b.time}
                  </span>
                </div>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="psn-cta-arrow" />
            </a>
          ))}
        </div>
        <hr className="psn-blogs-break" />
        {/* All blogs posted by doctors */}
        <div className="psn-docblogs-cap">BLOGS BY OUR DOCTORS</div>
        <div className="psn-docblogs-list">
          {doctorBlogs.length === 0 ? (
            <div className="psn-empty-blk">
              No blogs posted by doctors yet. Please check back soon!
            </div>
          ) : (
            doctorBlogs
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((b, idx) => (
                <div className="psn-docblog-card" key={b._id || idx}>
                  <div className="psn-docblog-content">
                    <div className="psn-docblog-heading">
                      <b>—{
                         b.headTitle}</b>
                    </div>
                    {b.image && (
                      <div className="psn-docblog-imgwrap">
                        <img src={b.image} alt={b.headTitle} className="psn-docblog-img" />
                      </div>
                    )}
                    <div className="psn-docblog-body">{b.body }</div>
                  </div>
                  <div className="psn-docblog-meta">
                    <span className="psn-docblog-author">
                      {b.author || "Doctor"}
                    </span>
                    <span className="psn-docblog-created">
                      <FontAwesomeIcon icon={faClock} /> {formatTime(b.createdAt)}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>

      {/* ReformMe Healthcare Section */}
      <section ref={reformmeRef} className="psn-section psn-reformme-section">
        <div className="psn-section-title">
          <FontAwesomeIcon icon={faClinicMedical} /> ReformMe Health Care, Gurugram
        </div>
        <div className="psn-reformme-img">
          <img
            src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=750&q=80"
            alt="ReformMe Health Care Clinic"
          />
        </div>
        <div className="psn-reformme-details">
          <h3>About Us</h3>
          <p>
            ReformMe Health Care in Gurugram provides gold-standard physiotherapy, advanced rehab, and preventive care for all age groups. Our clinicians tailor recovery plans using evidence-backed techniques and empower patients through education, movement screening, and lifelong management tools.
          </p>
          <ul>
            <li>Modern facility with private treatment suites and a dedicated rehab gym</li>
            <li>Specialists in orthopedics, neurology, pediatric physiotherapy, and sports injury management</li>
            <li>Active focus on <b>community wellness</b> through regular workshops and support groups</li>
            <li>
              <b>Mission:</b> Enabling freedom of movement and pain-free living for every patient, every day
            </li>
          </ul>
          <p>
            Located in the heart of Gurugram, we are easily accessible and happy to help all from office workers to athletes, seniors, and children.
          </p>
        </div>
      </section>

      {/* Dr Monika Sharma Section */}
      <section ref={monikaRef} className="psn-section psn-monika-section">
        <div className="psn-section-title">
          <FontAwesomeIcon icon={faUserMd} /> Dr. Monika Sharma
        </div>
        <div className="psn-monika-img">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80"
            alt="Dr. Monika Sharma"
          />
        </div>
        <div className="psn-monika-details">
          <h3>Profile</h3>
          <p>
            <b>Dr. Monika Sharma</b> is an award-winning physiotherapist, founder of ReformMe Health Care, and a role model for ethical, science-based, and compassionate rehab in Gurugram.
          </p>
          <ul>
            <li>
              Doctor of Physiotherapy (DPT), Gold Medalist. 12+ years of experience in major hospitals and clinics.
            </li>
            <li>
              Renowned for her gentle, effective approach to treating complex pain, pediatric and neurological conditions, and sports injuries.
            </li>
          </ul>
          <p>
            A strong believer in holistic care, Dr. Sharma works closely with patients to design personalized treatment programs. She regularly organizes educational sessions, leads physiotherapy research, and supports the professional development of young therapists.
          </p>
          <div className="psn-highlight">
            <b>Philosophy:</b> Restore, Rebuild, and Empower people for a pain-free future.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="psn-footer">
        <button className="psn-footer-btn psn-footer-btn-active">
          <FontAwesomeIcon icon={faHome} />
          <span>Home</span>
        </button>
        <button className="psn-footer-btn" onClick={handleLogin}>
          <FontAwesomeIcon icon={faSignInAlt} />
          <span>Login</span>
        </button>
      </footer>
    </div>
  );
};

export default Visible;
