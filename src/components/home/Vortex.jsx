import { useEffect, useRef } from "react";

export default function Vortex() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    let width = 0;
    let height = 0;

    let raf = 0;

    const theme = {
      r: 99,
      g: 217,
      b: 255,
    };

    const particles = [];
    const lines = [];
    const comets = [];
    const wind = [];
    const rain = [];

    let rotation = 0;

    let scrollEnergy = 0;
    let targetEnergy = 0;

    let lastScroll =
      window.scrollY;

    const resize = () => {
      const dpr =
        Math.min(
          window.devicePixelRatio ||
            1,
          1.5
        );

      width =
        canvas.clientWidth;

      height =
        canvas.clientHeight;

      canvas.width =
        width * dpr;

      canvas.height =
        height * dpr;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    const createParticles = () => {
      particles.length = 0;

      const count =
        width < 700
          ? 650
          : 1500;

      for (
        let i = 0;
        i < count;
        i++
      ) {
        particles.push({
          t: Math.random(),

          angle:
            Math.random() *
            Math.PI *
            2,

          speed:
            0.0008 +
            Math.random() *
              0.0025,

          size:
            0.25 +
            Math.random() *
              1.2,

          alpha:
            0.12 +
            Math.random() *
              0.55,
        });
      }
    };

    const createLines = () => {
      lines.length = 0;

      const count =
        width < 700
          ? 12
          : 28;

      for (
        let i = 0;
        i < count;
        i++
      ) {
        lines.push({
          seed:
            Math.random() *
            Math.PI *
            2,

          alpha:
            0.035 +
            Math.random() *
              0.12,
        });
      }
    };

    const createComets = () => {
      comets.length = 0;

      for (
        let i = 0;
        i < 7;
        i++
      ) {
        comets.push({
          t: Math.random(),

          speed:
            0.001 +
            Math.random() *
              0.002,

          angle:
            Math.random() *
            Math.PI *
            2,
        });
      }
    };

    /*
     * Wind particles on both sides.
     */

    const createWind = () => {
      wind.length = 0;

      const count =
        width < 700
          ? 35
          : 80;

      for (
        let i = 0;
        i < count;
        i++
      ) {
        wind.push({
          side:
            Math.random() > 0.5
              ? 1
              : -1,

          x:
            Math.random(),

          y:
            Math.random(),

          length:
            25 +
            Math.random() *
              100,

          speed:
            0.4 +
            Math.random() *
              1.3,

          alpha:
            0.08 +
            Math.random() *
              0.25,
        });
      }
    };

    /*
     * Soft rain / mist particles.
     */

    const createRain = () => {
      rain.length = 0;

      const count =
        width < 700
          ? 50
          : 110;

      for (
        let i = 0;
        i < count;
        i++
      ) {
        rain.push({
          x:
            Math.random(),

          y:
            Math.random(),

          speed:
            0.4 +
            Math.random() *
              1.1,

          length:
            5 +
            Math.random() *
              15,

          alpha:
            0.035 +
            Math.random() *
              0.11,
        });
      }
    };

    const getPoint = (
      t,
      angle
    ) => {
      const centerX =
        width / 2;

      const centerY =
        height / 2;

      const radius =
        8 +
        Math.pow(
          Math.abs(
            t - 0.5
          ) * 2,
          0.84
        ) *
          Math.min(
            width * 0.21,
            270
          );

      const y =
        centerY +
        (t - 0.5) *
          height *
          1.28;

      const finalAngle =
        angle +
        t *
          Math.PI *
          14 +
        rotation;

      return {
        x:
          centerX +
          Math.cos(
            finalAngle
          ) *
            radius,

        y,

        depth:
          Math.sin(
            finalAngle
          ),
      };
    };

    /*
     * Atmospheric side glow.
     */

    const drawAtmosphere = () => {
      const center =
        width / 2;

      const gradient =
        ctx.createRadialGradient(
          center,
          height * 0.48,
          0,
          center,
          height * 0.48,
          width * 0.7
        );

      gradient.addColorStop(
        0,
        `rgba(
          ${theme.r},
          ${theme.g},
          ${theme.b},
          0.055
        )`
      );

      gradient.addColorStop(
        0.45,
        `rgba(
          ${theme.r},
          ${theme.g},
          ${theme.b},
          0.025
        )`
      );

      gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle =
        gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /*
       * Left / right haze.
       */

      const left =
        ctx.createLinearGradient(
          0,
          0,
          width * 0.35,
          0
        );

      left.addColorStop(
        0,
        `rgba(
          ${theme.r},
          ${theme.g},
          ${theme.b},
          0.055
        )`
      );

      left.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle =
        left;

      ctx.fillRect(
        0,
        0,
        width * 0.4,
        height
      );

      const right =
        ctx.createLinearGradient(
          width,
          0,
          width * 0.65,
          0
        );

      right.addColorStop(
        0,
        `rgba(
          ${theme.r},
          ${theme.g},
          ${theme.b},
          0.055
        )`
      );

      right.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle =
        right;

      ctx.fillRect(
        width * 0.6,
        0,
        width * 0.4,
        height
      );
    };

    /*
     * Wind streaks.
     */

    const drawWind = () => {
      wind.forEach(
        (item) => {
          item.x +=
            item.speed *
            0.0015 *
            (1 +
              scrollEnergy *
                3);

          if (
            item.x > 1.15
          ) {
            item.x = -0.15;
          }

          const baseX =
            item.side === 1
              ? width *
                (0.58 +
                  item.x *
                    0.42)
              : width *
                (0.42 -
                  item.x *
                    0.42);

          const y =
            item.y *
            height;

          const curve =
            Math.sin(
              y * 0.012 +
                rotation *
                  3
            ) *
            18;

          const startX =
            baseX;

          const endX =
            item.side === 1
              ? startX -
                item.length
              : startX +
                item.length;

          ctx.beginPath();

          ctx.moveTo(
            startX,
            y
          );

          ctx.quadraticCurveTo(
            (startX +
              endX) /
              2,
            y + curve,
            endX,
            y
          );

          ctx.strokeStyle = `
            rgba(
              ${theme.r},
              ${theme.g},
              ${theme.b},
              ${item.alpha *
                (0.5 +
                  scrollEnergy)}
            )
          `;

          ctx.lineWidth =
            0.5 +
            scrollEnergy;

          ctx.stroke();
        }
      );
    };

    /*
     * Rain / mist.
     */

    const drawRain = () => {
      rain.forEach(
        (drop) => {
          drop.y +=
            drop.speed *
            0.002 *
            (1 +
              scrollEnergy *
                2);

          if (
            drop.y > 1.05
          ) {
            drop.y = -0.05;

            drop.x =
              Math.random();
          }

          /*
           * Keep rain mostly
           * around the edges.
           */

          const edgeX =
            drop.x < 0.5
              ? drop.x * 0.65
              : 0.5 +
                (drop.x -
                  0.5) *
                  0.65;

          const x =
            edgeX * width;

          const y =
            drop.y * height;

          ctx.beginPath();

          ctx.moveTo(
            x,
            y
          );

          ctx.lineTo(
            x - 2,
            y +
              drop.length
          );

          ctx.strokeStyle = `
            rgba(
              190,
              225,
              240,
              ${drop.alpha}
            )
          `;

          ctx.lineWidth = 0.45;

          ctx.stroke();
        }
      );
    };

    const drawLines = () => {
      lines.forEach(
        (line) => {
          ctx.beginPath();

          for (
            let i = 0;
            i <= 75;
            i++
          ) {
            const t =
              i / 75;

            const point =
              getPoint(
                t,
                line.seed
              );

            if (i === 0) {
              ctx.moveTo(
                point.x,
                point.y
              );
            } else {
              ctx.lineTo(
                point.x,
                point.y
              );
            }
          }

          ctx.strokeStyle = `
            rgba(
              ${theme.r},
              ${theme.g},
              ${theme.b},
              ${line.alpha}
            )
          `;

          ctx.lineWidth =
            0.45;

          ctx.stroke();
        }
      );
    };

    const drawParticles = () => {
      particles.forEach(
        (particle) => {
          particle.angle +=
            particle.speed *
            (1 +
              scrollEnergy *
                4);

          const point =
            getPoint(
              particle.t,
              particle.angle
            );

          const depth =
            (point.depth + 1) /
            2;

          ctx.beginPath();

          ctx.arc(
            point.x,
            point.y,
            particle.size *
              (0.45 +
                depth),
            0,
            Math.PI * 2
          );

          ctx.fillStyle = `
            rgba(
              ${theme.r},
              ${theme.g},
              ${theme.b},
              ${particle.alpha *
                (0.3 +
                  depth *
                    0.7)}
            )
          `;

          ctx.fill();
        }
      );
    };

    const drawComets = () => {
      comets.forEach(
        (comet) => {
          comet.t +=
            comet.speed *
            (1 +
              scrollEnergy *
                5);

          if (
            comet.t > 1
          ) {
            comet.t = 0;
          }

          const head =
            getPoint(
              comet.t,
              comet.angle
            );

          const tail =
            getPoint(
              Math.max(
                0,
                comet.t - 0.035
              ),
              comet.angle
            );

          const gradient =
            ctx.createLinearGradient(
              tail.x,
              tail.y,
              head.x,
              head.y
            );

          gradient.addColorStop(
            0,
            "rgba(255,255,255,0)"
          );

          gradient.addColorStop(
            1,
            `rgba(
              ${theme.r},
              ${theme.g},
              ${theme.b},
              0.8
            )`
          );

          ctx.beginPath();

          ctx.moveTo(
            tail.x,
            tail.y
          );

          ctx.lineTo(
            head.x,
            head.y
          );

          ctx.strokeStyle =
            gradient;

          ctx.lineWidth = 1;

          ctx.stroke();

          ctx.beginPath();

          ctx.arc(
            head.x,
            head.y,
            1.4 +
              scrollEnergy *
                3,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            "#fff";

          ctx.shadowBlur = 15;

          ctx.shadowColor = `
            rgba(
              ${theme.r},
              ${theme.g},
              ${theme.b},
              0.9
            )
          `;

          ctx.fill();

          ctx.shadowBlur = 0;
        }
      );
    };

    const animate = () => {
      scrollEnergy +=
        (targetEnergy -
          scrollEnergy) *
        0.08;

      targetEnergy *=
        0.91;

      rotation +=
        0.0008 +
        scrollEnergy *
          0.06;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      drawAtmosphere();

      drawRain();

      drawWind();

      drawLines();

      drawParticles();

      drawComets();

      raf =
        requestAnimationFrame(
          animate
        );
    };

    const onScroll = () => {
      const current =
        window.scrollY;

      const velocity =
        Math.abs(
          current -
            lastScroll
        );

      targetEnergy =
        Math.min(
          velocity / 35,
          1
        );

      lastScroll =
        current;
    };

    const onTheme = (
      event
    ) => {
      if (
        !event.detail?.rgb
      ) {
        return;
      }

      const values =
        event.detail.rgb
          .split(",")
          .map((value) =>
            Number(
              value.trim()
            )
          );

      if (
        values.length === 3
      ) {
        theme.r =
          values[0];

        theme.g =
          values[1];

        theme.b =
          values[2];
      }
    };

    resize();

    createParticles();
    createLines();
    createComets();
    createWind();
    createRain();

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "resize",
      createParticles
    );

    window.addEventListener(
      "resize",
      createLines
    );

    window.addEventListener(
      "resize",
      createComets
    );

    window.addEventListener(
      "resize",
      createWind
    );

    window.addEventListener(
      "resize",
      createRain
    );

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "vortex-theme",
      onTheme
    );

    raf =
      requestAnimationFrame(
        animate
      );

    return () => {
      cancelAnimationFrame(
        raf
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "resize",
        createParticles
      );

      window.removeEventListener(
        "resize",
        createLines
      );

      window.removeEventListener(
        "resize",
        createComets
      );

      window.removeEventListener(
        "resize",
        createWind
      );

      window.removeEventListener(
        "resize",
        createRain
      );

      window.removeEventListener(
        "scroll",
        onScroll
      );

      window.removeEventListener(
        "vortex-theme",
        onTheme
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="tornado-canvas"
    />
  );
}
