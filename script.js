/* =============================================
   Arindam Pal Portfolio — script.js
   ============================================= */

// ─── CUSTOM CURSOR ───
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX - 6 + 'px';
  cursor.style.top  = mouseY - 6 + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX - 19) * 0.12;
  ringY += (mouseY - ringY - 19) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform    = 'scale(2.5)';
    cursorRing.style.transform = 'scale(0.6)';
    cursorRing.style.opacity   = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform    = 'scale(1)';
    cursorRing.style.transform = 'scale(1)';
    cursorRing.style.opacity   = '0.6';
  });
});

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── NAV ACTIVE STATE ───
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── CONTACT FORM (Web3Forms) ───
// Web3Forms is a free service — messages go directly to your email.
// Steps:
//   1. Go to https://web3forms.com
//   2. Enter your email: palarindam422@gmail.com
//   3. Copy the Access Key they give you
//   4. Replace YOUR_WEB3FORMS_ACCESS_KEY below with that key

const FORM_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'; // ← replace this

async function sendMessage() {
  const btn      = document.getElementById('submitBtn');
  const status   = document.getElementById('form-status');
  const name     = document.getElementById('fname').value.trim();
  const email    = document.getElementById('femail').value.trim();
  const subject  = document.getElementById('fsubject').value.trim();
  const message  = document.getElementById('fmessage').value.trim();

  // Basic validation
  if (!name || !email || !message) {
    status.textContent = '⚠️ Please fill in Name, Email, and Message.';
    status.className   = 'form-note form-status-error';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    status.textContent = '⚠️ Please enter a valid email address.';
    status.className   = 'form-note form-status-error';
    return;
  }

  // Show loading
  btn.disabled   = true;
  btn.innerHTML  = '<span class="spinner"></span> Sending…';
  status.textContent = '';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body   : JSON.stringify({
        access_key   : FORM_ACCESS_KEY,
        name,
        email,
        subject      : subject || 'Portfolio Contact from ' + name,
        message,
        // Extra meta sent to your inbox
        from_name    : 'Arindam Pal Portfolio',
        replyto      : email
      })
    });

    const data = await res.json();

    if (data.success) {
      status.textContent = '✅ Message sent! I\'ll get back to you soon.';
      status.className   = 'form-note form-status-success';
      // Clear form
      ['fname','femail','fsubject','fmessage'].forEach(id => {
        document.getElementById(id).value = '';
      });
    } else {
      // If access key not set, fall back to mailto
      if (FORM_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        fallbackMailto(name, email, subject, message);
        return;
      }
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    console.error(err);
    // Fallback to mailto if API fails
    fallbackMailto(name, email, subject, message);
  } finally {
    btn.disabled  = false;
    btn.innerHTML = 'Send Message →';
  }
}

function fallbackMailto(name, email, subject, message) {
  const status  = document.getElementById('form-status');
  const mailto  = `mailto:palarindam422@gmail.com`
    + `?subject=${encodeURIComponent(subject || 'Portfolio Contact from ' + name)}`
    + `&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
  window.location.href = mailto;
  status.textContent = '📧 Opening your email client…';
  status.className   = 'form-note';
}
