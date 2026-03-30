
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

// --- Scroll Animations ---
const sectionsToReveal = document.querySelectorAll('.section');
sectionsToReveal.forEach(sec => {
  sec.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.1 });
sectionsToReveal.forEach(sec => revealObserver.observe(sec));

// --- 3D Cards Setup (Vanilla Tilt) ---
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll(".card"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
  });
}

// --- 3D Hero Background (Three.js) ---
if (typeof THREE !== 'undefined') {
  const canvas = document.getElementById('bg-canvas');
  if(canvas) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0c, 0.005);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 40;
    camera.position.y = 10;

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0x6e77ff, wireframe: true, transparent: true, opacity: 0.3 });
    const material2 = new THREE.MeshBasicMaterial({ color: 0x9b5cff, wireframe: true, transparent: true, opacity: 0.2 });

    for(let i=0; i<80; i++) {
        const mesh = new THREE.Mesh(geometry, i % 2 === 0 ? material : material2);
        mesh.position.x = (Math.random() - 0.5) * 100;
        mesh.position.y = (Math.random() - 0.5) * 100;
        mesh.position.z = (Math.random() - 0.5) * 100;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        mesh.userData = {
           rx: (Math.random() - 0.5) * 0.015,
           ry: (Math.random() - 0.5) * 0.015,
        };
        group.add(mesh);
    }

    let mouseX = 0;
    let mouseY = 0;
    
    // Base position for scroll tracking
    let scrollY = window.scrollY;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;
    });
    
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);

        // Smooth camera movement based on mouse + scroll parallax
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        const targetY = (-mouseY + 10) - (scrollY * 0.01);
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        group.children.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rx;
            mesh.rotation.y += mesh.userData.ry;
        });

        group.rotation.y += 0.001;

        renderer.render(scene, camera);
    }
    animate();
  }
}
