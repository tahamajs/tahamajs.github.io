document.addEventListener('DOMContentLoaded', () => {
  
  // Scroll Reveal Logic
  const reveals = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };

  // Initial check
  revealOnScroll();

  // Listen for scroll events
  window.addEventListener('scroll', revealOnScroll);

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Dynamic Avatar Hover Parallax
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.pageX) / 50;
      const y = (window.innerHeight / 2 - e.pageY) / 50;
      avatar.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
    
    document.addEventListener('mouseleave', () => {
      avatar.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }
});
