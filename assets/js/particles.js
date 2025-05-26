tsParticles.load("tsparticles", {
  fullScreen: { enable: false },
  background: { color: "transparent" },
  particles: {
    number: {
      value: 90,
      density: { enable: true, area: 800 }
    },
    color: { value: "#66ccff" },
    shape: { type: "circle" },
    opacity: {
      value: 0.4,
      random: true
    },
    size: {
      value: 3,
      random: true
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      outModes: { default: "bounce" }
    },
    links: {
      enable: true,
      distance: 120,
      color: "#66ccff",
      opacity: 0.3,
      width: 1
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100 },
      push: { quantity: 4 }
    }
  },
  detectRetina: true
});
