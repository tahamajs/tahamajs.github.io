document.addEventListener('DOMContentLoaded', () => {

  // Dynamic Typewriter Effect
  const words = [
    "Scalable AI Systems.",
    "Flow Matching Models.",
    "Distributed Engines.",
    "Trustworthy LLMs.",
    "Open Source Tools."
  ];
  let i = 0;
  let timer;
  
  function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
      if (word.length > 0) {
        const el = document.querySelector('.type-text');
        if (el) el.innerHTML += word.shift();
      } else {
        setTimeout(deletingEffect, 2000);
        return false;
      };
      timer = setTimeout(loopTyping, 90);
    };
    loopTyping();
  }

  function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
      if (word.length > 0) {
        word.pop();
        const el = document.querySelector('.type-text');
        if (el) el.innerHTML = word.join("");
      } else {
        if (words.length > (i + 1)) {
          i++;
        } else {
          i = 0;
        };
        setTimeout(typingEffect, 400);
        return false;
      };
      timer = setTimeout(loopDeleting, 40);
    };
    loopDeleting();
  }
  
  typingEffect();

  // Scroll Reveal Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
  });
});
