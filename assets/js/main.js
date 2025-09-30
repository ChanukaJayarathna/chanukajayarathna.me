
// Mobile nav toggle
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('navMenu');
if (toggle && menu){
  toggle.addEventListener('click', ()=>{
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Active link highlighting
const links = document.querySelectorAll('.nav__link');
const sections = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = document.querySelector('.nav__link[href="' + id + '"]');
    if (link){
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    }
  });
}, {rootMargin: "-40% 0px -55% 0px", threshold: 0.01});
sections.forEach(sec => observer.observe(sec));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Tabs filter (Showcase)
const tabs = document.querySelectorAll('.tabs .tab');
const gridItems = document.querySelectorAll('#showcase .grid .grid__item');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    const filter = tab.dataset.filter;
    gridItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.style.display = match ? '' : 'none';
    });
  });
});

// Contact form mailto fallback
function submitMailto(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const body = encodeURIComponent(`Hi Chanuka,%0D%0A%0D%0A${message}%0D%0A%0D%0A— ${name} (${email})`);
  const mailto = `mailto:hello@chanukajayarathna.me?subject=Portfolio%20Contact%20from%20${encodeURIComponent(name)}&body=${body}`;
  window.location.href = mailto;
  const status = document.getElementById('formStatus');
  status.textContent = "Your email app should open now. If it didn't, you can email me at hello@chanukajayarathna.me";
  return false;
}
