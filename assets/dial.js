/* The Crisis Dial: a 1950s tube-radio dial that spins to the right book.
   To add a book, add one line to BOOKS below (the dial redraws itself). */
(function () {
  var BOOKS = [
    { key: 'independent', band: 'Blackout', color: '#7E1F24', h: 'independent-household/', t: 'The Independent Household',
      c: ['The power’s out and the stores are empty!', 'The pantry is down to one can of beans!', 'The well pump just quit!'] },
    { key: 'dino', band: 'Dinosaur', color: '#5B7B2A', h: 'dinosaur-backyard/', t: 'There’s a Dinosaur in the Backyard',
      c: ['A dinosaur just ate the hedge!', 'Something with very big teeth is in the birdbath!', 'The neighbor’s poodle is missing again!'] },
    { key: 'gop', band: 'Red Caps', color: '#8A1F1C', h: 'gop-apocalypse/', t: 'How to Survive a GOP Apocalypse',
      c: ['Uncle Earl wore his red cap to Thanksgiving!', 'There’s a rally on the church lawn!', 'Grandpa has a new favorite news channel!'] },
    { key: 'alien', band: 'Saucers', color: '#3C8C8A', h: 'alien-invasions/', t: 'The Housewife’s Guide to Alien Invasions',
      c: ['There’s a saucer on the Hendersons’ lawn!', 'A Martian wants the recipe for my meatloaf!', 'The cat is glowing green!'] },
    { key: 'robot', band: 'Robots', color: '#B07A1E', h: 'robot-uprising/', t: 'Etiquette for the Robot Uprising',
      c: ['The toaster is talking back!', 'The vacuum cleaner has demands!', 'A robot butler wants Sundays off!'] },
    { key: 'ai', band: 'AI Brains', color: '#2F5D8A', h: 'ai-apocalypse/', t: 'How to Survive the AI Apocalypse',
      c: ['The toaster just finished my sentence!', 'The electronic brain is writing my letters!', 'The television says it knows best!'] },
    { key: 'zombie', band: 'Zombies', color: '#4A6B5A', h: 'zombie-neighborhood/', t: 'The Gentleman’s Guide to the Zombie Neighborhood',
      c: ['Mr. Hale is stuck in the hedge again!', 'The new neighbors are a bit gray around the gills!', 'Someone brought brains to the potluck!'] },
    { key: 'asteroid', band: 'Asteroid', color: '#B5532A', h: 'asteroid-homemaking/', t: 'Homemaking After the Asteroid',
      c: ['An asteroid just landed in the rose bed!', 'The sky is raining pebbles again!', 'The crater ate the clothesline!'] },
    { key: 'bigfoot', band: 'Bigfoot', color: '#8A5A2B', h: 'bigfoot/', t: 'How to Raise a Well-Behaved Bigfoot',
      c: ['There are footprints at the woodshed door!', 'Something hairy ate all the pie!', 'The new uncle is eight feet tall!'] },
    { key: 'time', band: 'Time Travel', color: '#2F5D62', h: 'time-travelers/', t: 'Good Manners for Time Travelers',
      c: ['There is a knight at the supper table!', 'Grandpa set the dials to 990 again!', 'A Viking wants to stay for the week!'] },
    { key: 'vampire', band: 'Vampires', color: '#5A2E4A', h: 'vampire-housing-boom/', t: 'Surviving the Great Vampire Housing Boom',
      c: ['The new neighbors only come out at night!', 'Someone offered a bag of gold for the house!', 'The Count is at the door asking to come in!'] }
  ];
  var CALM = ['Don’t panic, dear. Reach for', 'Keep calm and fetch', 'Mother knows just the thing:', 'Doctor’s orders! Read', 'Chin up, chum. You need'];
  var WAITING = ['Warming up the tubes…', 'Tuning past the polka hour…', 'Consulting Mother…', 'Asking the milkman…', 'Checking the almanac…', 'Jiggling the antenna…'];

  var root = document.getElementById('crisis-dial');
  if (!root) return;
  var face = document.getElementById('dial-face');
  var out = document.getElementById('dial-out');
  var soundBtn = document.getElementById('dial-sound');
  var spinBtns = root.querySelectorAll('[data-spin]');
  var N = BOOKS.length, SEG = 360 / N, C = 200;
  var NS = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- draw the dial face ----------
  function pt(r, a) { var t = a * Math.PI / 180; return [C + r * Math.sin(t), C - r * Math.cos(t)]; }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function wedge(r1, r2, a1, a2) {
    var p1 = pt(r2, a1), p2 = pt(r2, a2), p3 = pt(r1, a2), p4 = pt(r1, a1);
    return 'M' + p1 + ' A' + r2 + ' ' + r2 + ' 0 0 1 ' + p2 + ' L' + p3 + ' A' + r1 + ' ' + r1 + ' 0 0 0 ' + p4 + ' Z';
  }
  var defs = el('defs', {}, face);
  defs.innerHTML =
    '<radialGradient id="dg-face" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#FFF8E6"/><stop offset="1" stop-color="#E9D7AE"/></radialGradient>' +
    '<radialGradient id="dg-glow" cx="50%" cy="50%" r="50%"><stop offset="0.55" stop-color="#FFC94D" stop-opacity="0"/><stop offset="1" stop-color="#FFB020" stop-opacity="0.55"/></radialGradient>' +
    '<linearGradient id="dg-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7D774"/><stop offset="0.5" stop-color="#C08A1E"/><stop offset="1" stop-color="#8A5E10"/></linearGradient>';
  el('circle', { cx: C, cy: C, r: 196, fill: 'url(#dg-face)' }, face);
  var segs = [], labels = [];
  BOOKS.forEach(function (b, i) {
    var a1 = i * SEG, a2 = a1 + SEG, mid = a1 + SEG / 2;
    var g = el('g', { 'class': 'seg' }, face);
    el('path', { d: wedge(122, 194, a1 + 0.6, a2 - 0.6), fill: b.color }, g);
    el('path', { 'class': 'seg-lit', d: wedge(122, 194, a1 + 0.6, a2 - 0.6) }, g);
    // words curve along the band: upright on top, flipped to read left-to-right on the bottom
    var flip = mid > 90 && mid < 270, ext = 12, r = flip ? 163 : 153;
    var s1 = pt(r, flip ? a2 + ext : a1 - ext), s2 = pt(r, flip ? a1 - ext : a2 + ext);
    el('path', { id: 'dl-' + i, d: 'M' + s1 + ' A' + r + ' ' + r + ' 0 0 ' + (flip ? 0 : 1) + ' ' + s2, fill: 'none' }, defs);
    var tx = el('text', { 'class': 'seg-label' }, g);
    tx = el('textPath', { href: '#dl-' + i, startOffset: '50%', 'text-anchor': 'middle' }, tx);
    tx.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#dl-' + i);
    tx.textContent = b.band.toUpperCase();
    labels.push({ el: tx.parentNode, room: (SEG - 8) * Math.PI / 180 * r });
    segs.push(g);
  });
  // shrink any word that would spill past its band once the real font has loaded
  function fit() {
    labels.forEach(function (l) {
      l.el.style.fontSize = '';
      var w = l.el.getComputedTextLength ? l.el.getComputedTextLength() : 0;
      if (w > l.room) l.el.style.fontSize = (parseFloat(getComputedStyle(l.el).fontSize) * l.room / w) + 'px';
    });
  }
  try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); } catch (e) {}
  // tick marks and "frequency" numbers on the cream inner ring
  for (var a = 0; a < 360; a += SEG / 4) {
    var major = Math.abs(a % SEG) < 0.01;
    var q1 = pt(major ? 98 : 108, a), q2 = pt(120, a);
    el('line', { x1: q1[0], y1: q1[1], x2: q2[0], y2: q2[1], 'class': major ? 'tick tick-major' : 'tick' }, face);
  }
  BOOKS.forEach(function (b, i) {
    var p = pt(84, i * SEG + SEG / 2);
    var t = el('text', { x: p[0], y: p[1], 'class': 'freq', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, face);
    t.textContent = String(55 + i * 15);
  });
  el('circle', { cx: C, cy: C, r: 121, 'class': 'ring' }, face);
  el('circle', { cx: C, cy: C, r: 195, 'class': 'ring' }, face);
  var call = el('text', { x: C, y: C - 50, 'class': 'callsign', 'text-anchor': 'middle' }, face);
  call.textContent = 'W·FUN';
  var kc = el('text', { x: C, y: C + 47, 'class': 'kc', 'text-anchor': 'middle' }, face);
  kc.textContent = 'KILOCRISES';
  el('circle', { cx: C, cy: C, r: 196, 'class': 'glow' }, face);
  // the needle: a brass pointer with a red tip, plus a counterweight
  var needle = el('g', { 'class': 'needle' }, face);
  el('path', { d: 'M' + (C - 7) + ' ' + (C + 34) + ' L' + (C - 3.5) + ' ' + (C - 150) + ' L' + C + ' ' + (C - 186) + ' L' + (C + 3.5) + ' ' + (C - 150) + ' L' + (C + 7) + ' ' + (C + 34) + ' Z', fill: 'url(#dg-brass)', stroke: '#5A3C08', 'stroke-width': 1.5 }, needle);
  el('path', { d: 'M' + (C - 3.5) + ' ' + (C - 150) + ' L' + C + ' ' + (C - 186) + ' L' + (C + 3.5) + ' ' + (C - 150) + ' Z', fill: '#C0262B' }, needle);
  el('circle', { cx: C, cy: C + 36, r: 10, fill: 'url(#dg-brass)', stroke: '#5A3C08', 'stroke-width': 1.5 }, needle);
  el('circle', { cx: C, cy: C, r: 24, fill: 'url(#dg-brass)', stroke: '#5A3C08', 'stroke-width': 2 }, face);
  el('circle', { cx: C, cy: C, r: 9, fill: '#3E2412' }, face);
  el('circle', { cx: C - 7, cy: C - 8, r: 4, fill: '#FFF3C4', opacity: 0.8 }, face);

  // ---------- sound (only ever after a tap, never on its own) ----------
  var soundOn = true, ctx = null;
  try { soundOn = localStorage.getItem('dialSound') !== 'off'; } catch (e) {}
  function paintSound() {
    soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    soundBtn.textContent = soundOn ? 'Sound: on' : 'Sound: off';
  }
  paintSound();
  soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    try { localStorage.setItem('dialSound', soundOn ? 'on' : 'off'); } catch (e) {}
    paintSound();
  });
  function audio() {
    if (!soundOn) return null;
    try {
      if (!ctx) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A(); }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { return null; }
    return ctx;
  }
  function click() {
    var a = audio(); if (!a) return;
    var t = a.currentTime, o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(1700 + Math.random() * 300, t);
    o.frequency.exponentialRampToValueAtTime(500, t + 0.025);
    g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + 0.04);
  }
  function ding() {
    var a = audio(); if (!a) return;
    [[1046.5, 0], [1318.5, 0.14], [1568, 0.28]].forEach(function (n) {
      var t = a.currentTime + n[1], o = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(n[0], t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + 1);
    });
  }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  // ---------- spinning ----------
  var angle = 0, spinning = false, last = -1;
  function setNeedle(a) { needle.setAttribute('transform', 'rotate(' + a.toFixed(2) + ' ' + C + ' ' + C + ')'); }
  function segAt(a) { return Math.floor((((a % 360) + 360) % 360) / SEG) % N; }
  function light(i) { segs.forEach(function (g, k) { g.classList.toggle('lit', k === i); }); }
  setNeedle(angle);

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function spin() {
    if (spinning) return;
    spinning = true;
    var i; do { i = Math.floor(Math.random() * N); } while (i === last && N > 1);
    last = i;
    var b = BOOKS[i];
    var img = new Image(); img.src = b.h + 'img/page1.jpg';
    root.classList.add('is-spinning'); root.classList.remove('is-done');
    spinBtns.forEach(function (x) { x.disabled = true; });
    out.className = 'dial-out waiting';
    out.innerHTML = '<span class="wait-line" id="wait-line">' + pick(WAITING) + '</span>';
    light(-1);
    audio();

    var start = angle;
    var base = start - (((start % 360) + 360) % 360);
    var target = base + 360 * (4 + Math.floor(Math.random() * 2)) + i * SEG + SEG / 2 + (Math.random() - 0.5) * SEG * 0.6;
    var dur = reduced ? 0 : 4200, t0 = null, prevSeg = segAt(start), w = 0;
    var waitLine = document.getElementById('wait-line');
    var waits = setInterval(function () { if (waitLine) waitLine.textContent = WAITING[(w++ + 1) % WAITING.length]; }, 900);

    function frame(now) {
      if (t0 === null) t0 = now;
      var p = dur ? Math.min(1, (now - t0) / dur) : 1;
      // fast start, long slow ratcheting finish, then a little wobble as it settles
      var e = 1 - Math.pow(1 - p, 4);
      var settle = p > 0.85 ? Math.sin((p - 0.85) / 0.15 * Math.PI * 2) * (1 - p) * 18 : 0;
      angle = start + (target - start) * e + settle;
      setNeedle(angle);
      var s = segAt(angle);
      if (s !== prevSeg) { prevSeg = s; light(s); click(); buzz(6); }
      if (p < 1) { requestAnimationFrame(frame); return; }
      angle = target; setNeedle(angle); clearInterval(waits);
      finish(i, b);
    }
    if (reduced) frame(0); else requestAnimationFrame(frame);
  }

  function finish(i, b) {
    spinning = false;
    light(i);
    root.classList.remove('is-spinning'); root.classList.add('is-done');
    ding(); buzz([20, 40, 20]);
    out.className = 'dial-out reveal';
    out.innerHTML =
      '<div class="reveal-cover"><span class="rays" aria-hidden="true"></span>' +
      '<a href="' + b.h + '"><img src="' + b.h + 'img/page1.jpg" alt="Cover of ' + esc(b.t) + '" width="765" height="990"></a>' +
      '<span class="reveal-stamp">Just the ticket!</span></div>' +
      '<div class="reveal-text">' +
      '<span class="reveal-kicker">Bulletin from station W·FUN</span>' +
      '<b class="reveal-crisis">“' + esc(pick(b.c)) + '”</b>' +
      '<span class="reveal-calm">' + pick(CALM) + '</span>' +
      '<a class="reveal-title" href="' + b.h + '">' + esc(b.t) + '</a>' +
      '<div class="row"><a class="btn" href="' + b.h + '">See inside the book</a>' +
      '<button class="btn btn-teal" type="button" data-spin>Spin again</button></div></div>';
    var again = out.querySelector('[data-spin]');
    again.addEventListener('click', spin);
    spinBtns.forEach(function (x) { x.disabled = false; });
    if (!reduced) confetti();
    var r = out.getBoundingClientRect();
    if (r.bottom > window.innerHeight || r.top < 0) out.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  }

  function confetti() {
    var box = root.querySelector('.dial-bezel');
    var colors = ['#D9A228', '#C0262B', '#3C8C8A', '#F8F0DE', '#F7D774'];
    for (var k = 0; k < 28; k++) {
      var s = document.createElement('i');
      s.className = 'spark';
      var ang = Math.random() * Math.PI * 2, dist = 110 + Math.random() * 150;
      s.style.setProperty('--x', Math.cos(ang) * dist + 'px');
      s.style.setProperty('--y', Math.sin(ang) * dist + 'px');
      s.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      s.style.background = colors[k % colors.length];
      s.style.animationDelay = Math.random() * 0.12 + 's';
      box.appendChild(s);
      setTimeout(function (n) { return function () { n.remove(); }; }(s), 1400);
    }
  }

  spinBtns.forEach(function (x) { x.addEventListener('click', spin); });
  face.addEventListener('click', spin);
})();
