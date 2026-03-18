export function initNav() {
  const nav = document.getElementById('nav');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  // Smooth scroll
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Nav solid on scroll past hero
  const handleScroll = () => {
    const heroHeight = document.getElementById('hero')?.offsetHeight || window.innerHeight;
    nav.classList.toggle('nav--solid', window.scrollY > heroHeight * 0.3);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Scroll spy
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => { if (s.id !== 'hero') observer.observe(s); });
}
