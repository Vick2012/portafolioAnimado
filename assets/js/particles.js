if (window.innerWidth > 900) {
  tsParticles.load("tsparticles", {
    fullScreen: { enable: false },
    background: { color: "#0a0a33" },
    particles: {
      number: {
        value: 80,
        density: { enable: true, area: 800 }
      },
      color: { 
        value: ["#66ccff", "#00ffd1", "#ffffff"],
        animation: {
          enable: true,
          speed: 20,
          sync: false
        }
      },
      shape: { 
        type: ["circle", "triangle"],
        stroke: { width: 0, color: "#000000" }
      },
      opacity: {
        value: 0.4,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.1,
          sync: false
        }
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "bounce" },
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      },
      links: {
        enable: true,
        distance: 150,
        color: "#66ccff",
        opacity: 0.2,
        width: 1,
        triangles: {
          enable: true,
          opacity: 0.1
        }
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: ["grab", "bubble"]
        },
        onClick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 0.5
          }
        },
        bubble: {
          distance: 200,
          size: 6,
          duration: 2,
          opacity: 0.8,
          speed: 3
        },
        push: {
          quantity: 4
        }
      }
    },
    detectRetina: true
  });

  // Enhanced parallax effect
  const container = document.getElementById("tsparticles");
  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  // Smooth mouse movement with easing
  document.addEventListener("mousemove", (e) => {
    targetX = (e.clientX - window.innerWidth / 2) * 0.02;
    targetY = (e.clientY - window.innerHeight / 2) * 0.02;
  });

  // Smooth scroll effect
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY * 0.002;
  });

  // Apply smooth parallax effect
  function updateParallax() {
    if (container) {
      // Smooth easing for mouse movement
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      // Apply transform with perspective
      container.style.transform = `
        translate3d(${currentX}px, ${currentY + scrollY}px, 0)
        rotateX(${currentY * 0.05}deg)
        rotateY(${currentX * 0.05}deg)
      `;
    }
    requestAnimationFrame(updateParallax);
  }

  updateParallax();
}
