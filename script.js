document.addEventListener('DOMContentLoaded', () => {

  // 1. Dynamic Typewriter Effect
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

  // 2. Built-in Zero-Dependency 3D Card Tilt Effect (No External CDNs required!)
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 3. Category Filtering & Real-Time Search Logic
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
        item.style.display = 'block';
        item.classList.remove('hide');
      } else {
        item.style.display = 'none';
        item.classList.add('hide');
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('keyup', filterProjects);
    searchInput.addEventListener('input', filterProjects);
  }

  // 4. Scroll Reveal Observer
  const observerOptions = {
    threshold: 0.05,
    rootMargin: "0px 0px -20px 0px"
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
