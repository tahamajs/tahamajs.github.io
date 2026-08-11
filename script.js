document.addEventListener('DOMContentLoaded', () => {
  
  // Custom Cursor Trailer
  const cursor = document.querySelector('.cursor-trailer');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth animation loop
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover effects for links and buttons
    document.querySelectorAll('a, button, .social-icon, .card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '60px';
        cursor.style.height = '60px';
        cursor.style.background = 'rgba(56, 189, 248, 0.1)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.background = 'transparent';
      });
    });
  }

  // Typewriter Terminal Effect
  const texts = [
    "Machine Learning Engineer",
    "Distributed Systems Architect",
    "Open Source Contributor",
    "AI Alignment Researcher"
  ];
  let count = 0;
  let index = 0;
  let currentText = "";
  let letter = "";
  let isDeleting = false;
  
  const typeElement = document.getElementById('typewriter-text');
  
  (function type() {
    if (!typeElement) return;

    if (count === texts.length) {
      count = 0; // loop back
    }
    currentText = texts[count];

    if (isDeleting) {
      letter = currentText.slice(0, --index);
    } else {
      letter = currentText.slice(0, ++index);
    }

    typeElement.innerHTML = `> ${letter}<span class="cursor-blink">_</span>`;

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && letter.length === currentText.length) {
      typeSpeed = 2000; // Pause at the end
      isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
      isDeleting = false;
      count++;
      typeSpeed = 500; // Pause before next word
    }

    setTimeout(type, typeSpeed);
  })();

  // Scroll Reveal Logic
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // init

  // Smooth scrolling
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
  if (avatar && window.innerWidth > 768) {
    document.querySelector('.avatar-container').addEventListener('mousemove', (e) => {
      const rect = avatar.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 10;
      const y = (e.clientY - rect.top - rect.height / 2) / 10;
      avatar.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) scale(1.05)`;
    });
    
    document.querySelector('.avatar-container').addEventListener('mouseleave', () => {
      avatar.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });
  }
});
