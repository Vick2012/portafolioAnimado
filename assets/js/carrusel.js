document.addEventListener("DOMContentLoaded", () => {
  // Carousel logic
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");

  function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
  }

  function moveSlide(step) {
    currentSlide = (currentSlide + step + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  showSlide(currentSlide);

  const prevSlideBtn = document.getElementById("prevSlide");
  const nextSlideBtn = document.getElementById("nextSlide");

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener("click", () => moveSlide(-1));
  }
  if (nextSlideBtn) {
    nextSlideBtn.addEventListener("click", () => moveSlide(1));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") moveSlide(-1);
    if (e.key === "ArrowRight") moveSlide(1);
  });

  // Theme toggle logic
  const toggleBtn = document.getElementById("theme-toggle");
  const body = document.body;

  if (toggleBtn) {
    body.classList.add("dark-theme");
    toggleBtn.innerHTML = "Dark Mode";

    toggleBtn.addEventListener("click", () => {
      const isDark = body.classList.contains("dark-theme");
      body.classList.toggle("dark-theme", !isDark);
      body.classList.toggle("light-theme", isDark);
      toggleBtn.innerHTML = isDark ? "Light Mode" : "Dark Mode";
    });
  }
});