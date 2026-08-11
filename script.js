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

  // Category Filtering & Real-Time Search Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const bentoItems = document.querySelectorAll('.bento-item');
  const searchInput = document.getElementById('repo-search');

  function filterProjects() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

    bentoItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const textContent = item.textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = (query === "" || textContent.includes(query));

      if (matchesCategory && matchesSearch) {
        item.classList.remove('hide');
      } else {
        item.classList.add('hide');
      }
    });
  }

  // Category Button Click
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  // Search Input Keyup
  if (searchInput) {
    searchInput.addEventListener('input', filterProjects);
  }

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
