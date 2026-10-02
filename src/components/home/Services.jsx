import { useState } from "react";
import "./Services.css";

const SERVICES = [
  {
    number: "01",
    title: "UI/UX DESIGN",
    kicker: "DIGITAL EXPERIENCES",
    description:
      "Creating intuitive, beautiful, and user-centered digital experiences that feel effortless to use.",
    tags: [
      "UX RESEARCH",
      "INTERFACE DESIGN",
      "DESIGN SYSTEMS",
      "PROTOTYPING",
    ],
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=2000&q=90",
  },
  {
    number: "02",
    title: "WEB DEVELOPMENT",
    kicker: "DIGITAL PRODUCTS",
    description:
      "Building modern, responsive, and performant web applications with thoughtful interactions.",
    tags: [
      "FRONTEND",
      "REACT",
      "RESPONSIVE WEB",
      "PERFORMANCE",
    ],
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=90",
  },
  {
    number: "03",
    title: "BRAND & AI",
    kicker: "IDENTITY + INTELLIGENCE",
    description:
      "Designing distinctive brands and AI-powered products that make complex ideas feel clear and credible.",
    tags: [
      "BRAND IDENTITY",
      "AI PRODUCTS",
      "VISUAL SYSTEMS",
      "CREATIVE AI",
    ],
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=2000&q=90",
  },
];

function ServiceVisual({ service, active }) {
  const handleMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -5;
    const rotateY = ((x / rect.width) - 0.5) * 5;

    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  };

  const handleLeave = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
  };

  return (
    <div
      className={`service-visual ${active ? "active" : ""}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="service-visual-depth" />

      <div className="service-image-card">
        <div className="service-image-glow" />

        <img
          src={service.image}
          alt={service.title}
        />

        <div className="service-image-shade" />

        <div className="service-image-meta">
          <span>{service.number}</span>
          <span>{service.kicker}</span>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section className="services-section" id="services">
      <div className="services-shell">

        <header className="services-heading">
          <div className="services-heading-top">
            <span>SELECTED SERVICES</span>
            <span className="heading-dot" />
            <span>DESIGN · BUILD · CREATE</span>
          </div>

          <h2>
            Services that turn
            <br />
            <em>ideas into experiences.</em>
          </h2>

          <p>
            Design, build and brand work for teams who want one person
            to take an idea all the way to launch.
          </p>
        </header>

        <div className="services-accordion">
          {SERVICES.map((service, index) => {
            const isActive = active === index;

            return (
              <article
                className={`service-row ${isActive ? "is-active" : ""}`}
                key={service.number}
              >
                <button
                  className="service-row-header"
                  onClick={() => setActive(isActive ? -1 : index)}
                  aria-expanded={isActive}
                >
                  <span className="service-row-number">
                    {service.number}
                  </span>

                  <span className="service-row-title">
                    {service.title}
                  </span>

                  <span className="service-row-action">
                    <span className="service-row-action-icon">
                      {isActive ? "−" : "+"}
                    </span>
                  </span>
                </button>

                <div className="service-expand">
                  <div className="service-expand-inner">

                    <div className="service-info">
                      <span className="service-kicker">
                        {service.kicker}
                      </span>

                      <p className="service-description">
                        {service.description}
                      </p>

                      <div className="service-tags">
                        {service.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>

                      <a
                        href="#contact"
                        className="service-cta"
                      >
                        <span>Let's Work Together</span>
                        <span className="service-cta-arrow">↗</span>
                      </a>
                    </div>

                    <ServiceVisual
                      service={service}
                      active={isActive}
                    />

                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="services-bottom">
          <span>03 SERVICES</span>
          <span>SCROLL TO EXPLORE</span>
        </div>

      </div>
    </section>
  );
}
