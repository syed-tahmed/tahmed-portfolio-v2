import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, workIntro } from "../../data/site.js";
import "./Work.css";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef(null);
  const ringRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const ring = ringRef.current;

    if (!section || !ring || !projects?.length) return;

    const total = projects.length;
    const step = 360 / total;

    const state = {
      current: 0,
      target: 0,
    };

    let raf;

    const updateCards = (rotation) => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const cardAngle = index * step;

        let difference =
          cardAngle - rotation;

        while (difference > 180) {
          difference -= 360;
        }

        while (difference < -180) {
          difference += 360;
        }

        const distance =
          Math.abs(difference);

        const normalized =
          Math.min(
            distance / step,
            3
          );

        const isFront =
          distance < step * 0.42;

        const opacity =
          Math.max(
            0.22,
            1 - normalized * 0.25
          );

        const blur =
          normalized * 1.2;

        card.style.opacity =
          opacity;

        card.style.filter =
          `blur(${blur}px)`;

        card.style.zIndex =
          String(
            100 -
              Math.round(distance)
          );

        card.style.pointerEvents =
          isFront
            ? "auto"
            : "none";

        card.classList.toggle(
          "is-front",
          isFront
        );
      });
    };

    const animate = () => {
      /*
       * Smooth interpolation.
       * No React state.
       * No GSAP tween per frame.
       */

      state.current +=
        (state.target - state.current) *
        0.085;

      ring.style.transform =
        `rotateY(${-state.current}deg)`;

      updateCards(
        state.current
      );

      raf =
        requestAnimationFrame(
          animate
        );
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,

        start: "top top",

        end: () =>
          `+=${Math.max(
            total * 700,
            4200
          )}`,

        pin: true,

        scrub: 0.8,

        anticipatePin: 1,

        invalidateOnRefresh: true,

        onUpdate: (self) => {
          state.target =
            self.progress *
            (total - 1) *
            step;
        },
      });
    }, section);

    updateCards(0);

    raf =
      requestAnimationFrame(
        animate
      );

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="work-section"
      id="work"
    >
      <div className="work-bg" />
      <div className="blue-glow" />
      <div className="red-glow" />
      <div className="grain" />

      <div className="work-heading">
        <span>
          {workIntro?.badge ||
            "SELECTED WORK"}
        </span>

        <h2>
          {workIntro?.label ||
            "MY WORK"}
        </h2>

        <p>
          {workIntro?.description ||
            "EXPLORE THE WORK"}
        </p>
      </div>

      <div className="carousel-stage">
        <div
          ref={ringRef}
          className="project-ring"
        >
          {projects.map(
            (project, index) => (
              <article
                key={`${project.title}-${index}`}
                ref={(element) => {
                  cardsRef.current[index] =
                    element;
                }}
                className="project-card"
                style={{
                  "--angle": `${
                    index *
                    (360 / projects.length)
                  }deg`,
                }}
              >
                <div className="card-inner">

                  <div className="project-image">
                    <img
                      src={project.image}
                      alt={
                        project.title
                      }
                      draggable="false"
                    />

                    <div className="image-shade" />

                    <div className="project-number">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>

                    <a
                      href={
                        project.caseStudyUrl ||
                        project.url ||
                        "#"
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="project-button"
                    >
                      <span>
                        VIEW CASE STUDY
                      </span>

                      <strong>
                        ↗
                      </strong>
                    </a>
                  </div>

                  <div className="project-caption">
                    <span>
                      DIGITAL PRODUCT
                    </span>

                    <h3>
                      {project.title}
                    </h3>
                  </div>

                </div>
              </article>
            )
          )}
        </div>

        <div className="focus-glow" />
      </div>

      <div className="work-bottom">
        <span>
          SCROLL TO EXPLORE
        </span>

        <div className="scroll-line" />
      </div>
    </section>
  );
}
