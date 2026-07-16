/* Detail plate. A picture resolves by detail, flat cells first and edges last,
   then lives under the cursor: it comes back where you point and the glyphs
   churn while they are hot, settling to the true characters as they cool.

   Wiring: every image on the site gets one, except the avatar and anything
   marked data-no-plate. Plates are built only when they scroll into view and
   are torn down again when they leave, because each one holds several
   full-resolution canvases and a gallery would otherwise eat hundreds of
   megabytes. Pointer tracking is mouse only, so touch scrolling and links
   are never swallowed. */
(function () {
  'use strict';

  var RAMPS = {
    long: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
    short: " .:-=+*#%@",
    blocks: " ░▒▓█"
  };

  var smooth = function (t) { return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); };
  var clamp255 = function (v) { return v < 0 ? 0 : v > 255 ? 255 : v | 0; };

  // Luminance to hue ramps. Stops are [r,g,b], dark end first.
  var PALETTES = {
    vivid:    null,                                    // no tint, the photo's own colour only
    warm:     [[26, 12, 48], [140, 26, 40], [255, 58, 31], [255, 176, 41], [255, 246, 176]],
    spectrum: [[18, 8, 54], [122, 24, 130], [232, 62, 74], [240, 166, 38], [198, 246, 60]]
  };

  function rampAt(stops, t) {
    var n = stops.length - 1, i = Math.min(n - 1, Math.floor(t * n)), f = t * n - i;
    var a = stops[i], b = stops[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }

  // Colour for one glyph. The old code did rgb * 1.5, which scales every channel
  // by the same factor: that is brightness, it preserves the ratio between the
  // channels, so a grey cell stays grey and only gets lighter. On a desaturated
  // photo that produced black and white type. Instead push each channel away
  // from the cell's own mean, which is saturation, and where a cell has almost
  // no colour of its own, lend it one from a luminance ramp.
  function inkColour(r, g, b, L, o) {
    var mean = (r + g + b) / 3;
    var rr = mean + (r - mean) * o.satBoost;
    var gg = mean + (g - mean) * o.satBoost;
    var bb = mean + (b - mean) * o.satBoost;

    var stops = PALETTES[o.palette];
    if (stops && o.tint > 0) {
      // How much colour does this cell actually carry, 0 for pure grey.
      var chroma = Math.max(Math.abs(r - mean), Math.abs(g - mean), Math.abs(b - mean)) / 90;
      var mix = Math.max(0, 1 - chroma) * o.tint;
      if (mix > 0) {
        var c = rampAt(stops, Math.max(0, Math.min(1, L)));
        rr += (c[0] - rr) * mix; gg += (c[1] - gg) * mix; bb += (c[2] - bb) * mix;
      }
    }
    return 'rgb(' + clamp255(rr * o.gain) + ',' + clamp255(gg * o.gain) + ',' + clamp255(bb * o.gain) + ')';
  }

  function rankNorm(v) {
    // Raw Sobel is badly skewed, most cells sit near zero. Normalising by the
    // max dumps the majority in the first fraction of the run and then nothing
    // happens. Ranking flattens it so cells resolve at a constant rate.
    var n = v.length, order = Array.from({ length: n }, function (_, i) { return i; });
    order.sort(function (a, b) { return v[a] - v[b]; });
    var out = new Float32Array(n), last = Math.max(1, n - 1);
    order.forEach(function (orig, rank) { out[orig] = rank / last; });
    return out;
  }

  function reducedMotion() {
    return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function DetailPlate(canvas, host, opts) {
    this.cv = canvas; this.host = host; this.ctx = canvas.getContext('2d');
    this.o = Object.assign({
      cell: 8, feather: 0.14, duration: 3200, radius: 130, trail: 220,
      tileOpacity: 0.5, textOpacity: 1, ramp: 'long', chromatic: true,
      invert: false, churnHz: 18, churnAmt: 1.6, textColor: '#eef1f4',
      // Colour. satBoost pushes each channel away from the cell's own mean;
      // palette + tint lend a hue to cells that have none of their own.
      palette: 'warm', satBoost: 2.6, tint: 0.85, gain: 1.35
    }, opts || {});
    // Capped harder than the lab page: these run many at a time on a real page.
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    this.ready = false; this.tainted = false; this.raf = null;
    this.mx = -1e5; this.my = -1e5; this.inside = false;
    this.resolveProg = 1; this.resolveT0 = 0; this.resolving = false;
    for (var i = 0, k = ['photo', 'field', 'tmp', 'samp']; i < k.length; i++) {
      this[k[i]] = document.createElement('canvas');
    }
    this.bindPointer();
  }

  DetailPlate.prototype.setImage = function (src) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var img = new Image();
      if (!/^data:/.test(src)) img.crossOrigin = 'anonymous';
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = src;
    }).then(function (img) {
      self.img = img;
      if (!self.layout()) return self;
      self.build();
      return self;
    });
  };

  // The host box decides the size, so whatever CSS already does to the image
  // (full column, grid cell, object-fit cover) is what the plate inherits.
  DetailPlate.prototype.layout = function () {
    var w = this.host.clientWidth, h = this.host.clientHeight;
    if (!h && this.img) h = Math.round(w * this.img.naturalHeight / Math.max(1, this.img.naturalWidth));
    if (!w || !h) return false;
    this.W = Math.max(1, Math.round(w * this.dpr));
    this.H = Math.max(1, Math.round(h * this.dpr));
    this.cv.width = this.W; this.cv.height = this.H;
    return true;
  };

  DetailPlate.prototype.build = function () {
    var W = this.W, H = this.H, o = this.o;
    for (var i = 0, k = ['photo', 'field', 'tmp']; i < k.length; i++) {
      this[k[i]].width = W; this[k[i]].height = H;
    }
    var p = this.photo.getContext('2d');
    var iw = this.img.naturalWidth, ih = this.img.naturalHeight;
    var s = Math.max(W / iw, H / ih);              // cover, same as the CSS above it
    p.clearRect(0, 0, W, H);
    p.drawImage(this.img, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s);

    var cw = Math.max(3, Math.round(o.cell * this.dpr));
    var cols = Math.ceil(W / cw), rows = Math.ceil(H / cw);
    this.cw = cw; this.cols = cols; this.rows = rows;

    this.samp.width = cols; this.samp.height = rows;
    var sc = this.samp.getContext('2d', { willReadFrequently: true });
    sc.clearRect(0, 0, cols, rows);
    sc.drawImage(this.photo, 0, 0, W, H, 0, 0, cols, rows);
    var d;
    try { d = sc.getImageData(0, 0, cols, rows).data; }
    catch (e) {
      // Cross origin image: the canvas is tainted and getImageData throws.
      // Fall back to the plain photo rather than a blank box.
      this.tainted = true; this.ready = true;
      this.ctx.drawImage(this.photo, 0, 0);
      return;
    }

    // The character fields. Glyphs have to change under the cursor and a single
    // pre-rendered canvas cannot do that, so field 0 holds the true characters
    // and fields 1..N hold scrambled ones. Playback picks a field per cell per
    // frame. The tiles are identical across all of them, so colour and structure
    // hold still while the type churns.
    var fam = getComputedStyle(document.body).getPropertyValue('--mono') || 'monospace';
    var ramp = RAMPS[o.ramp] || RAMPS.long;
    var lum = new Float32Array(cols * rows);
    var NV = 4;
    this.fields = [];

    for (var v = 0; v < NV; v++) {
      var cv = v === 0 ? this.field : document.createElement('canvas');
      cv.width = W; cv.height = H;
      var c = cv.getContext('2d');
      c.clearRect(0, 0, W, H); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
      c.font = '700 ' + cw + 'px ' + fam;
      c.textAlign = 'center'; c.textBaseline = 'middle';
      var gw = c.measureText('M').width || cw * 0.6, sx = cw / gw;

      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var i2 = (y * cols + x) * 4, r = d[i2], g = d[i2 + 1], b = d[i2 + 2];
        var L = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        if (v === 0) lum[y * cols + x] = L;
        c.globalAlpha = o.tileOpacity;
        c.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        c.fillRect(x * cw, y * cw, cw, cw);
        c.globalAlpha = o.textOpacity;
        var ch;
        if (v === 0) {
          ch = ramp[Math.min(ramp.length - 1, Math.floor(L * ramp.length))];
        } else {
          // Scrambled, but biased toward this cell's true weight so the churn
          // keeps the picture's mass instead of turning it into static.
          var t0 = Math.floor(L * ramp.length);
          var jitter = Math.floor((Math.random() - 0.5) * ramp.length * 0.85);
          ch = ramp[Math.max(0, Math.min(ramp.length - 1, t0 + jitter))];
        }
        if (ch !== ' ') {
          c.fillStyle = o.chromatic ? inkColour(r, g, b, L, o) : o.textColor;
          c.save(); c.translate(x * cw + cw / 2, y * cw + cw / 2); c.scale(sx, 1);
          c.fillText(ch, 0, 0); c.restore();
        }
      }
      c.globalAlpha = 1;
      this.fields.push(cv);
    }
    this.NV = NV;
    // Fixed per cell phase so cells churn out of step with each other.
    this.phase = new Uint8Array(cols * rows);
    for (var i3 = 0; i3 < this.phase.length; i3++) this.phase[i3] = (Math.random() * 255) | 0;

    // The one ordering: Sobel magnitude per cell, rank normalised.
    var vv = new Float32Array(cols * rows);
    var at = function (xx, yy) {
      return lum[Math.min(rows - 1, Math.max(0, yy)) * cols + Math.min(cols - 1, Math.max(0, xx))];
    };
    for (var y2 = 0; y2 < rows; y2++) for (var x2 = 0; x2 < cols; x2++) {
      var gx = -at(x2 - 1, y2 - 1) - 2 * at(x2 - 1, y2) - at(x2 - 1, y2 + 1) +
        at(x2 + 1, y2 - 1) + 2 * at(x2 + 1, y2) + at(x2 + 1, y2 + 1);
      var gy = -at(x2 - 1, y2 - 1) - 2 * at(x2, y2 - 1) - at(x2 + 1, y2 - 1) +
        at(x2 - 1, y2 + 1) + 2 * at(x2, y2 + 1) + at(x2 + 1, y2 + 1);
      vv[y2 * cols + x2] = Math.hypot(gx, gy);
    }
    this.rank = rankNorm(vv);

    this.masks = []; this.mcs = []; this.mids = [];
    for (var v2 = 0; v2 < NV; v2++) {
      var mk = document.createElement('canvas'); mk.width = cols; mk.height = rows;
      var mc = mk.getContext('2d');
      this.masks.push(mk); this.mcs.push(mc); this.mids.push(mc.createImageData(cols, rows));
    }
    this.heat = new Float32Array(cols * rows);
    this.ready = true;
    this.draw(0);
  };

  // Mouse only on purpose. The lab page called preventDefault on touchmove,
  // which on a page of plates would stop the page scrolling and swallow taps
  // on the links the images sit inside.
  DetailPlate.prototype.bindPointer = function () {
    var self = this;
    var pos = function (e) {
      var r = self.cv.getBoundingClientRect();
      if (!r.width || !r.height) return;
      self.mx = (e.clientX - r.left) / r.width * self.W;
      self.my = (e.clientY - r.top) / r.height * self.H;
      self.inside = true; self.host.classList.add('touched'); self.kick();
    };
    if (window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      this.host.addEventListener('mousemove', pos);
      this.host.addEventListener('mouseenter', pos);
      this.host.addEventListener('mouseleave', function () { self.inside = false; self.kick(); });
    }
  };

  DetailPlate.prototype.play = function () {
    if (!this.ready || this.tainted) return;
    if (reducedMotion()) { this.resolveProg = 1; this.resolving = false; this.draw(0); return; }
    this.resolveT0 = performance.now(); this.resolveProg = 0; this.resolving = true;
    this.host.classList.remove('touched');
    this.kick();
  };

  DetailPlate.prototype.kick = function () {
    if (this.raf || !this.ready || this.tainted) return;
    var self = this;
    this.last = performance.now();
    var step = function (now) {
      var dt = Math.min(0.05, Math.max(0, (now - self.last) / 1000));
      self.last = now;
      if (self.resolving) {
        // rAF timestamps can predate the t0 captured in play()
        self.resolveProg = Math.max(0, Math.min(1, (now - self.resolveT0) / self.o.duration));
        if (self.resolveProg >= 1) self.resolving = false;
      }
      var busy = self.draw(dt);
      self.raf = busy ? requestAnimationFrame(step) : null;
    };
    this.raf = requestAnimationFrame(step);
  };

  DetailPlate.prototype.draw = function (dt) {
    dt = dt || 0;
    if (!this.ready || this.tainted) return false;
    var W = this.W, H = this.H, cols = this.cols, rows = this.rows, cw = this.cw, NV = this.NV, o = this.o;
    var fe = o.feather;
    // Linear through the rank field: it is already uniform, so easing re-skews it.
    var f = this.resolveProg * (1 + fe);
    var R = o.radius * this.dpr;
    var decay = o.trail > 0 ? Math.exp(-dt / (o.trail / 1000)) : 0;
    var heat = this.heat, rank = this.rank;
    var busy = this.resolving || this.inside, peak = 0;

    var tick = Math.floor(performance.now() / 1000 * o.churnHz);

    for (var v = 0; v < NV; v++) {
      var dm = this.mids[v].data;
      for (var i = 0; i < cols * rows; i++) { var j = i * 4; dm[j] = dm[j + 1] = dm[j + 2] = 255; dm[j + 3] = 0; }
    }

    for (var y = 0; y < rows; y++) {
      var cy = y * cw + cw / 2;
      for (var x = 0; x < cols; x++) {
        var i2 = y * cols + x;
        // Resolve term: detail ordered, falls to zero and stays there.
        var r = o.invert ? 1 - rank[i2] : rank[i2];
        var res = 1 - smooth((f - r) / fe);
        // Cursor term: gaussian around the pointer, decaying behind it.
        var inf = 0;
        if (this.inside) {
          var dx = (x * cw + cw / 2) - this.mx, dy = cy - this.my;
          var q = (dx * dx + dy * dy) / (R * R);
          inf = q < 4 ? Math.exp(-q * 2.2) : 0;
        }
        // Pure exponential decay approaches zero asymptotically, so the loop
        // idles for ~5 time constants on heat nobody can see. A small linear
        // bleed gives the tail a finite settling time.
        var h = Math.max(heat[i2] * decay - dt * 0.6, inf);
        if (h < 0.006) h = 0;
        heat[i2] = h;
        if (h > peak) peak = h;

        var vis = Math.max(0, Math.min(1, Math.max(res, h)));
        if (vis <= 0) continue;
        // Churn is driven by the cursor only, so the resolve stays legible.
        var churn = Math.min(1, h * o.churnAmt);
        var sel = 1 + ((tick + this.phase[i2]) % (NV - 1));
        var j2 = i2 * 4;
        this.mids[0].data[j2 + 3] = (vis * (1 - churn) * 255) | 0;
        if (churn > 0) this.mids[sel].data[j2 + 3] = (vis * churn * 255) | 0;
      }
    }
    if (peak > 0) busy = true;

    var ctx = this.ctx;
    ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
    ctx.drawImage(this.photo, 0, 0);

    var t = this.tmp.getContext('2d');
    for (var v2 = 0; v2 < NV; v2++) {
      if (v2 > 0 && peak <= 0) continue;   // skip variants nothing is using this frame
      this.mcs[v2].putImageData(this.mids[v2], 0, 0);
      t.globalCompositeOperation = 'source-over'; t.globalAlpha = 1;
      t.clearRect(0, 0, W, H); t.drawImage(this.fields[v2], 0, 0);
      t.globalCompositeOperation = 'destination-in';
      t.imageSmoothingEnabled = false;
      t.drawImage(this.masks[v2], 0, 0, cols, rows, 0, 0, W, H);
      t.globalCompositeOperation = 'source-over';
      ctx.drawImage(t.canvas, 0, 0);
    }
    return busy;
  };

  // Hand the backing stores back. Setting a canvas to zero frees it; without
  // this a long gallery would keep every plate it ever scrolled past.
  DetailPlate.prototype.destroy = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null; this.ready = false; this.inside = false;
    var all = [this.photo, this.field, this.tmp, this.samp]
      .concat(this.fields || []).concat(this.masks || []);
    for (var i = 0; i < all.length; i++) { if (all[i]) { all[i].width = 0; all[i].height = 0; } }
    this.fields = null; this.masks = null; this.mcs = null; this.mids = null;
    this.rank = null; this.heat = null; this.phase = null; this.img = null;
    this.cv.width = 0; this.cv.height = 0;
  };

  /* ── site wiring ─────────────────────────────────────────────────── */

  // Budget in device pixels, not in plate count: a plate costs roughly six
  // canvases of its own size, so one column-wide photo is worth a dozen
  // thumbnails. Counting plates would either starve the pics grid or let the
  // blog page hold a few hundred megabytes.
  var PIXEL_BUDGET = 9e6;
  var live = [];             // most recently shown last

  function skip(img) {
    return img.classList.contains('avatar') ||
      img.hasAttribute('data-no-plate') ||
      !!img.closest('[data-no-plate]');
  }

  function hostFor(img) {
    var host = document.createElement('span');
    host.className = 'plate-host';
    img.parentNode.insertBefore(host, img);
    host.appendChild(img);
    var cv = document.createElement('canvas');
    cv.className = 'plate-canvas';
    cv.setAttribute('aria-hidden', 'true');
    host.appendChild(cv);
    return host;
  }

  function cost(entry) {
    var p = entry.plate;
    return p && p.ready ? p.W * p.H : 0;
  }

  function retire(keep) {
    var total = live.reduce(function (n, e) { return n + cost(e); }, 0);
    // Oldest first, never the one that just appeared, and never one the cursor
    // is still inside.
    for (var i = 0; i < live.length && total > PIXEL_BUDGET; i++) {
      var old = live[i];
      if (old === keep || (old.plate && old.plate.inside)) continue;
      total -= cost(old);
      old.plate.destroy();
      old.host.classList.remove('plate-on');
      old.built = false;
      live.splice(i, 1); i--;
    }
  }

  // Never leave a hole. If a plate cannot be ready in reasonable time, or at
  // all, the plain photo comes back and the page just looks normal.
  function reveal(entry) {
    clearTimeout(entry.guard);
    entry.host.classList.remove('plate-pending');
  }

  function mount(entry) {
    if (entry.built || entry.building) return;
    entry.building = true;
    // Hide only now, never at init. Showing the plain photo and covering it in
    // type a beat later reads as a bug, so a picture we are about to draw is
    // held back. But a picture we may never draw must never be held back at
    // all: a fast scroll or a jump to an anchor can carry an image from below
    // the fold to above it without it ever intersecting, so it would never
    // mount, never reveal, and stay blank for good.
    entry.host.classList.add('plate-pending');
    entry.guard = setTimeout(function () { reveal(entry); }, 2500);
    var plate = entry.plate || new DetailPlate(entry.host.querySelector('.plate-canvas'), entry.host, entry.opts);
    entry.plate = plate;
    plate.setImage(entry.src).then(function () {
      entry.building = false;
      if (!plate.ready) { reveal(entry); return; }
      entry.built = true;
      if (plate.tainted) { reveal(entry); return; }   // fall back to the plain photo
      entry.host.classList.add('plate-on');
      reveal(entry);                                  // canvas is up; pending is moot
      live.push(entry); retire(entry);
      if (entry.played) { plate.resolveProg = 1; plate.draw(0); }
      else { entry.played = true; plate.play(); }
    }).catch(function () { entry.building = false; reveal(entry); });
  }

  function init() {
    var imgs = Array.prototype.slice.call(document.querySelectorAll('img')).filter(function (i) { return !skip(i); });
    var hosts = [];

    imgs.forEach(function (img) {
      var src = img.currentSrc || img.getAttribute('src');
      if (!src) return;
      hosts.push({ host: hostFor(img), src: src, opts: {}, built: false, played: false });
    });

    // The banner is a CSS background, so it gets a canvas of its own and keeps
    // the background underneath as the fallback.
    var banner = document.querySelector('.banner[data-plate-src]');
    if (banner) {
      var bcv = document.createElement('canvas');
      bcv.className = 'plate-canvas';
      bcv.setAttribute('aria-hidden', 'true');
      banner.appendChild(bcv);
      banner.classList.add('plate-host');
      hosts.push({
        host: banner, src: banner.getAttribute('data-plate-src'),
        opts: { cell: 7, radius: 170 }, built: false, played: false
      });
    }

    if (!hosts.length) return;

    if (!('IntersectionObserver' in window)) { hosts.forEach(mount); return; }

    // Anything already on screen is claimed now, synchronously, rather than
    // waiting a frame for the observer to say what we can already see. That
    // frame is the difference between the banner arriving as type and the
    // banner arriving as a photo that then turns into type.
    hosts.forEach(function (h) {
      var r = h.host.getBoundingClientRect();
      if (r.bottom > -300 && r.top < (window.innerHeight || 0) + 300) mount(h);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var entry = hosts.filter(function (h) { return h.host === e.target; })[0];
        if (!entry) return;
        if (e.isIntersecting) mount(entry);
      });
    }, { rootMargin: '200px 0px' });

    hosts.forEach(function (h) { io.observe(h.host); });

    var rt;
    addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        live.forEach(function (e) {
          if (e.plate && e.plate.ready && !e.plate.tainted && e.plate.img) {
            if (e.plate.layout()) { e.plate.build(); e.plate.draw(0); }
          }
        });
      }, 180);
    });
  }

  window.DetailPlate = DetailPlate;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
