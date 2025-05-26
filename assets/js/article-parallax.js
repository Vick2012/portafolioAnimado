document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.article-header');
  const img = header ? header.querySelector('img') : null;
  if (!header || !img) return;
  header.classList.add('parallax-active');
  window.addEventListener('scroll', function() {
    const rect = header.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = rect.top + scrollTop;
    const windowHeight = window.innerHeight;
    const parallaxSpeed = 0.35;
    if (scrollTop + windowHeight > offset && scrollTop < offset + header.offsetHeight) {
      const yPos = ((scrollTop - offset) * parallaxSpeed);
      img.style.transform = `translateY(${yPos}px) scale(1.08)`;
    } else {
      img.style.transform = 'translateY(0) scale(1.08)';
    }
  });
}); 