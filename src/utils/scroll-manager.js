import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Timeline items: staggered reveal
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Education cards
  gsap.utils.toArray('.education-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Project cards
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // About paragraphs
  gsap.utils.toArray('.about-content p').forEach((p, i) => {
    gsap.fromTo(p,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: i * 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: p,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Section labels
  gsap.utils.toArray('.section-label').forEach(label => {
    gsap.fromTo(label,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: label,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}
