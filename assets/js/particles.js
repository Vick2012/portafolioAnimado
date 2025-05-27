if (window.innerWidth > 900) {
  tsParticles.load("tsparticles", {
    fullScreen: { enable: false },
    background: { color: "transparent" },
    particles: {
      number: {
        value: 25,
        density: { enable: true, area: 800 }
      },
      color: { value: "#66ccff" },
      shape: { type: "circle" },
      opacity: {
        value: 0.3,
        random: true
      },
      size: {
        value: 2,
        random: true
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        outModes: { default: "bounce" }
      },
      links: {
        enable: false
      }
    },
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false }
      }
    },
    detectRetina: true
  });
}
