document.addEventListener('DOMContentLoaded', () => {

  // Dynamic Typewriter Effect
  const words = ["AI Algorithms.", "Distributed Systems.", "Machine Unlearning.", "The Future."];
  let i = 0;
  let timer;
  
  function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
      if (word.length > 0) {
        document.querySelector('.type-text').innerHTML += word.shift();
      } else {
        setTimeout(deletingEffect, 2000);
        return false;
      };
      timer = setTimeout(loopTyping, 100);
    };
    loopTyping();
  }

  function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
      if (word.length > 0) {
        word.pop();
        document.querySelector('.type-text').innerHTML = word.join("");
      } else {
        if (words.length > (i + 1)) {
          i++;
        } else {
          i = 0;
        };
        setTimeout(typingEffect, 500);
        return false;
      };
      timer = setTimeout(loopDeleting, 50);
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
