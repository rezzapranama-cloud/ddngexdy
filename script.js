/* ══════════════════════════════════════
   Ddngexdy — script.js
   ══════════════════════════════════════ */

// ══════════════════════════════════════
// DAFTAR MOD — tambah mod baru di sini
// ══════════════════════════════════════
const MODS = [

  // ── TAMBAH MOD DI BAWAH INI ──
  {
    nama:      "SKIN GANGSTA UNDERSHIRT",
    kategori:  "Skin",
    deskripsi: "Pembuat Ddngexdy. Skin bagus untuk Roleplay Gangster maupun biasa.",
    foto:      "foto/ddx.png",
    file:      "skin/Skin Bagus Dxd 6.7z",
    ukuran:    "4.6 MB",
    badge:     "badge-new",
  },
  {
    nama:      "SKIN GANGSTA TATTOOED",
    kategori:  "Skin",
    deskripsi: "Pembuat Ddngexdy Cocok Untuk Roleplay Gangster",
    foto:      "foto/skin-gangsta-tattooed.jpg",
    file:      "skin/skin/Skin Bagus dxd 5.7z",
    ukuran:    "2.65 MB",
    badge:     "badge-update",
  },
];

function loadMods() {
  renderGrid();
  updateStats();
  spawnParticles();
}

/* ══════════════════════════════════════
   JANGAN UBAH KODE DI BAWAH INI
   (kecuali kamu mau kustomisasi lebih lanjut)
   ══════════════════════════════════════ */

// ── RENDER GRID ──
let currentFilter = 'Semua';
let currentSearch = '';

function getFilteredMods() {
  return MODS.filter(m => {
    const matchCat = currentFilter === 'Semua' || m.kategori === currentFilter;
    const matchSearch = currentSearch === '' ||
      m.nama.toLowerCase().includes(currentSearch.toLowerCase()) ||
      m.kategori.toLowerCase().includes(currentSearch.toLowerCase()) ||
      (m.deskripsi || '').toLowerCase().includes(currentSearch.toLowerCase());
    return matchCat && matchSearch;
  });
}

function renderGrid() {
  const grid = document.getElementById('modGrid');
  const empty = document.getElementById('emptyState');
  const list = getFilteredMods();

  if (!list.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = list.map((mod, i) => `
    <div class="mod-card reveal" style="transition-delay:${i * 0.05}s"
         onclick="openModal(${MODS.indexOf(mod)})">

      <div class="mod-thumb">
        <img
          src="${mod.foto || ''}"
          alt="${mod.nama}"
          onerror="this.style.display='none'"
          loading="lazy"
        />
        <div class="mod-thumb-ph">
          <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/></svg>
          <span>${mod.foto ? mod.foto.split('/').pop() : 'Foto belum ada'}</span>
        </div>
        ${mod.badge ? `<span class="mod-badge ${mod.badge}">${badgeLabel(mod.badge)}</span>` : ''}
      </div>

      <div class="card-body">
        <div class="card-cat">${mod.kategori}</div>
        <div class="card-name">${mod.nama}</div>
        <p class="card-desc">${mod.deskripsi || ''}</p>
        <div class="card-footer">
          <span class="card-size">
            <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            ${mod.ukuran || '—'}
          </span>
          <a href="${mod.file || '#'}"
             class="card-dl"
             download
             onclick="event.stopPropagation(); showToast('Download dimulai…')"
          >
            <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            Download
          </a>
        </div>
      </div>
    </div>
  `).join('');

  // re-observe new cards
  document.querySelectorAll('.mod-card.reveal').forEach(el => revealObserver.observe(el));
}

function badgeLabel(badge) {
  const map = { 'badge-new': 'Baru', 'badge-hot': 'Hot', 'badge-update': 'Update', 'badge-featured': 'Pilihan' };
  return map[badge] || '';
}

// ── FILTER ──
function filterMods(cat, btnEl) {
  currentFilter = cat;

  // update active filter button
  if (btnEl) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btnEl.classList) btnEl.classList.add('active');
  }

  renderGrid();

  // scroll to mods section
  if (cat !== 'Semua') {
    setTimeout(() => {
      document.getElementById('mods').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}

// ── SEARCH ──
function searchMods(q) {
  currentSearch = q;
  renderGrid();
}

// ── STATS ──
function updateStats() {
  const total = MODS.length;
  const skin  = MODS.filter(m => m.kategori === 'Skin').length;
  const pose  = MODS.filter(m => m.kategori === 'Pose').length;
  const anim  = MODS.filter(m => m.kategori === 'Animasi').length;

  animCount(document.getElementById('statTotal'), total);
  animCount(document.getElementById('statSkin'),  skin);
  animCount(document.getElementById('statPose'),  pose);
  animCount(document.getElementById('statAnim'),  anim);

  document.getElementById('catSkin').textContent = skin  + ' Mod';
  document.getElementById('catPose').textContent = pose  + ' Mod';
  document.getElementById('catAnim').textContent = anim  + ' Mod';
}

function animCount(el, target) {
  if (!el) return;
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const iv = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(iv);
  }, 30);
}

// ── MODAL ──
function openModal(idx) {
  const mod = MODS[idx];
  if (!mod) return;

  const img   = document.getElementById('modalImg');
  const ph    = document.getElementById('modalImgPh');

  if (mod.foto) {
    img.src = mod.foto;
    img.style.display = 'block';
    img.style.cursor  = 'zoom-in';
    img.title         = 'Klik untuk lihat penuh';
    img.onclick       = () => openLightbox(mod.foto);
    ph.style.display  = 'none';
    img.onerror = () => { img.style.display = 'none'; ph.style.display = 'flex'; };
  } else {
    img.style.display = 'none';
    ph.style.display  = 'flex';
  }

  document.getElementById('modalCat').textContent   = mod.kategori;
  document.getElementById('modalTitle').textContent = mod.nama;
  document.getElementById('modalDesc').textContent  = mod.deskripsi || '—';

  document.getElementById('modalMeta').innerHTML = `
    <div class="modal-meta-item">
      <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
      <span>${mod.ukuran || '—'}</span>
    </div>
    <div class="modal-meta-item">
      <svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.07-.44.18-.86.18-1.3C18 2.55 15.45 1 12.5 1c-1.5 0-2.84.5-3.83 1.33L7 4H4c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.11-.89-2-2-2z"/></svg>
      <span>${mod.file ? mod.file.split('/').pop() : '—'}</span>
    </div>
    <div class="modal-meta-item">
      <svg viewBox="0 0 24 24"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/></svg>
      <span>${mod.kategori}</span>
    </div>
  `;

  const dlBtn = document.getElementById('modalDl');
  if (mod.file) {
    dlBtn.href = mod.file;
    dlBtn.removeAttribute('onclick');
    dlBtn.onclick = () => showToast('Download ' + mod.nama + ' dimulai…');
  } else {
    dlBtn.href = '#';
    dlBtn.onclick = e => { e.preventDefault(); showToast('File belum tersedia'); };
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── LIGHTBOX FULLSCREEN FOTO ──
function openLightbox(src) {
  if (!src) return;
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `
      <div id="lb-backdrop"></div>
      <div id="lb-wrap">
        <img id="lb-img" src="" alt=""/>
        <button id="lb-close">&times;</button>
        <div id="lb-hint">Klik di luar foto atau tekan ESC untuk tutup</div>
      </div>
    `;
    document.body.appendChild(lb);

    document.getElementById('lb-backdrop').addEventListener('click', closeLightbox);
    document.getElementById('lb-close').addEventListener('click', closeLightbox);
  }
  document.getElementById('lb-img').src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── TOAST ──
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── BACK TO TOP ──
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  btt.classList.toggle('show', window.scrollY > 400);
});
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── NAVBAR SCROLL ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.background = window.scrollY > 60
    ? 'rgba(3,9,18,0.97)'
    : 'rgba(3,9,18,0.8)';
});

// ── CUSTOM CURSOR ──
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cur.style.left  = e.clientX + 'px';
  cur.style.top   = e.clientY + 'px';
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  }, 55);
});
document.querySelectorAll('a, button, .mod-card, .cat-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width  = '18px';
    cur.style.height = '18px';
    cur.style.background = 'rgba(0,229,255,0.35)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width  = '10px';
    cur.style.height = '10px';
    cur.style.background = 'var(--cyan)';
  });
});

// ── PARTICLES ──
function spawnParticles() {
  const wrap = document.getElementById('particles');
  if (!wrap) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left              = Math.random() * 100 + '%';
    p.style.width             =
    p.style.height            = (1 + Math.random() * 2) + 'px';
    p.style.animationDuration = (9 + Math.random() * 10) + 's';
    p.style.animationDelay    = (Math.random() * 8) + 's';
    wrap.appendChild(p);
  }
}
spawnParticles();

// ── INIT ──
loadMods();
