/* ============================================================
   THOUSEEF ROSHAN & ASNA PARVEEN — WEDDING INVITATION
   (customised from the original cinematic invitation; structure and flow unchanged)
   ============================================================ */

/* ---------- CONFIGURATION (edit here) ---------- */
const CONFIG = {
  // Countdown target: Thursday 19 November 2026, 4:00 PM India time (Asia/Kolkata, UTC+05:30)
  weddingDate: '2026-11-19T16:00:00+05:30',

  // "View Location" button — the venue's Google Maps share link supplied by the couple.
  // Set to '' to hide the button.
  ceremonyMapUrl: 'https://share.google/DwaP3vHkJVuy4XXOr'
};

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- OPEN INVITATION -> HERO TRANSITION ---------- */
  const openSection   = document.getElementById('open');
  const openBtn        = document.getElementById('openBtn');
  const openHint       = document.getElementById('openHint');
  const openingVideo   = document.getElementById('openingVideo');
  const heroSection    = document.getElementById('hero');
  const heroVideo      = document.getElementById('heroVideo');

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false;

  /* Preload strategy: the opening poster paints first; once the page has fully loaded we quietly
     buffer the opening film so it starts instantly (and never stalls) when the guest taps Open.
     The (small) hero loop is fetched when the film starts, but is NOT decoded until the film ends,
     so two videos never decode at the same time. */
  function bufferOpening(){
    try { openingVideo.preload = 'auto'; openingVideo.load(); } catch(e){}
  }
  if (document.readyState === 'complete') setTimeout(bufferOpening, 300);
  else window.addEventListener('load', () => setTimeout(bufferOpening, 300), { once:true });

  function fetchHero(){
    try { heroVideo.preload = 'auto'; heroVideo.load(); } catch(e){}
  }

  /* Hero handoff: the hero loop's first frame is identical to the film's last frame minus its baked-in
     lettering, so the hero poster sits underneath while the film dissolves away. The loop then fades in
     over the poster (same frame = no visible change) and the live HTML names rise into place. */
  function startHero(){
    heroSection.classList.add('hero-live');
    if (reduceMotion) return;                       // reduced motion: keep the still poster
    heroVideo.muted = true;
    heroVideo.setAttribute('muted','');
    const show = () => heroVideo.classList.add('live');
    const p = heroVideo.play();
    heroVideo.addEventListener('playing', show, { once:true });
    if (p !== undefined){
      p.catch(() => {
        // Autoplay blocked (e.g. low-power mode) — poster stays; retry on first scroll/touch.
        const retry = () => {
          heroVideo.play().then(show).catch(()=>{});
          window.removeEventListener('scroll', retry);
          window.removeEventListener('touchstart', retry);
        };
        window.addEventListener('scroll', retry, { once:true, passive:true });
        window.addEventListener('touchstart', retry, { once:true, passive:true });
      });
    }
  }

  function finishOpening(){
    startHero();
    openSection.classList.add('opened');
    setTimeout(() => {
      openSection.style.display = 'none';
      try { openingVideo.pause(); openingVideo.textContent = ''; openingVideo.removeAttribute('src'); openingVideo.load(); } catch(e){}  // release the decoder + buffer
      document.body.style.overflow = 'auto';
      document.getElementById('hero').scrollIntoView({ behavior: 'auto' });
    }, 1250);
  }

  function openInvitation(){
    if (opened) return;
    opened = true;

    // Fade the overlay text/button away first, letting the opening video take over the screen.
    openSection.classList.add('revealing');

    openingVideo.style.display = 'block';
    openingVideo.muted = true;
    try { openingVideo.currentTime = 0; } catch(e){}

    const playPromise = openingVideo.play();
    fetchHero();

    let settled = false;
    const proceed = () => {
      if (settled) return;
      settled = true;
      clearInterval(watchdog);
      finishOpening();
    };

    openingVideo.addEventListener('ended', proceed, { once: true });
    // <source> load failures fire 'error' on the <source>, which doesn't bubble — listen in the capture phase.
    openingVideo.addEventListener('error', () => setTimeout(proceed, 300), { once: true, capture: true });
    if (!openingVideo.canPlayType('video/mp4')) setTimeout(proceed, 300);   // no MP4 support at all

    // Safety net: only skip ahead if playback has genuinely stalled (never cut a slowly-buffering film short).
    let lastT = -1, stalledFor = 0;
    const watchdog = setInterval(() => {
      const t = openingVideo.currentTime;
      if (t === lastT && !openingVideo.paused) stalledFor += 0.5;
      else if (openingVideo.paused && t === 0) stalledFor += 0.5;
      else stalledFor = 0;
      lastT = t;
      if (stalledFor >= 12) proceed();
    }, 500);

    if (playPromise !== undefined){
      playPromise.catch(() => {
        // Could not play the opening clip (e.g. blocked) — proceed straight to the hero.
        setTimeout(proceed, 600);
      });
    }
  }

  // Lock scroll until opened (mobile-first single-gesture invitation)
  document.body.style.overflow = 'hidden';
  openBtn.addEventListener('click', openInvitation);
  openBtn.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') openInvitation(); });
  if (openHint) openHint.addEventListener('click', () => { openBtn.click(); });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- LIVE COUNTDOWN ---------- */
  const weddingDate = new Date(CONFIG.weddingDate).getTime();
  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');
  const pad = n => String(n).padStart(2, '0');

  function updateCountdown(){
    const now = Date.now();
    let diff = weddingDate - now;
    if (diff < 0) diff = 0;
    const days  = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins  = Math.floor((diff / (1000*60)) % 60);
    const secs  = Math.floor((diff / 1000) % 60);
    if (cdDays)  cdDays.textContent  = pad(days);
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins)  cdMins.textContent  = pad(mins);
    if (cdSecs)  cdSecs.textContent  = pad(secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- VENUE MAP LINK ---------- */
  const ceremonyLink = document.getElementById('ceremonyMapLink');
  if (ceremonyLink){
    if (CONFIG.ceremonyMapUrl){
      ceremonyLink.href = CONFIG.ceremonyMapUrl;
    } else {
      ceremonyLink.style.display = 'none'; // no map URL supplied
    }
  }

  /* ---------- BACKGROUND MUSIC ---------- */
  const bgMusic     = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicStarted = false;

  function setPlaying(on){
    musicToggle.classList.toggle('playing', on);
    musicToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function startMusic(){
    if (musicStarted) return;            // never restarts between sections
    musicStarted = true;
    bgMusic.volume = 0.55;
    bgMusic.play().then(() => setPlaying(true)).catch(() => { /* blocked — guest can start it via the toggle */ });
    musicToggle.classList.add('show');
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused){
      bgMusic.play().then(() => setPlaying(true)).catch(()=>{});
    } else {
      bgMusic.pause();
      setPlaying(false);
    }
  });

  // Start music the moment the guest opens the invitation (counts as a user gesture).
  openBtn.addEventListener('click', startMusic);
  if (openHint) openHint.addEventListener('click', startMusic);

});
