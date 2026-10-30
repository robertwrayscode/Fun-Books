/* Fun Books "Home of Tomorrow" extras, shared by every page:
   1. draws the Googie skyline on top of the footer
   2. sends a friendly flying saucer across the screen now and then (tap it!)
   Purely decorative: the site works the same without it. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- 1. the skyline ----------
  var SKYLINE =
    '<svg class="skyline" viewBox="0 0 1200 154" preserveAspectRatio="xMidYMax slice" aria-hidden="true" xmlns="' + NS + '">' +
    '<g fill="#F4B63C">' +
      '<path class="sky-star" d="M80 40l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>' +
      '<path class="sky-star" d="M520 22l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>' +
      '<path class="sky-star" d="M780 30l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/>' +
      '<path class="sky-star" d="M1130 26l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>' +
      '<path class="sky-star" d="M300 50l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#F2705C"/>' +
      '<path class="sky-star" d="M960 60l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#F2705C"/>' +
    '</g>' +
    // hovering saucer
    '<g class="sky-saucer"><ellipse cx="420" cy="52" rx="34" ry="9" fill="#5CC8C0" stroke="#123D47" stroke-width="3"/>' +
      '<path d="M402 48a18 14 0 0 1 36 0z" fill="#BFE8E2" stroke="#123D47" stroke-width="3"/>' +
      '<circle cx="404" cy="54" r="2.5" fill="#F4B63C"/><circle cx="420" cy="56" r="2.5" fill="#F4B63C"/><circle cx="436" cy="54" r="2.5" fill="#F4B63C"/></g>' +
    '<g fill="#123D47">' +
      // ground
      
      // space-needle tower
      '<path d="M146 152l8-96h6l8 96z"/><ellipse cx="157" cy="58" rx="40" ry="9"/><path d="M137 52a20 12 0 0 1 40 0z"/><rect x="155" y="14" width="4" height="34"/>' +
      // boomerang-roof diner
      '<path d="M232 152v-34h150v34z"/><path d="M222 120l70-28 22 18 80-26-8 14-72 24-22-16-62 24z"/>' +
      '<rect x="356" y="58" width="6" height="60"/><path d="M340 40h44l-10 22h-44z" fill="#C8323A"/>' +
      // chemosphere saucer house on a pole
      '<rect x="530" y="96" width="14" height="56"/><path d="M490 96l20-22h54l20 22-20 10h-54z"/>' +
      // googie arrow sign
      '<rect x="664" y="60" width="6" height="92"/><path d="M640 66h70l18 14-18 14h-70z" fill="#F2705C"/>' +
      '<path d="M667 30l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="#F4B63C"/>' +
      // rocket on its pad
      '<path d="M820 152l6-20h40l6 20z"/><path d="M846 40c14 14 18 40 14 82h-28c-4-42 0-68 14-82z"/><path d="M832 104l-14 22v10l16-10zM860 104l14 22v10l-16-10z"/>' +
      // atom sign
      '<rect x="975" y="92" width="6" height="60"/>' +
    '</g>' +
    '<g class="sky-orbit" fill="none" stroke="#123D47" stroke-width="3"><ellipse cx="978" cy="70" rx="30" ry="10"/><ellipse cx="978" cy="70" rx="30" ry="10" transform="rotate(60 978 70)"/><ellipse cx="978" cy="70" rx="30" ry="10" transform="rotate(120 978 70)"/></g>' +
    '<circle cx="978" cy="70" r="6" fill="#F2705C"/>' +
    // butterfly-roof ranch house
    '<g fill="#123D47"><path d="M1040 152v-36h130v36z"/><path d="M1030 108l75 14 75-26v8l-75 26-75-14z"/></g>' +
    // lit windows
    '<g fill="#F4B63C"><rect x="248" y="126" width="20" height="12" rx="2"/><rect x="278" y="126" width="20" height="12" rx="2"/><rect x="308" y="126" width="20" height="12" rx="2"/>' +
      '<rect x="512" y="84" width="10" height="8" rx="2"/><rect x="530" y="84" width="14" height="8" rx="2"/><rect x="552" y="84" width="10" height="8" rx="2"/>' +
      '<circle cx="846" cy="76" r="5"/><rect x="1060" y="128" width="26" height="14" rx="2"/><rect x="1120" y="128" width="26" height="14" rx="2"/></g>' +
    '</svg>';
  var foot = document.querySelector('footer');
  if (foot && !foot.querySelector('.skyline')) foot.insertAdjacentHTML('afterbegin', SKYLINE);

  // ---------- 2. the flying saucer ----------
  if (reduced) return;
  var LINES = [
    'Greetings, Earth family! Take me to your librarian.',
    'We come in peace. Also, we heard there was pie.',
    'Mother ship says: read one skill a day!',
    'Ten out of ten Martians recommend these books.',
    'Just passing through. Lovely lawn, by the way!',
    'Beep boop. That means "wholesome" where I come from.'
  ];
  var SAUCER = '<svg viewBox="0 0 120 60" xmlns="' + NS + '"><ellipse cx="60" cy="40" rx="56" ry="14" fill="#5CC8C0" stroke="#123D47" stroke-width="4"/>' +
    '<path d="M32 34a28 24 0 0 1 56 0z" fill="#BFE8E2" stroke="#123D47" stroke-width="4"/>' +
    '<circle cx="60" cy="22" r="6" fill="#7BC96F" stroke="#123D47" stroke-width="2.5"/><circle cx="58" cy="21" r="1.4" fill="#123D47"/><circle cx="63" cy="21" r="1.4" fill="#123D47"/>' +
    '<circle cx="24" cy="42" r="4" fill="#F4B63C"/><circle cx="46" cy="46" r="4" fill="#F2705C"/><circle cx="74" cy="46" r="4" fill="#F4B63C"/><circle cx="96" cy="42" r="4" fill="#F2705C"/></svg>';
  var ship = null, bubble = null, raf = 0;

  function fly() {
    if (document.hidden || ship) return;
    ship = document.createElement('button');
    ship.type = 'button';
    ship.className = 'saucer';
    ship.setAttribute('aria-label', 'A friendly flying saucer');
    ship.innerHTML = SAUCER;
    document.body.appendChild(ship);
    var W = window.innerWidth, H = window.innerHeight;
    var dir = Math.random() < 0.5 ? 1 : -1;
    var sw = ship.offsetWidth || 120;
    var x0 = dir > 0 ? -sw - 10 : W + 10, x1 = dir > 0 ? W + 10 : -sw - 10;
    var y = H * (0.14 + Math.random() * 0.3);
    var dur = 9000 + Math.random() * 3000, t0 = performance.now(), hovered = false;
    function step(now) {
      if (!ship) return;
      var t = Math.min(1, (now - t0) / dur);
      var x = x0 + (x1 - x0) * t;
      var yy = y + Math.sin(t * Math.PI * 4) * 18;
      ship.style.transform = 'translate(' + x + 'px,' + yy + 'px) rotate(' + (Math.sin(t * Math.PI * 8) * 6) + 'deg)';
      if (t < 1) raf = requestAnimationFrame(step); else land();
    }
    ship.addEventListener('click', function () {
      if (hovered) return;
      hovered = true;
      var r = ship.getBoundingClientRect();
      bubble = document.createElement('div');
      bubble.className = 'saucer-say';
      bubble.setAttribute('role', 'status');
      bubble.innerHTML = '<b>Visitor from Mars</b>' + LINES[Math.floor(Math.random() * LINES.length)];
      document.body.appendChild(bubble);
      var bx = Math.max(8, Math.min(window.innerWidth - bubble.offsetWidth - 8, r.left));
      bubble.style.left = bx + 'px';
      bubble.style.top = (r.bottom + 8) + 'px';
      // pause, then zip away upward
      cancelAnimationFrame(raf);
      setTimeout(function () {
        if (!ship) return;
        ship.style.transition = 'transform .9s cubic-bezier(.6,0,.9,.4)';
        ship.style.transform = 'translate(' + (r.left + dir * 300) + 'px,' + (-200) + 'px) rotate(' + (dir * 20) + 'deg)';
        setTimeout(land, 950);
      }, 2600);
    });
    raf = requestAnimationFrame(step);
  }
  function land() {
    if (ship) { ship.remove(); ship = null; }
    if (bubble) { var b = bubble; bubble = null; setTimeout(function () { b.remove(); }, 1600); }
    setTimeout(fly, 35000 + Math.random() * 25000);
  }
  setTimeout(fly, 5000);
})();
