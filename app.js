// 마음쉼터 — 절·교회·성당·Company 3D 쉼터. 서버 없이 이 기기 안에서만 돈다.
import * as THREE from './vendor/three.module.min.js';

/* ───────── 기본 도구 ───────── */
const $ = (s) => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let rnd = Math.random;
const pick = (arr, r = rnd) => arr[Math.floor(r() * arr.length)];
const rr = (a, b, r = rnd) => a + (b - a) * r();

const ADJ = ['다정한', '느긋한', '고요한', '맑은', '따뜻한', '포근한', '잔잔한', '부드러운', '환한', '소박한', '한결같은', '너그러운', '차분한', '수줍은', '든든한', '싱그러운', '말간', '은은한'];
const NOUN = ['이끼', '구름', '바람', '솔잎', '물결', '달빛', '이슬', '연꽃', '산새', '들꽃', '노을', '별빛', '단풍', '조약돌', '햇살', '새벽', '오솔길', '풍경', '개울', '모래'];
const randName = (r = rnd) => pick(ADJ, r) + ' ' + pick(NOUN, r);

/* ───────── 장소 정의 ───────── */
const ICON = {
  temple: '<svg viewBox="0 0 24 24"><path d="M3 9.5 12 4l9 5.5M5 9v1.5h14V9M6.5 10.5V20M17.5 10.5V20M4 20h16M10 20v-5h4v5"/></svg>',
  church: '<svg viewBox="0 0 24 24"><path d="M12 2v5M10 4h4M6 21v-9l6-5 6 5v9zM10 21v-4a2 2 0 0 1 4 0v4"/></svg>',
  cathedral: '<svg viewBox="0 0 24 24"><path d="M4 21V11l3-4 3 4v10M14 21V11l3-4 3 4v10M10 21v-6h4v6M7 3v4M17 3v4"/><circle cx="12" cy="11" r="1.6"/></svg>',
  ohc: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/></svg>',
};
const ACT_ICON = {
  gassho: '<svg viewBox="0 0 24 24"><path d="M12 3c-1 2-3.5 6-3.5 10.5V18L6 21M12 3c1 2 3.5 6 3.5 10.5V18L18 21M12 3v15"/></svg>',
  bow: '<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="2.5"/><path d="M6 20c1-4 3-7 6-7s5 3 6 7M4 20h16"/></svg>',
  beads: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.6"/><circle cx="17" cy="7.5" r="1.6"/><circle cx="18.5" cy="12.5" r="1.6"/><circle cx="16" cy="17" r="1.6"/><circle cx="8" cy="17" r="1.6"/><circle cx="5.5" cy="12.5" r="1.6"/><circle cx="7" cy="7.5" r="1.6"/><path d="M12 18.5V22"/></svg>',
  pray: '<svg viewBox="0 0 24 24"><path d="M12 4c-1.5 2-3 5-3 8v4l-2.5 4M12 4c1.5 2 3 5 3 8v4l2.5 4"/><path d="M12 1.5v1.5"/></svg>',
  praise: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="2.3"/><path d="M5 3l3.5 7.5M19 3l-3.5 7.5M8.5 10.5 12 13l3.5-2.5M12 13v8"/></svg>',
  amen: '<svg viewBox="0 0 24 24"><path d="M12 3v18M6 9h12"/></svg>',
  cross: '<svg viewBox="0 0 24 24"><path d="M12 3v18M6 9h12"/><circle cx="12" cy="9" r="7" stroke-dasharray="2 3"/></svg>',
  kneel: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.3"/><path d="M12 8v6l-4 2v4M12 14l5 1v5M9 10l3 1 3-1"/></svg>',
  candle: '<svg viewBox="0 0 24 24"><path d="M12 3c1.6 1.8 1.6 3.6 0 5-1.6-1.4-1.6-3.2 0-5zM9.5 10h5v10h-5zM7 20h10"/></svg>',
  nod: '<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="2.5"/><path d="M8 21v-6a4 4 0 0 1 8 0v6M12 11v3"/></svg>',
  work: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="11" rx="1"/><path d="M9 20h6M12 15v5"/></svg>',
  coffee: '<svg viewBox="0 0 24 24"><path d="M5 9h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 11h2a2 2 0 0 1 0 4h-2M9 3v3M12 3v3"/></svg>',
  clap: '<svg viewBox="0 0 24 24"><path d="M8 13 5 10a1.5 1.5 0 0 1 2-2l4 4M10 9 7.5 6.5a1.5 1.5 0 0 1 2-2l5 5c2 2 2 5 0 7l-1 1c-2 2-5 2-7 0l-3-3"/><path d="M16 3l1-2M19 5l2-1M19 9h2"/></svg>',
  seat: '<svg viewBox="0 0 24 24"><path d="M6 12V5M18 12V5M5 12h14v3H5zM7 15v5M17 15v5"/></svg>',
};

const PLACES = {
  temple: {
    label: '절', title: '산사', loading: '법당을 여는 중', sub: '목탁 소리 고요한 산사 법당',
    halls: ['청연당', '무량전', '설선당', '보광전', '적묵당'], listen: '염불 듣기', seatWord: '방석',
    style: 'monk', range: [34, 58],
    actions: [
      { id: 'gassho', label: '합장', icon: 'gassho', msg: '합장으로 인사했어요', bubble: '합장' },
      { id: 'bow', label: '절하기', icon: 'bow', msg: '삼배를 올렸어요', bubble: '삼배', needSeat: true, busy: '방석으로 가는 중' },
      { id: 'beads', label: '염주', icon: 'beads', msg: '염주를 돌리고 있어요', bubble: '염주', needSeat: true, busy: '방석으로 가는 중' },
    ],
    enter: '법당에 들어왔어요', leave: '조용히 법당을 나섰어요',
    status: { seated: '방석에 앉아 있음', walking: '걷는 중', gassho: '합장 중', bow: '절하는 중', beads: '염주 돌리는 중' },
  },
  church: {
    label: '교회', title: '예배당', loading: '예배당 문을 여는 중', sub: '햇살이 드는 작은 예배당',
    halls: ['은혜홀', '소망홀', '사랑채', '빛누리홀', '샘터홀'], listen: '찬송 듣기', seatWord: '자리',
    style: 'casual', range: [30, 56],
    actions: [
      { id: 'pray', label: '기도', icon: 'pray', msg: '두 손 모아 기도했어요', bubble: '기도' },
      { id: 'praise', label: '찬양', icon: 'praise', msg: '손을 들고 찬양했어요', bubble: '찬양' },
      { id: 'amen', label: '아멘', icon: 'amen', msg: '아멘으로 화답했어요', bubble: '아멘' },
      { id: 'sit', label: '자리로', icon: 'seat', msg: '자리에 앉았어요', needSeat: true, busy: '자리로 가는 중', quiet: true },
    ],
    enter: '예배당에 들어왔어요', leave: '예배당을 나섰어요',
    status: { seated: '자리에 앉아 있음', walking: '걷는 중', pray: '기도 중', praise: '찬양 중', amen: '아멘', sit: '앉는 중' },
  },
  cathedral: {
    label: '성당', title: '대성당', loading: '성당 문을 여는 중', sub: '스테인드글라스 빛이 내리는 성당',
    halls: ['성모홀', '평화방', '은총방', '미카엘방', '요셉방'], listen: '성가 듣기', seatWord: '자리',
    style: 'formal', range: [32, 60],
    actions: [
      { id: 'cross', label: '성호', icon: 'cross', msg: '성호를 그었어요', bubble: '성호' },
      { id: 'kneel', label: '무릎 꿇기', icon: 'kneel', msg: '무릎 꿇고 기도했어요', bubble: '묵상', needSeat: true, busy: '자리로 가는 중' },
      { id: 'candle', label: '초 봉헌', icon: 'candle', msg: '초를 봉헌했어요', bubble: '봉헌', busy: '봉헌대로 가는 중' },
    ],
    enter: '성당에 들어왔어요', leave: '성당을 나섰어요',
    status: { seated: '자리에 앉아 있음', walking: '걷는 중', cross: '성호 긋는 중', kneel: '무릎 꿇고 기도 중', candle: '초 봉헌 중' },
  },
  ohc: {
    label: 'Company', title: 'Company 로비', loading: '로비 문을 여는 중', sub: '사옥 로비와 앞 거리',
    halls: ['로비'], listen: '로비 음악', seatWord: '자리',
    style: 'office', range: [14, 24],
    actions: [
      { id: 'nod', label: '목례', icon: 'nod', msg: '목례로 인사했어요', bubble: '안녕하세요' },
      { id: 'coffee', label: '커피', icon: 'coffee', msg: '일마지오에서 커피 한 잔 하고 있어요', bubble: '커피' },
      { id: 'clap', label: '박수', icon: 'clap', msg: '박수를 쳤어요', bubble: '짝짝' },
      { id: 'sit', label: '자리로', icon: 'seat', msg: '자리에 앉았어요', needSeat: true, busy: '자리로 가는 중', quiet: true },
    ],
    enter: '로비에 들어왔어요', leave: '로비를 나섰어요',
    status: { seated: '로비에 머무는 중', walking: '걷는 중', nod: '인사 중', coffee: '커피 타임', clap: '박수', sit: '앉는 중' },
  },
};
const ORDER = ['temple', 'church', 'cathedral', 'ohc'];

/* ───────── 렌더러·장면 ───────── */
const canvas = $('#view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
let quality = 'mid';
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 600);
function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

// 금속 반사를 위한 간이 환경맵
(function makeEnv() {
  const pm = new THREE.PMREMGenerator(renderer);
  const es = new THREE.Scene();
  es.background = new THREE.Color(0x6b6256);
  const lm = (c) => new THREE.MeshBasicMaterial({ color: c, side: THREE.BackSide });
  const room = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 20), lm(0x8a7e6e)); es.add(room);
  const add = (w, h, x, y, z, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); };
  add(8, 3, 0, 4.9, 0, 0xffffff); add(4, 6, 9.9, 1, 0, 0xfff1d6); add(4, 6, -9.9, 1, 0, 0xd8e4ff); add(6, 4, 0, 1, 9.9, 0xffe2b0);
  scene.environment = pm.fromScene(es, 0.04).texture;
})();

/* ───────── 텍스처 ───────── */
function canvasTex(w, h, draw, repeat, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  t.anisotropy = 8;
  return t;
}
const rgb = (r, g, b, a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;
function woodTex(base, rep, plankRows = 8) {
  return canvasTex(512, 512, (g, w, h) => {
    const r0 = mulberry32(7);
    for (let i = 0; i < plankRows; i++) {
      const y = i * h / plankRows, ph = h / plankRows, d = (r0() - .5) * 26;
      g.fillStyle = rgb(base[0] + d, base[1] + d * .8, base[2] + d * .6); g.fillRect(0, y, w, ph);
      for (let k = 0; k < 22; k++) {
        g.strokeStyle = rgb(base[0] * .55, base[1] * .5, base[2] * .45, .07 + r0() * .1); g.lineWidth = 1 + r0() * 1.5;
        g.beginPath(); const yy = y + r0() * ph; g.moveTo(0, yy);
        for (let x = 0; x <= w; x += 32) g.lineTo(x, yy + Math.sin(x * .015 + k * 3) * 2.2);
        g.stroke();
      }
      g.fillStyle = rgb(base[0] * .4, base[1] * .38, base[2] * .35, .7); g.fillRect(0, y, w, 2);
      const off = (i % 2 ? .5 : 0) * w + r0() * 60; g.fillRect(off % w, y, 2, ph); g.fillRect((off + w / 2) % w, y, 2, ph);
    }
  }, rep);
}
function plasterTex(base, rep) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = rgb(...base); g.fillRect(0, 0, w, h);
    const r0 = mulberry32(3);
    for (let i = 0; i < 1800; i++) { const v = (r0() - .5) * 18; g.fillStyle = rgb(base[0] + v, base[1] + v, base[2] + v, .35); g.fillRect(r0() * w, r0() * h, 2, 2); }
  }, rep);
}
function muralTex() {
  return canvasTex(1024, 560, (g, w, h) => {
    const r0 = mulberry32(11);
    g.fillStyle = '#5b1d17'; g.fillRect(0, 0, w, h);
    // 구름·꽃 무늬
    for (let i = 0; i < 260; i++) {
      const x = r0() * w, y = r0() * h, s = 6 + r0() * 22;
      g.fillStyle = pick(['#2f6b55', '#a0372b', '#c8923d', '#33507a', '#7a2a22', '#3d7d68'], r0); g.globalAlpha = .55;
      g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
    const fig = (cx, cy, sc, robe) => {
      // 광배
      for (let k = 6; k > 0; k--) { g.fillStyle = k % 2 ? '#c99a3e' : '#2f6b55'; g.beginPath(); g.ellipse(cx, cy - 40 * sc, 92 * sc * k / 6 + 20 * sc, 120 * sc * k / 6 + 26 * sc, 0, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#e6b34f'; g.beginPath(); g.arc(cx, cy - 120 * sc, 46 * sc, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#f0c78a'; g.beginPath(); g.arc(cx, cy - 120 * sc, 26 * sc, 0, Math.PI * 2); g.fill();
      g.fillStyle = robe; g.beginPath(); g.moveTo(cx - 58 * sc, cy + 120 * sc); g.quadraticCurveTo(cx - 70 * sc, cy - 60 * sc, cx, cy - 92 * sc);
      g.quadraticCurveTo(cx + 70 * sc, cy - 60 * sc, cx + 58 * sc, cy + 120 * sc); g.fill();
      g.strokeStyle = '#e8c169'; g.lineWidth = 3 * sc; g.stroke();
    };
    fig(w * .2, h * .52, 1.05, '#2c5f8f'); fig(w * .8, h * .52, 1.05, '#2f6b55');
    // 가운데 큰 광배(불상 뒤)
    for (let k = 8; k > 0; k--) { g.fillStyle = ['#c99a3e', '#8f2a20', '#2f6b55', '#d6ad55'][k % 4]; g.beginPath(); g.ellipse(w / 2, h * .5, 60 + k * 26, 80 + k * 30, 0, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = '#d9b25a'; g.lineWidth = 14; g.strokeRect(7, 7, w - 14, h - 14);
    g.strokeStyle = '#2f6b55'; g.lineWidth = 6; g.strokeRect(20, 20, w - 40, h - 40);
  });
}
function sceneryTex(kind) {
  return canvasTex(1024, 512, (g, w, h) => {
    const r0 = mulberry32(kind === 'city' ? 5 : 9);
    const sky = g.createLinearGradient(0, 0, 0, h);
    if (kind === 'city') { sky.addColorStop(0, '#dfeaf2'); sky.addColorStop(1, '#f4f6f6'); }
    else { sky.addColorStop(0, '#cfe0e8'); sky.addColorStop(.6, '#eef0e6'); sky.addColorStop(1, '#e3e8d6'); }
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    if (kind === 'city') {
      for (let i = 0; i < 40; i++) { const bw = 30 + r0() * 70, bh = 80 + r0() * 260, x = r0() * w; g.fillStyle = rgb(170 + r0() * 40, 180 + r0() * 30, 190 + r0() * 30, .8); g.fillRect(x, h - bh, bw, bh);
        g.fillStyle = 'rgba(255,255,255,.35)'; for (let y = h - bh + 8; y < h - 10; y += 14) g.fillRect(x + 4, y, bw - 8, 4); }
      g.fillStyle = '#6f9a6a'; for (let i = 0; i < 30; i++) { g.beginPath(); g.arc(r0() * w, h - 10, 20 + r0() * 30, 0, Math.PI * 2); g.fill(); }
      return;
    }
    const ridge = (base, amp, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 16) g.lineTo(x, base - Math.sin(x * .006 + amp) * amp - Math.sin(x * .021) * amp * .3); g.lineTo(w, h); g.fill(); };
    ridge(h * .45, 40, '#a8bcb6'); ridge(h * .58, 30, '#7f9c88'); ridge(h * .7, 18, '#5f8065');
    for (let i = 0; i < 90; i++) { const x = r0() * w, y = h * .62 + r0() * h * .4, s = 14 + r0() * 30; g.fillStyle = pick(['#2f5a3c', '#3b6b46', '#46784d', '#284d33'], r0);
      g.beginPath(); g.moveTo(x, y - s * 2.2); g.lineTo(x - s, y); g.lineTo(x + s, y); g.fill(); }
  });
}
function stainedTex(seed, rose = false) {
  return canvasTex(rose ? 512 : 256, 512, (g, w, h) => {
    const r0 = mulberry32(seed);
    const pal = ['#1d3f9e', '#b3122b', '#1f7a4a', '#d9a420', '#6a2a8f', '#2a6fc0', '#e46a1c'];
    g.fillStyle = '#141414'; g.fillRect(0, 0, w, h);
    if (rose) {
      const cx = w / 2, cy = h / 2, R = w / 2 - 6;
      for (let ring = 0; ring < 4; ring++) {
        const n = 8 + ring * 8, r1 = R * ring / 4, r2 = R * (ring + 1) / 4;
        for (let i = 0; i < n; i++) {
          const a1 = i / n * Math.PI * 2, a2 = (i + 1) / n * Math.PI * 2;
          g.fillStyle = pick(pal, r0); g.beginPath(); g.arc(cx, cy, r2 - 3, a1 + .02, a2 - .02); g.arc(cx, cy, r1 + 3, a2 - .02, a1 + .02, true); g.fill();
        }
      }
      return;
    }
    const cols = 4, rows = 9, cw = w / cols, ch = h / rows;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      g.fillStyle = pick(pal, r0); const j = () => (r0() - .5) * 8;
      g.beginPath(); g.moveTo(x * cw + 3 + j(), y * ch + 3 + j()); g.lineTo((x + 1) * cw - 3 + j(), y * ch + 3 + j()); g.lineTo((x + 1) * cw - 3 + j(), (y + 1) * ch - 3 + j()); g.lineTo(x * cw + 3 + j(), (y + 1) * ch - 3 + j()); g.fill();
    }
    // 가운데 인물 실루엣
    g.fillStyle = '#e9d9a8'; g.beginPath(); g.arc(w / 2, h * .3, w * .14, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#f5f0e0'; g.beginPath(); g.arc(w / 2, h * .3, w * .08, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#7c1424'; g.beginPath(); g.moveTo(w * .3, h * .85); g.lineTo(w / 2, h * .38); g.lineTo(w * .7, h * .85); g.fill();
  });
}
function textTex(lines, opt = {}) {
  const { w = 1024, h = 256, bg = null, color = '#333', font = '700 120px sans-serif', align = 'center' } = opt;
  return canvasTex(w, h, (g) => {
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
    g.fillStyle = color; g.textAlign = align; g.textBaseline = 'middle';
    lines.forEach((l, i) => { g.font = l.font || font; g.fillStyle = l.color || color; g.fillText(l.t, l.x ?? (align === 'center' ? w / 2 : 40), l.y ?? h / 2); });
  });
}
function checkerTex() {
  return canvasTex(512, 512, (g, w, h) => {
    const n = 4, s = w / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      g.fillStyle = (x + y) % 2 ? '#d9d2c4' : '#8e8576'; g.fillRect(x * s, y * s, s, s);
      g.strokeStyle = 'rgba(255,255,255,.12)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x * s + Math.random() * s, y * s); g.bezierCurveTo(x * s + Math.random() * s, y * s + s / 2, x * s + Math.random() * s, y * s + s / 2, x * s + Math.random() * s, y * s + s); g.stroke(); }
    }
  }, [10, 18]);
}
function panelTextTex() {
  return canvasTex(256, 384, (g, w, h) => {
    g.fillStyle = '#1d1c1b'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#d9d4c8'; g.font = '700 22px sans-serif'; g.fillText('20' + (10 + Math.floor(Math.random() * 15)), 18, 40);
    g.fillStyle = 'rgba(220,214,200,.55)'; for (let y = 64; y < h - 20; y += 12) g.fillRect(18, y, 120 + Math.random() * 90, 4);
  });
}
function screenTex(kind) {
  return canvasTex(256, 160, (g, w, h) => {
    g.fillStyle = kind === 'code' ? '#14202b' : '#eaf2f8'; g.fillRect(0, 0, w, h);
    if (kind === 'code') { for (let y = 12; y < h; y += 10) { g.fillStyle = pick(['#6fc3df', '#c3e88d', '#f78c6c', '#82aaff']); g.fillRect(10 + Math.random() * 30, y, 40 + Math.random() * 140, 4); } }
    else { g.fillStyle = '#2a7fc0'; g.fillRect(0, 0, w, 18); g.strokeStyle = '#e04a4a'; g.lineWidth = 3; g.beginPath(); for (let x = 10; x < w - 10; x += 12) g.lineTo(x, 100 - Math.sin(x * .05) * 30 - Math.random() * 10); g.stroke();
      g.fillStyle = '#9db9cc'; for (let i = 0; i < 8; i++) g.fillRect(14 + i * 28, 130 - i * 4, 16, 20 + i * 4); }
  });
}

/* ───────── 재질 캐시 ───────── */
const matCache = new Map();
function mat(color, o = {}) {
  const key = color + JSON.stringify(o);
  if (matCache.has(key)) return matCache.get(key);
  const m = new THREE.MeshStandardMaterial({ color, roughness: o.r ?? .8, metalness: o.m ?? 0, ...(o.extra || {}) });
  if (o.e) { m.emissive = new THREE.Color(o.e); m.emissiveIntensity = o.ei ?? 1; }
  if (o.t != null) { m.transparent = true; m.opacity = o.t; m.depthWrite = false; }
  matCache.set(key, m); return m;
}
const basic = (o) => new THREE.MeshBasicMaterial(o);

/* ───────── 도형 도우미 ───────── */
function add(parent, geo, m, x = 0, y = 0, z = 0, cast = true) { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.castShadow = cast; me.receiveShadow = true; parent.add(me); return me; }
const box = (p, w, h, d, m, x, y, z, cast) => add(p, new THREE.BoxGeometry(w, h, d), m, x, y, z, cast);
const cyl = (p, rt, rb, h, m, x, y, z, seg = 18, cast) => add(p, new THREE.CylinderGeometry(rt, rb, h, seg), m, x, y, z, cast);
const sph = (p, r, m, x, y, z, cast) => add(p, new THREE.SphereGeometry(r, 18, 14), m, x, y, z, cast);
function plane(p, w, h, m, x, y, z, ry = 0, rx = 0) { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.position.set(x, y, z); me.rotation.set(rx, ry, 0); me.receiveShadow = true; p.add(me); return me; }

/* ───────── 아바타 ───────── */
const G = {
  body: new THREE.CylinderGeometry(.19, .25, .5, 14), skirt: new THREE.CylinderGeometry(.25, .33, .36, 14), coat: new THREE.CylinderGeometry(.24, .31, .55, 14),
  head: new THREE.SphereGeometry(.3, 20, 16), hair: new THREE.SphereGeometry(.315, 20, 12, 0, Math.PI * 2, 0, Math.PI * .52),
  longhair: new THREE.CylinderGeometry(.24, .28, .42, 14, 1, true, Math.PI * .6, Math.PI * 1.8), hood: new THREE.SphereGeometry(.335, 18, 14),
  veil: new THREE.SphereGeometry(.33, 18, 12, 0, Math.PI * 2, 0, Math.PI * .62), eye: new THREE.SphereGeometry(.028, 8, 6),
  arm: new THREE.CylinderGeometry(.068, .062, .36, 10), hand: new THREE.SphereGeometry(.068, 10, 8), leg: new THREE.CylinderGeometry(.085, .078, .4, 10),
  foot: new THREE.BoxGeometry(.13, .07, .2), sash: new THREE.BoxGeometry(.3, .44, .04), mask: new THREE.BoxGeometry(.26, .12, .05),
  cup: new THREE.CylinderGeometry(.045, .04, .1, 10), bead: new THREE.TorusGeometry(.09, .02, 6, 16), card: new THREE.BoxGeometry(.07, .1, .01),
};
const SKIN = ['#e9b48c', '#f1c7a4', '#d9a07a', '#e3ab83'];
const HAIR = ['#2a211c', '#3b2c22', '#1b1714', '#5a4030', '#4a3a2e'];
function makeAvatar(style, r = rnd, isMe = false) {
  const root = new THREE.Group();
  const hips = new THREE.Group(); root.add(hips);
  const torso = new THREE.Group(); hips.add(torso);
  const headG = new THREE.Group(); headG.position.y = .55; torso.add(headG);
  const skin = mat(style === 'monk' ? '#dc8f5e' : pick(SKIN, r), { r: .7 });
  let top, bottom, hairC = pick(HAIR, r);
  const extras = {};
  if (style === 'monk') { top = '#cfd3cd'; bottom = '#cfd3cd'; }
  else if (style === 'casual') { top = pick(['#f2efe8', '#8fb3d9', '#e7c7c0', '#a9c4a0', '#f0d9a0', '#7d8fa8', '#d9d0e8', '#c46a5a'], r); bottom = pick(['#3d4452', '#2f3138', '#6b5a48', '#47566b'], r); }
  else if (style === 'formal') { top = pick(['#2e3445', '#4a3b32', '#555b62', '#2a2a2e', '#6b4f45', '#3c4a3e'], r); bottom = pick(['#24262c', '#32302e', '#3a3d44'], r); }
  else if (style === 'labcoat') { top = '#f6f7f8'; bottom = pick(['#3a4150', '#2c3240', '#55606e'], r); }
  else if (style === 'clean') { top = '#f2f4f6'; bottom = '#f2f4f6'; }
  else { top = pick(['#cfe0f2', '#f4f6f8', '#e8eef5', '#9fb7d3', '#dfe6ec', '#2e3a4f', '#ffffff'], r); bottom = pick(['#2e3a4f', '#3b3f46', '#585e66', '#1f2530'], r); }
  if (isMe && style !== 'monk' && style !== 'clean') top = { casual: '#e8c86a', formal: '#5b3d6b', office: '#9fc7e8' }[style] || top;
  const topM = mat(top, { r: .85 }), botM = mat(bottom, { r: .85 });
  add(torso, G.body, topM, 0, .25, 0);
  if (style === 'monk' || style === 'clean') add(torso, G.skirt, topM, 0, -.02, 0);
  if (style === 'labcoat') add(torso, G.coat, topM, 0, .1, 0);
  if (style === 'monk') { const s = add(torso, G.sash, mat('#ecd27c', { r: .8 }), .03, .27, .2); s.rotation.set(.12, 0, -.45); }
  if (style === 'office' || style === 'labcoat') { add(torso, G.card, mat('#ffffff'), .07, .22, .245); }
  add(headG, G.head, skin, 0, .26, 0);
  const eyeM = mat('#221a15', { r: .4 });
  add(headG, G.eye, eyeM, .1, .28, .275, false); add(headG, G.eye, eyeM, -.1, .28, .275, false);
  if (style === 'clean') { add(headG, G.hood, mat('#f2f4f6'), 0, .28, -.04); add(headG, G.mask, mat('#bcd3e6'), 0, .19, .27, false); }
  else if (style !== 'monk') {
    const veil = style === 'formal' && r() < .3;
    if (veil) add(headG, G.veil, mat('#f4f1ea', { r: .9 }), 0, .27, -.01);
    else {
      const hm = mat(hairC, { r: .9 });
      const hh = add(headG, G.hair, hm, 0, .29, -.02); hh.rotation.x = -.25;
      if (r() < .45) add(headG, G.longhair, hm, 0, .12, -.03);
    }
  }
  const armA = new THREE.Group(); armA.position.set(.25, .46, 0); torso.add(armA);
  const armB = new THREE.Group(); armB.position.set(-.25, .46, 0); torso.add(armB);
  for (const a of [armA, armB]) { add(a, G.arm, topM, 0, -.18, 0); add(a, G.hand, skin, 0, -.38, 0); }
  const legA = new THREE.Group(); legA.position.set(.11, 0, 0); hips.add(legA);
  const legB = new THREE.Group(); legB.position.set(-.11, 0, 0); hips.add(legB);
  const shoe = mat(style === 'monk' ? '#f1ece0' : style === 'clean' ? '#dfe6ec' : '#2a2724');
  for (const l of [legA, legB]) { add(l, G.leg, botM, 0, -.2, 0); add(l, G.foot, shoe, 0, -.42, .04); }
  // 소품
  const cup = add(armA, G.cup, mat('#ffffff', { r: .4 }), 0, -.44, .06); cup.visible = false; extras.cup = cup;
  const beads = add(armB, G.bead, mat('#5a2e1c', { r: .5 }), 0, -.46, .02); beads.rotation.x = Math.PI / 2; beads.visible = false; extras.beads = beads;
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; } });
  return { root, hips, torso, headG, armA, armB, legA, legB, extras };
}

// 자세: hy 엉덩이 높이, tx 몸 숙임, hx 고개, la/lb 다리, ax/az 팔A(+x쪽), bx/bz 팔B(-x쪽)
const P = (o) => Object.assign({ hy: .45, tx: 0, hx: 0, la: 0, lb: 0, ax: 0, az: .08, bx: 0, bz: -.08 }, o);
const POSE = {
  stand: P({}),
  floor: P({ hy: .14, la: -1.5, lb: -1.5, ax: -.55, az: -.3, bx: -.55, bz: .3 }),
  chair: P({ hy: .52, la: -1.45, lb: -1.45, ax: -.5, az: -.15, bx: -.5, bz: .15 }),
  stool: P({ hy: .66, la: -1.2, lb: -1.2, ax: -.6, az: -.15, bx: -.6, bz: .15 }),
  kneel: P({ hy: .3, la: .75, lb: .75, ax: -1.05, az: -.62, bx: -1.05, bz: .62, hx: .3 }),
  gassho: P({ ax: -1.05, az: -.62, bx: -1.05, bz: .62 }),
  floorGassho: P({ hy: .14, la: -1.5, lb: -1.5, ax: -1.05, az: -.62, bx: -1.05, bz: .62 }),
  halfBow: P({ tx: .55, hx: .2, ax: -1.05, az: -.62, bx: -1.05, bz: .62 }),
  bowKneel: P({ hy: .3, la: .75, lb: .75, ax: -1.05, az: -.62, bx: -1.05, bz: .62 }),
  bowDown: P({ hy: .26, la: .85, lb: .85, tx: 1.3, hx: .25, ax: -1.75, az: -.12, bx: -1.75, bz: .12 }),
  pray: P({ ax: -1.0, az: -.6, bx: -1.0, bz: .6, hx: .35 }),
  chairPray: P({ hy: .52, la: -1.45, lb: -1.45, ax: -1.0, az: -.6, bx: -1.0, bz: .6, hx: .35, tx: .1 }),
  praise: P({ ax: -2.75, az: .3, bx: -2.75, bz: -.3, hx: -.2 }),
  amen: P({ hx: .35, ax: -.3, bx: -.3 }),
  crossHead: P({ bx: -2.55, bz: .55 }), crossChest: P({ bx: -1.35, bz: .62 }), crossL: P({ bx: -1.75, bz: .98 }), crossR: P({ bx: -1.8, bz: .22 }),
  nod: P({ tx: .35, hx: .25 }),
  type: P({ hy: .52, la: -1.45, lb: -1.45, ax: -1.25, az: -.15, bx: -1.25, bz: .15, hx: .12 }),
  typeStool: P({ hy: .66, la: -1.2, lb: -1.2, ax: -1.2, az: -.15, bx: -1.2, bz: .15, hx: .15 }),
  standWork: P({ ax: -1.1, az: -.15, bx: -1.1, bz: .15, hx: .2 }),
  cupUp: P({ ax: -2.15, az: -.55 }), cupDown: P({ ax: -1.1, az: -.2 }),
  clapOpen: P({ ax: -1.15, az: -.3, bx: -1.15, bz: .3 }), clapShut: P({ ax: -1.15, az: -.66, bx: -1.15, bz: .66 }),
  beads: P({ hy: .14, la: -1.5, lb: -1.5, ax: -1.0, az: -.5, bx: -1.05, bz: .45, hx: .2 }),
  candleReach: P({ bx: -1.3, bz: .05, tx: .15 }),
  bench: P({ hy: .44, la: -1.45, lb: -1.45, ax: -.45, az: -.2, bx: -.45, bz: .2 }),
  look: P({ hx: .08, ax: -.15, az: -.1, bx: -.15, bz: .1, tx: .04 }),
};
const SIT_POSE = { floor: 'floor', chair: 'chair', stool: 'stool', stand: 'standWork', pew: 'chair', bench: 'bench', sofa: 'bench', look: 'look' };

class Person {
  constructor(name, style, r = rnd, isMe = false) {
    this.name = name; this.style = style; this.isMe = isMe;
    this.a = makeAvatar(style, r, isMe);
    this.root = this.a.root;
    this.cur = { ...POSE.stand }; this.target = POSE.stand;
    this.path = []; this.speed = isMe ? 2.4 : rr(1.1, 1.6, r);
    this.seat = null; this.seq = null; this.state = 'idle'; this.act = null; this.walkPhase = r() * 10;
    this.think = rr(4, 20, r); this.life = rr(90, 400, r); this.onArrive = null; this.fade = 1;
  }
  setPose(p) { this.target = typeof p === 'string' ? POSE[p] : p; }
  restPose() { if (this.seat) return SIT_POSE[this.seat.kind] || 'stand'; return 'stand'; }
  goTo(points, onArrive) { this.path = points.map((p) => new THREE.Vector3(p.x, 0, p.z)); this.onArrive = onArrive || null; this.seq = null; this.showProp(null); }
  run(steps, done) { this.seq = { steps, i: 0, t: 0, done }; this.path = []; }
  showProp(name) { this.a.extras.cup.visible = name === 'cup'; this.a.extras.beads.visible = name === 'beads'; }
  update(dt, t) {
    const a = this.a;
    let walking = false;
    if (this.path.length) {
      const p = this.path[0], pos = this.root.position;
      const dx = p.x - pos.x, dz = p.z - pos.z, d = Math.hypot(dx, dz);
      if (d < .06) { this.path.shift(); if (!this.path.length) { const cb = this.onArrive; this.onArrive = null; cb && cb(); } }
      else {
        const s = Math.min(d, this.speed * dt), nx = pos.x + dx / d * s, nz = pos.z + dz / d * s;
        if (this.isMe && world && world.blocked && world.blocked(nx, nz)) { this.path = []; this.onArrive = null; }
        else { pos.x = nx; pos.z = nz; }
        const want = Math.atan2(dx, dz); let diff = want - this.root.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        this.root.rotation.y += diff * Math.min(1, dt * 10); walking = true;
      }
    }
    if (this.extWalk) { walking = true; this.extWalk = false; }
    if (this.seq) {
      const sq = this.seq, st = sq.steps[sq.i];
      if (sq.t === 0 && st) { if (st.pose) this.setPose(st.pose); st.fn && st.fn(this); }
      sq.t += dt;
      if (!st || sq.t >= (st.d ?? .5)) { sq.i++; sq.t = 0; if (sq.i >= sq.steps.length) { const done = sq.done; this.seq = null; done && done(this); } }
    }
    const tg = walking ? POSE.stand : this.target, k = Math.min(1, dt * (this.seq ? 6 : 5));
    for (const key in tg) this.cur[key] = lerp(this.cur[key], tg[key], k);
    const c = this.cur;
    let swing = 0, bob = 0;
    if (walking) { this.walkPhase += dt * this.speed * 4.2; swing = Math.sin(this.walkPhase) * .55; bob = Math.abs(Math.cos(this.walkPhase)) * .035; }
    const breathe = Math.sin(t * 1.6 + this.walkPhase) * .012;
    a.hips.position.y = c.hy + bob; a.torso.rotation.x = c.tx; a.headG.rotation.x = c.hx + breathe;
    a.legA.rotation.x = c.la + swing; a.legB.rotation.x = c.lb - swing;
    a.armA.rotation.set(c.ax - swing * .7, 0, c.az); a.armB.rotation.set(c.bx + swing * .7, 0, c.bz);
    a.torso.position.y = breathe;
  }
}

/* ───────── 장소 짓기 ───────── */
let world = null; // { group, seats, door, bounds, extras }
function disposeGroup(g) { g.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach((m) => { if (![...matCache.values()].includes(m)) { m.map && m.map.dispose(); m.emissiveMap && m.emissiveMap.dispose(); m.dispose(); } }); } }); }
function sun(g, color, inten, pos, target, size) {
  const l = new THREE.DirectionalLight(color, inten); l.position.set(...pos); l.target.position.set(...target);
  l.castShadow = true; l.shadow.mapSize.set(quality === 'high' ? 4096 : 2048, quality === 'high' ? 4096 : 2048);
  const s = l.shadow.camera; s.left = -size; s.right = size; s.top = size; s.bottom = -size; s.near = 1; s.far = 120; l.shadow.bias = -.0004; l.shadow.normalBias = .03;
  g.add(l); g.add(l.target); return l;
}

function buildTemple() {
  const g = new THREE.Group(), W = 26, L = 38, H = 11;
  plane(g, W, L, new THREE.MeshStandardMaterial({ map: woodTex([92, 58, 38], [3, 5]), roughness: .55 }), 0, 0, 0, 0, -Math.PI / 2);
  const plaster = new THREE.MeshStandardMaterial({ map: plasterTex([226, 214, 192], [4, 2]), roughness: .95 });
  const darkWood = mat('#4a2418', { r: .7 }), redWood = mat('#5d2a1d', { r: .65 }), green = mat('#2f6b55', { r: .7 }), gold = mat('#d2a53c', { r: .28, m: .9 });
  // 뒷벽과 탱화
  box(g, W, H, .4, plaster, 0, H / 2, -L / 2 - .2);
  plane(g, 16, 8.4, new THREE.MeshStandardMaterial({ map: muralTex(), roughness: .9 }), 0, 5.6, -L / 2 + .02);
  // 옆벽: 아래 회벽, 위 창, 바깥 풍경
  const scen = basic({ map: sceneryTex('mountain') });
  for (const sx of [-1, 1]) {
    box(g, .5, 2.4, L, plaster, sx * W / 2, 1.2, 0);
    box(g, .7, .5, L, darkWood, sx * W / 2, 2.6, 0);
    box(g, .5, H - 7.2, L, plaster, sx * W / 2, 7.2 + (H - 7.2) / 2, 0);
    box(g, .7, .4, L, darkWood, sx * W / 2, 7.1, 0);
    for (let z = -L / 2 + 3; z < L / 2; z += 3.2) box(g, .35, 4.4, .25, darkWood, sx * W / 2, 4.9, z);
    for (let z = -L / 2 + 1; z < L / 2; z += .9) box(g, .1, 4.4, .05, darkWood, sx * (W / 2 - .05), 4.9, z, false);
    for (let y = 3.4; y < 7; y += .9) box(g, .1, .05, L, darkWood, sx * (W / 2 - .05), y, 0, false);
    plane(g, L + 20, 16, scen, sx * (W / 2 + 9), 5, 0, -sx * Math.PI / 2);
  }
  // 앞쪽(문)
  for (const sx of [-1, 1]) box(g, W / 2 - 3, H, .4, plaster, sx * (W / 4 + 1.5), H / 2, L / 2 + .2);
  box(g, 6, H - 6, .4, plaster, 0, 6 + (H - 6) / 2, L / 2 + .2);
  plane(g, 30, 16, scen, 0, 5, L / 2 + 10, Math.PI);
  // 기둥
  for (const sx of [-1, 1]) for (let z = -15; z <= 15; z += 6) {
    cyl(g, .5, .56, H, redWood, sx * 8.6, H / 2, z, 20);
    cyl(g, .85, .95, .5, mat('#8a8578', { r: .9 }), sx * 8.6, .25, z, 20);
  }
  // 천장과 대들보(단청)
  plane(g, W, L, mat('#3b2117', { r: .9 }), 0, H, 0, 0, Math.PI / 2);
  for (let z = -15; z <= 15; z += 6) { box(g, W, .7, .6, redWood, 0, H - .5, z); box(g, W, .18, .64, green, 0, H - .95, z, false); }
  for (const sx of [-1, 1]) { box(g, .6, .7, L, redWood, sx * 8.6, H - .5, 0); box(g, .64, .18, L, green, sx * 8.6, H - .95, 0, false); }
  for (let x = -W / 2 + 1; x < W / 2; x += 1.1) box(g, .16, .16, L, darkWood, x, H - .1, 0, false);
  // 불단과 불상
  box(g, 12, .9, 4.6, redWood, 0, .45, -L / 2 + 3.2);
  box(g, 12.2, .12, 4.8, gold, 0, .92, -L / 2 + 3.2);
  const bud = new THREE.Group(); bud.position.set(0, .98, -L / 2 + 3); g.add(bud);
  cyl(bud, 1.7, 1.5, .55, gold, 0, .28, 0, 32);
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; const pet = add(bud, new THREE.SphereGeometry(.42, 12, 8), gold, Math.cos(a) * 1.55, .45, Math.sin(a) * 1.55); pet.scale.set(.7, .5, 1.1); pet.rotation.y = -a; }
  const lap = add(bud, new THREE.SphereGeometry(1, 24, 16), gold, 0, .95, .15); lap.scale.set(1.45, .45, 1.05);
  cyl(bud, .62, .95, 1.75, gold, 0, 1.95, 0, 28);
  sph(bud, .62, gold, 0, 3.25, .02); sph(bud, .25, gold, 0, 3.85, 0);
  for (const sx of [-1, 1]) { const arm = cyl(bud, .17, .2, 1.2, gold, sx * .78, 2.15, .25, 12); arm.rotation.x = -.5; arm.rotation.z = sx * .25; }
  sph(bud, .2, gold, .2, 1.4, .75); sph(bud, .2, gold, -.25, 1.4, .7);
  const halo = add(bud, new THREE.TorusGeometry(1.25, .06, 8, 48), gold, 0, 3.2, -.55); halo.castShadow = false;
  const halo2 = add(bud, new THREE.CircleGeometry(1.2, 48), mat('#e9c56a', { r: .4, m: .6, e: '#6e4e10', ei: .4 }), 0, 3.2, -.6); halo2.castShadow = false;
  // 촛대·향로
  for (const sx of [-1, 1]) {
    cyl(g, .07, .1, .7, gold, sx * 2.6, 1.3, -L / 2 + 4.8, 10);
    const fl = add(g, new THREE.ConeGeometry(.05, .16, 8), basic({ color: '#ffd27a' }), sx * 2.6, 1.75, -L / 2 + 4.8, false);
    fl.userData.flame = true;
    const pl = new THREE.PointLight('#ffb35c', 3, 7, 2); pl.position.set(sx * 2.6, 1.9, -L / 2 + 4.6); g.add(pl); pl.userData.flicker = true;
    cyl(g, .25, .2, .8, mat('#3e6e6a', { r: .3, m: .2 }), sx * 4.3, 1.3, -L / 2 + 4.8, 14); // 청자 화병
    sph(g, .3, mat('#e7e1d0', { r: .8 }), sx * 4.3, 1.85, -L / 2 + 4.8);
  }
  cyl(g, .32, .25, .3, gold, 0, 1.08, -L / 2 + 5.0, 18);
  // 연등
  const lanternCols = ['#f2a3b3', '#f5d36c', '#9fd0b3', '#f7b77a'];
  for (let z = -12; z <= 12; z += 3) for (const x of [-5, -2, 1, 4]) {
    const c = lanternCols[(Math.abs(x + z) | 0) % 4];
    const ln = sph(g, .28, mat(c, { r: .6, e: c, ei: .55 }), x + .5, 8.1, z, false); ln.scale.y = .8;
    box(g, .01, H - 8.4, .01, mat('#222'), x + .5, 8.1 + (H - 8.1) / 2, z, false);
  }
  // 방석
  const seats = [];
  const cush = mat('#6f766a', { r: .95 }), cushEdge = mat('#4d5249', { r: .95 });
  for (let row = 0; row < 8; row++) for (let col = 0; col < 7; col++) {
    const x = -6 + col * 2, z = -11.4 + row * 2.6;
    box(g, 1.15, .1, 1.15, cush, x, .05, z, false); box(g, 1.25, .04, 1.25, cushEdge, x, .02, z, false);
    seats.push({ x, z, ry: Math.PI, kind: 'floor', approach: { x, z: z + .9 } });
  }
  // 빛
  g.add(new THREE.HemisphereLight('#fff1dc', '#5a3c28', .9));
  sun(g, '#fff0d8', 2.6, [18, 22, 8], [0, 0, 0], 24);
  const front = new THREE.PointLight('#ffc98a', 18, 22, 1.6); front.position.set(0, 6, -L / 2 + 6); g.add(front);
  const fill = new THREE.PointLight('#ffe7c4', 10, 30, 1.6); fill.position.set(0, 8, 6); g.add(fill);
  scene.fog = new THREE.Fog('#d8cbb3', 30, 70); scene.background = new THREE.Color('#d8cbb3');
  return { group: g, seats, door: { x: 0, z: L / 2 - 1.2 }, start: { x: 0, z: 13 }, bounds: { x: W / 2 - 1.2, z0: -L / 2 + 5.6, z1: L / 2 - .8 }, aisleX: 0 };
}

function buildChurch() {
  const g = new THREE.Group(), W = 22, L = 34, H = 9;
  plane(g, W, L, new THREE.MeshStandardMaterial({ map: woodTex([196, 158, 112], [3, 6]), roughness: .5 }), 0, 0, 0, 0, -Math.PI / 2);
  const wall = new THREE.MeshStandardMaterial({ map: plasterTex([242, 238, 230], [4, 2]), roughness: .95 });
  const wood = mat('#8a5a36', { r: .6 }), darkWood = mat('#5b3a24', { r: .6 }), white = mat('#f6f3ec', { r: .9 });
  box(g, W, H, .4, wall, 0, H / 2, -L / 2 - .2);
  for (const sx of [-1, 1]) {
    box(g, .4, H, L, wall, sx * W / 2 + sx * .2, H / 2, 0);
    for (let z = -12; z <= 12; z += 4) {
      const win = plane(g, 1.6, 4.2, mat('#e9f2ff', { e: '#dfeaff', ei: 1.1 }), sx * (W / 2 - .01), 4.4, z, -sx * Math.PI / 2);
      win.castShadow = false;
      box(g, .12, 4.5, .12, white, sx * (W / 2 - .05), 4.4, z, false); box(g, .12, .12, 1.7, white, sx * (W / 2 - .05), 4.4, z, false);
      box(g, .14, .14, 1.9, wood, sx * (W / 2 - .07), 2.25, z, false);
    }
  }
  for (const sx of [-1, 1]) box(g, W / 2 - 2, H, .4, wall, sx * (W / 4 + 1), H / 2, L / 2 + .2);
  box(g, 4, H - 3.6, .4, wall, 0, 3.6 + (H - 3.6) / 2, L / 2 + .2);
  plane(g, 20, 12, basic({ map: sceneryTex('mountain') }), 0, 4, L / 2 + 8, Math.PI);
  // 천장 서까래
  plane(g, W, L, mat('#f4f1ea', { r: .95 }), 0, H, 0, 0, Math.PI / 2);
  for (let z = -L / 2 + 2; z < L / 2; z += 3) box(g, W, .35, .3, darkWood, 0, H - .2, z);
  // 강단
  box(g, W, .6, 6, wood, 0, .3, -L / 2 + 3);
  box(g, W, .05, 6.05, mat('#7a2e2e', { r: .95 }), 0, .62, -L / 2 + 3, false);
  box(g, 1.4, 1.2, .9, darkWood, 0, 1.25, -L / 2 + 4.8); box(g, 1.6, .08, 1, wood, 0, 1.88, -L / 2 + 4.75);
  // 십자가와 뒤 조명
  const glow = plane(g, 5, 7, mat('#fff4dc', { e: '#ffe6b0', ei: .9 }), 0, 5.2, -L / 2 + .02); glow.castShadow = false;
  box(g, .4, 5.4, .25, darkWood, 0, 5.2, -L / 2 + .25); box(g, 2.8, .4, .25, darkWood, 0, 6.3, -L / 2 + .25);
  // 피아노·의자
  box(g, 1.6, 1.0, .7, mat('#141414', { r: .25, m: .2 }), -7.5, 1.1, -L / 2 + 3.5); box(g, 1.6, .05, .9, mat('#f5f5f5'), -7.5, 1.0, -L / 2 + 3.95, false);
  for (let i = 0; i < 6; i++) box(g, .5, .5, .5, mat('#8b2f2f', { r: .9 }), 4 + i * .9, .85, -L / 2 + 2);
  // 화분
  for (const sx of [-1, 1]) { cyl(g, .3, .25, .6, white, sx * 3.2, .9, -L / 2 + 5.5); sph(g, .55, mat('#4f8a4f'), sx * 3.2, 1.6, -L / 2 + 5.5); }
  // 화면
  box(g, 4.2, 2.4, .1, mat('#202428'), 6.5, 5.6, -L / 2 + .3);
  plane(g, 4, 2.2, basic({ map: textTex([{ t: '환영합니다', font: '700 110px sans-serif', y: 110, color: '#fff' }, { t: '평안이 함께하기를', font: '400 56px sans-serif', y: 200, color: '#ddd' }], { h: 300, bg: '#3d5a73' }) }), 6.5, 5.6, -L / 2 + .36);
  // 장의자
  const seats = [];
  for (let row = 0; row < 10; row++) {
    const z = -9 + row * 2.1;
    for (const sx of [-1, 1]) {
      const cx = sx * 4.6;
      box(g, 6.4, .1, .55, wood, cx, .46, z); box(g, 6.4, .7, .08, wood, cx, .85, z + .32);
      for (const ex of [-3.1, 3.1]) box(g, .1, .9, .65, darkWood, cx + ex, .45, z + .05);
      for (const ox of [-2.4, -.8, .8, 2.4]) seats.push({ x: cx + ox, z: z - .05, ry: Math.PI, kind: 'pew', approach: { x: sx * 1.1, z: z - .75 } });
    }
  }
  // 펜던트 조명
  for (let z = -10; z <= 10; z += 5) for (const x of [-5, 0, 5]) {
    box(g, .02, 1.6, .02, mat('#333'), x, H - .8, z, false);
    cyl(g, .25, .45, .35, mat('#fff7e6', { e: '#fff1d0', ei: 1.2 }), x, H - 1.75, z, 16, false);
  }
  g.add(new THREE.HemisphereLight('#ffffff', '#c9b394', 1.4));
  sun(g, '#fff6e6', 2.4, [-16, 18, 6], [0, 0, 0], 22);
  const p1 = new THREE.PointLight('#fff1d6', 14, 26, 1.6); p1.position.set(0, 6, -10); g.add(p1);
  const p2 = new THREE.PointLight('#fff8ec', 10, 26, 1.6); p2.position.set(0, 6, 6); g.add(p2);
  scene.fog = new THREE.Fog('#f3efe6', 34, 80); scene.background = new THREE.Color('#f3efe6');
  return { group: g, seats, door: { x: 0, z: L / 2 - 1 }, start: { x: 0, z: 13.5 }, bounds: { x: W / 2 - 1, z0: -L / 2 + 6.4, z1: L / 2 - .8 }, aisleX: 0 };
}

function buildCathedral() {
  const g = new THREE.Group(), W = 26, L = 46, H = 17, NAVE = 6.5;
  plane(g, W, L, new THREE.MeshStandardMaterial({ map: checkerTex(), roughness: .35, metalness: .05 }), 0, 0, 0, 0, -Math.PI / 2);
  const stone = new THREE.MeshStandardMaterial({ map: plasterTex([186, 176, 160], [6, 3]), roughness: .9 });
  const stoneCol = mat('#b9ae9b', { r: .85 }), gold = mat('#c99a3e', { r: .3, m: .9 }), wood = mat('#4b2f20', { r: .6 }), white = mat('#f3efe6', { r: .7 });
  // 바깥 벽(측랑)과 스테인드글라스
  for (const sx of [-1, 1]) {
    box(g, .6, 9.5, L, stone, sx * (W / 2 + .3), 4.75, 0);
    for (let z = -18; z <= 18; z += 4.5) {
      const tex = stainedTex(100 + z * 3 + sx * 7);
      const win = plane(g, 1.7, 5, new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 1.3, roughness: 1 }), sx * (W / 2 - .01), 4.6, z, -sx * Math.PI / 2);
      win.castShadow = false;
      const arch = add(g, new THREE.TorusGeometry(.85, .1, 6, 16, Math.PI), stoneCol, sx * (W / 2 - .05), 7.1, z, false); arch.rotation.y = Math.PI / 2;
      const cp = new THREE.PointLight(pick(['#4a6cff', '#ff4a6a', '#ffcf5a', '#7fe08a'], mulberry32(z * 13 + sx)), 1.8, 7, 2); cp.position.set(sx * (W / 2 - 1.5), 3.5, z); g.add(cp);
    }
    // 측랑 천장
    plane(g, W / 2 - NAVE, L, mat('#2b2a3a', { r: .9 }), sx * (NAVE + (W / 2 - NAVE) / 2), 9.5, 0, 0, Math.PI / 2);
    // 고측창 벽
    box(g, .5, H - 9.5, L, stone, sx * NAVE, 9.5 + (H - 9.5) / 2, 0);
    for (let z = -18; z <= 18; z += 4.5) { const tex = stainedTex(300 + z + sx); const w2 = plane(g, 1.2, 3, new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color('#fff'), emissiveIntensity: 1.1 }), sx * (NAVE - .26), 12.5, z, sx * Math.PI / 2); w2.castShadow = false; }
    // 기둥과 아치
    for (let z = -20.25; z <= 20.25; z += 4.5) {
      cyl(g, .55, .6, 9, stoneCol, sx * NAVE, 4.5, z, 16);
      cyl(g, .85, .85, .5, stoneCol, sx * NAVE, .25, z, 16); box(g, 1.4, .4, 1.4, stoneCol, sx * NAVE, 9.1, z);
    }
    for (let z = -18; z <= 18; z += 4.5) { const ar = add(g, new THREE.TorusGeometry(2.25, .3, 8, 24, Math.PI), stoneCol, sx * NAVE, 9, z); ar.rotation.y = Math.PI / 2; }
  }
  // 신랑 볼트 천장
  const vault = add(g, new THREE.CylinderGeometry(NAVE, NAVE, L, 32, 1, true, -Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: '#2a3159', roughness: .9, side: THREE.BackSide }), 0, H - 1, 0, false);
  vault.rotation.x = Math.PI / 2;
  for (let z = -18; z <= 18; z += 4.5) { const rib = add(g, new THREE.TorusGeometry(NAVE - .1, .12, 6, 32, Math.PI), gold, 0, H - 1, z, false); }
  // 별
  for (let i = 0; i < 120; i++) { const a = Math.random() * Math.PI, z = (Math.random() - .5) * L; const s = add(g, new THREE.SphereGeometry(.05, 6, 4), basic({ color: '#f3d98a' }), Math.cos(a) * (NAVE - .2), H - 1 + Math.sin(a) * (NAVE - .2), z, false); }
  // 앞 벽(입구)과 장미창 쪽 뒷벽
  box(g, W, H + 6, .6, stone, 0, (H + 6) / 2, -L / 2 - .3);
  const rose = stainedTex(77, true);
  const rw = add(g, new THREE.CircleGeometry(3.2, 48), new THREE.MeshStandardMaterial({ map: rose, emissiveMap: rose, emissive: new THREE.Color('#fff'), emissiveIntensity: 1.6 }), 0, 13.2, -L / 2 + .02, false);
  add(g, new THREE.TorusGeometry(3.3, .25, 8, 48), stoneCol, 0, 13.2, -L / 2 + .1, false);
  for (const sx of [-1, 0, 1]) { const tex = stainedTex(500 + sx); const lw = plane(g, 1.3, 5.2, new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color('#fff'), emissiveIntensity: 1.3 }), sx * 2.6, 6.2, -L / 2 + .02); lw.castShadow = false; }
  for (const sx of [-1, 1]) box(g, W / 2 - 2, 9.5, .6, stone, sx * (W / 4 + 1), 4.75, L / 2 + .3);
  box(g, 4, 5, .6, stone, 0, 7, L / 2 + .3); box(g, NAVE * 2, H - 9.5, .6, stone, 0, 9.5 + (H - 9.5) / 2, L / 2 + .3);
  plane(g, 20, 12, basic({ map: sceneryTex('mountain') }), 0, 4, L / 2 + 8, Math.PI);
  // 제대
  box(g, NAVE * 2, .5, 6, mat('#cfc6b6', { r: .5 }), 0, .25, -L / 2 + 3);
  box(g, 3.4, 1.05, 1.2, white, 0, 1.03, -L / 2 + 3.6); box(g, 3.5, .06, 1.3, mat('#f8f6f0'), 0, 1.58, -L / 2 + 3.6, false);
  box(g, 1.2, .9, .05, gold, 0, 1.0, -L / 2 + 4.22, false);
  box(g, .16, 4.2, .16, gold, 0, 3.6, -L / 2 + 1.2); box(g, 1.7, .16, .16, gold, 0, 4.6, -L / 2 + 1.2);
  box(g, .6, .6, .4, gold, 0, 1.9, -L / 2 + 3.2);
  for (const sx of [-1.4, -.9, .9, 1.4]) { cyl(g, .04, .06, .7, gold, sx, 1.95, -L / 2 + 3.6, 8); add(g, new THREE.ConeGeometry(.03, .1, 6), basic({ color: '#ffd27a' }), sx, 2.36, -L / 2 + 3.6, false).userData.flame = true; }
  const altarSpot = new THREE.SpotLight('#ffe3b0', 60, 30, .45, .6, 1.4); altarSpot.position.set(0, 14, -L / 2 + 10); altarSpot.target.position.set(0, 1, -L / 2 + 3); g.add(altarSpot, altarSpot.target);
  // 성모상과 봉헌초대(오른쪽 측랑)
  const rack = new THREE.Group(); rack.position.set(9.5, 0, -15); rack.rotation.y = -Math.PI / 2; g.add(rack);
  for (let tier = 0; tier < 3; tier++) box(rack, 3.2, .1, .5, mat('#2d2a26', { r: .4, m: .5 }), 0, .7 + tier * .28, -tier * .35);
  box(rack, 3.2, .7, 1.2, mat('#2d2a26', { r: .4, m: .5 }), 0, .35, -.35);
  const candles = [];
  for (let tier = 0; tier < 3; tier++) for (let i = 0; i < 10; i++) {
    const x = -1.4 + i * .31, y = .8 + tier * .28, z = -tier * .35;
    cyl(rack, .045, .045, .12, mat('#f7f2e2', { r: .6 }), x, y, z, 8, false);
    const f = add(rack, new THREE.ConeGeometry(.03, .09, 6), basic({ color: '#ffcf6a' }), x, y + .11, z, false); f.visible = false; f.userData.flame = true;
    candles.push(f);
  }
  const candleLight = new THREE.PointLight('#ffb35c', 0, 6, 2); candleLight.position.set(8.8, 1.6, -15); g.add(candleLight); candleLight.userData.flicker = true;
  const mary = new THREE.Group(); mary.position.set(11.8, 0, -15); mary.rotation.y = -Math.PI / 2; g.add(mary);
  box(mary, .9, 1.2, .9, stoneCol, 0, .6, 0);
  add(mary, new THREE.ConeGeometry(.45, 1.7, 16), mat('#f3f1ec', { r: .6 }), 0, 2.05, 0); add(mary, new THREE.ConeGeometry(.5, 1.4, 16, 1, true), mat('#5b7fb8', { r: .6, extra: { side: THREE.DoubleSide } }), 0, 1.95, -.04);
  sph(mary, .2, mat('#f0e2cf'), 0, 3.05, 0); add(mary, new THREE.TorusGeometry(.28, .02, 6, 24), gold, 0, 3.3, -.05, false);
  // 장의자
  const seats = [];
  for (let row = 0; row < 12; row++) {
    const z = -14 + row * 2.3;
    for (const sx of [-1, 1]) {
      const cx = sx * 3.2;
      box(g, 4.6, .1, .55, wood, cx, .46, z); box(g, 4.6, .75, .08, wood, cx, .86, z + .32);
      box(g, 4.6, .1, .25, mat('#6b2a2a', { r: .9 }), cx, .14, z - .55, false); // 무릎틀
      for (const ox of [-1.65, -.55, .55, 1.65]) seats.push({ x: cx + ox, z: z - .05, ry: Math.PI, kind: 'pew', approach: { x: sx * .8, z: z - .75 } });
    }
  }
  // 샹들리에
  for (let z = -12; z <= 12; z += 8) {
    box(g, .03, 5, .03, mat('#222'), 0, H - 3.5, z, false);
    const ch = add(g, new THREE.TorusGeometry(1, .05, 6, 24), gold, 0, 10, z, false); ch.rotation.x = Math.PI / 2;
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; add(g, new THREE.SphereGeometry(.07, 6, 4), basic({ color: '#ffe0a0' }), Math.cos(a), 10.15, z + Math.sin(a), false); }
    const cl = new THREE.PointLight('#ffd9a0', 9, 18, 1.6); cl.position.set(0, 9.6, z); g.add(cl);
  }
  g.add(new THREE.HemisphereLight('#b9c3ff', '#3b3024', .55));
  sun(g, '#ffe9c7', 1.4, [14, 26, 10], [0, 0, 0], 26);
  scene.fog = new THREE.Fog('#2e2a33', 30, 75); scene.background = new THREE.Color('#2e2a33');
  return { group: g, seats, door: { x: 0, z: L / 2 - 1 }, start: { x: 0, z: 18 }, bounds: { x: W / 2 - 1, z0: -L / 2 + 6.4, z1: L / 2 - .8 }, aisleX: 0, candles, candleLight, rackFront: { x: 8.6, z: -15 } };
}

/* ───────── Company 사옥 앞 거리 (거리뷰 캡처 기준, 반경 약 100m) ─────────
   좌표: +x = 북쪽(다리·교차로 방향), +z = 서쪽(도로 → 하천). 로비 정문은 z = 14. */
function texRep(t, rx, ry) { const c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); return c; }
const STREET_TEX = {};
function streetTextures() {
  if (STREET_TEX.ready) return STREET_TEX;
  const T = STREET_TEX;
  T.glass = canvasTex(512, 512, (g, w, h) => { // 유리 커튼월 8칸 x 8층
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#7fb0b5'); gr.addColorStop(.5, '#4f8088'); gr.addColorStop(1, '#6a9ca2'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * .12})`; g.fillRect(Math.random() * w, Math.random() * h, 40 + Math.random() * 120, 10 + Math.random() * 60); }
    g.fillStyle = '#c9d4d6'; for (let x = 0; x < w; x += 64) g.fillRect(x, 0, 3, h); for (let y = 0; y < h; y += 64) g.fillRect(0, y, w, 5);
  });
  T.stone = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#d6ccb8'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(120,105,85,.35)'; g.lineWidth = 2; for (let y = 0; y <= h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } for (let y = 0; y < h; y += 32) for (let x = (y / 32) % 2 * 32; x <= w; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke(); } });
  T.stoneWin = canvasTex(256, 256, (g, w, h) => { g.drawImage(T.stone.image, 0, 0); g.fillStyle = '#3d5a5e'; for (let x = 40; x < w; x += 90) g.fillRect(x, 70, 34, 110); g.fillStyle = 'rgba(255,255,255,.25)'; for (let x = 40; x < w; x += 90) g.fillRect(x + 3, 74, 12, 100); });
  T.gray = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#b9bcbf'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.08)'; for (let x = 0; x < w; x += 64) g.fillRect(x, 0, 2, h);
    g.fillStyle = '#4f6a68'; for (let x = 30; x < w; x += 128) g.fillRect(x, 70, 90, 110); g.fillStyle = '#d9dcde'; for (let x = 30; x < w; x += 128) { g.fillRect(x + 43, 70, 4, 110); g.fillRect(x, 120, 90, 3); }
  });
  T.apt = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#e4e1da'; g.fillRect(0, 0, w, h); g.fillStyle = '#5f6e72'; for (let x = 10; x < w; x += 128) g.fillRect(x, 60, 108, 130);
    g.fillStyle = '#d0ccc4'; for (let x = 10; x < w; x += 128) g.fillRect(x, 150, 108, 40); g.fillStyle = '#9aa4a6'; for (let x = 10; x < w; x += 128) for (let k = 0; k < 108; k += 12) g.fillRect(x + k, 150, 2, 40);
  });
  T.tower = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f1efe9'; g.fillRect(0, 0, w, h); g.fillStyle = '#8a9ba3'; for (let y = 20; y < h; y += 32) for (let x = 12; x < w; x += 60) g.fillRect(x, y, 40, 16); g.fillStyle = '#c86a3c'; g.fillRect(0, 0, 18, h); });
  T.brick = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#9a5a44'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(230,220,210,.5)'; for (let y = 0; y < h; y += 12) g.fillRect(0, y, w, 2); g.fillStyle = '#3f4f55'; for (let y = 30; y < h; y += 64) for (let x = 20; x < w; x += 70) g.fillRect(x, y, 34, 30); });
  T.factory = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#c3c6c4'; g.fillRect(0, 0, w, h); g.fillStyle = '#6c7a7c'; for (let y = 40; y < h; y += 90) g.fillRect(0, y, w, 26); });
  T.paver = canvasTex(256, 256, (g, w, h) => { const s = 32; for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) { g.fillStyle = ((x + y) / s) % 2 ? '#b8746a' : '#a7a29b'; g.fillRect(x, y, s, s); g.strokeStyle = 'rgba(0,0,0,.15)'; g.strokeRect(x, y, s, s); } });
  T.tile = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#c9cbc8'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(80,80,80,.35)'; for (let k = 0; k <= w; k += 32) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, h); g.moveTo(0, k); g.lineTo(w, k); g.stroke(); } });
  T.asphalt = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#5b5d60'; g.fillRect(0, 0, w, h); for (let i = 0; i < 2500; i++) { const v = 70 + Math.random() * 40; g.fillStyle = `rgba(${v},${v},${v + 3},.5)`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } });
  T.grass = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#7c8a52'; g.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++) { g.fillStyle = pick(['#6b7a43', '#8d9a5c', '#a0955a', '#5f6e3c']); g.fillRect(Math.random() * w, Math.random() * h, 2, 3); } });
  T.water = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#5d7479'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(220,235,240,.18)'; for (let i = 0; i < 60; i++) { const y = Math.random() * h; g.beginPath(); g.moveTo(Math.random() * w, y); g.lineTo(Math.random() * w, y + 2); g.stroke(); } });
  T.ready = true; return T;
}
// 상자 건물: faces = { pz, nz, px, nx, all } 각 면 {t, s: [한 장 가로 m, 세로 m]} 또는 {c: 색} 또는 false(안 보임)
function bldg(g, x0, x1, z0, z1, h, faces, y0 = 0) {
  const w = x1 - x0, d = z1 - z0;
  const hidden = new THREE.MeshBasicMaterial({ visible: false });
  const make = (f, fw) => { if (f === false) return hidden; if (!f) f = faces.all; if (f.c) return mat(f.c, { r: .85 }); return new THREE.MeshStandardMaterial({ map: texRep(f.t, fw / f.s[0], h / f.s[1]), roughness: f.r ?? .8, metalness: f.m ?? 0 }); };
  const mats = [make(faces.px, d), make(faces.nx, d), mat(faces.roof || '#8f918f', { r: .95 }), hidden, make(faces.pz, w), make(faces.nz, w)];
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats); m.position.set((x0 + x1) / 2, y0 + h / 2, (z0 + z1) / 2); m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
}
function groundStrip(g, x0, x1, z0, z1, tex, tile, y = .01) {
  const m = new THREE.MeshStandardMaterial({ map: texRep(tex, (x1 - x0) / tile, (z1 - z0) / tile), roughness: .9 });
  return plane(g, x1 - x0, z1 - z0, m, (x0 + x1) / 2, y, (z0 + z1) / 2, 0, -Math.PI / 2);
}
function car(g, kind, color, x, z, ry) {
  const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = ry; g.add(c);
  const body = mat(color, { r: .35, m: .4 }), dark = mat('#1d2226', { r: .3 }), wheel = mat('#151515', { r: .8 });
  if (kind === 'truck') { box(c, 1.9, 1.0, 5.6, mat('#e9e9e6'), 0, .9, 0); box(c, 1.9, 1.6, 1.6, body, 0, 1.4, 2.6); box(c, 1.92, 2.0, 4.0, mat(pick(['#f2f2ef', '#e7b93b', '#dfe3e6'])), 0, 2.1, -.9); }
  else if (kind === 'bus') { box(c, 2.4, 2.8, 11, mat('#f4f2ec', { r: .4 }), 0, 1.7, 0); box(c, 2.42, .9, 10.6, dark, 0, 2.4, 0, false); box(c, 2.43, .12, 11, mat('#c8323a'), 0, 1.0, 0, false); }
  else { box(c, 1.8, .65, 4.5, body, 0, .65, 0); box(c, 1.6, .55, 2.4, body, 0, 1.22, -.2); box(c, 1.62, .45, 2.2, dark, 0, 1.24, -.2, false); }
  const L = kind === 'bus' ? 4 : kind === 'truck' ? 2.2 : 1.45;
  c.userData.wheels = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const wh = add(c, new THREE.CylinderGeometry(.36, .36, .25, 14), wheel, sx * (kind === 'bus' ? 1.1 : .85), .36, sz * L, false); wh.rotation.z = Math.PI / 2; c.userData.wheels.push(wh); }
  return c;
}
function ginkgo(g, x, z, s = 1) {
  cyl(g, .13 * s, .18 * s, 3.4 * s, mat('#5a4a3a', { r: .9 }), x, 1.7 * s, z, 8);
  const cm = mat(pick(['#8faa4a', '#9db552', '#7f9c44']), { r: .9 });
  const c1 = sph(g, 1.4 * s, cm, x, 4.4 * s, z); c1.scale.set(1, 1.5, 1); const c2 = sph(g, 1.0 * s, cm, x, 6.2 * s, z); c2.scale.set(1, 1.4, 1);
}
function streetLight(g, x, z, dirZ) {
  cyl(g, .09, .13, 8, mat('#4a4f54', { r: .5, m: .5 }), x, 4, z, 8);
  const arm = box(g, .1, .1, 2.2, mat('#4a4f54'), x, 8, z + dirZ * 1.0, false); arm.rotation.x = dirZ * .2;
  box(g, .3, .12, .6, mat('#e8e8e2', { e: '#fff3d6', ei: .4 }), x, 8.1, z + dirZ * 2.1, false);
}
function churchTex() {
  const T = streetTextures();
  if (!T.church) T.church = canvasTex(512, 256, (g, w, h) => { // 비스듬한 구리색 패널과 푸른 유리 띠
    g.fillStyle = '#3f6f93'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(210,230,240,.45)'; for (let x = 0; x < w; x += 22) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 42) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    for (let x = 0; x < w; x += 128) { const gr = g.createLinearGradient(x, 0, x + 60, 0); gr.addColorStop(0, '#a8692f'); gr.addColorStop(1, '#c4843f'); g.fillStyle = gr; g.beginPath(); g.moveTo(x + 6, 0); g.lineTo(x + 62, 0); g.lineTo(x + 56, h); g.lineTo(x, h); g.closePath(); g.fill(); }
  });
  if (!T.blue) T.blue = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#2f5fae'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.18)'; for (let x = 0; x < w; x += 32) g.fillRect(x, 0, 2, h); g.fillStyle = '#e8e8e4'; for (let x = 30; x < w; x += 110) g.fillRect(x, 90, 60, 44); g.fillStyle = '#9fb2b8'; for (let x = 30; x < w; x += 110) g.fillRect(x + 4, 94, 52, 36); });
  if (!T.hiApt) T.hiApt = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#efe9df'; g.fillRect(0, 0, w, h); g.fillStyle = '#7d8f97'; for (let y = 12; y < h; y += 28) for (let x = 10; x < w; x += 62) g.fillRect(x, y, 46, 14); g.fillStyle = '#d9cfc0'; for (let y = 26; y < h; y += 28) g.fillRect(0, y, w, 3); });
  return T;
}
function buildStreet(root) {
  // 정문을 나서면 왼쪽(남)이 교회, 오른쪽 앞(북)이 주차장. 아래 좌표는 +x=북으로 적었고,
  // 화면에서 그 방향이 맞도록 거리 전체를 x 로 뒤집어 붙인다. 글자 면은 unflip 으로 다시 바로 세운다.
  const g = new THREE.Group(); g.scale.x = -1; root.add(g);
  const unflip = m => { m.scale.x *= -1; return m; };
  const T = streetTextures(); churchTex();
  const X0 = -210, X1 = 130, XW = X1 - X0, XC = (X0 + X1) / 2;
  const colliders = [];
  const solid = (x0, x1, z0, z1) => colliders.push([x0, x1, z0, z1]);
  // 바닥: 아스팔트 → 앞마당·인도·도로·옹벽·둔치·하천
  groundStrip(g, X0, X1, -125, 34.8, T.asphalt, 4, -.02);
  groundStrip(g, -14, 33, 14.3, 19, T.tile, 2.4);
  groundStrip(g, X0, X1, 19, 22, T.paver, 2.4);
  groundStrip(g, X0, X1, 32, 34.8, T.paver, 2.4);
  // 인도: 북쪽 큰길 북측, 126번길 양쪽, 전파로 양쪽, 뒷길 동측
  groundStrip(g, 63, 65, -125, 19, T.paver, 2.4);
  for (const [x0, x1] of [[-62, -60], [-52, -50]]) groundStrip(g, x0, x1, -64, 19, T.paver, 2.4);
  for (const [x0, x1] of [[-184, -182], [-172, -170]]) groundStrip(g, x0, x1, -125, 19, T.paver, 2.4);
  groundStrip(g, -170, 53, -76, -74, T.paver, 2.4);
  // 차선과 횡단보도
  const yel = basic({ color: '#e2b93b' }), wht = basic({ color: '#e9e9e4' });
  for (const dz of [-.12, .12]) plane(g, XW, .12, yel, XC, .02, 26.6 + dz, 0, -Math.PI / 2);
  plane(g, XW, .12, wht, XC, .02, 29.8, 0, -Math.PI / 2);
  for (let x = X0 + 4; x < X1 - 4; x += 6) plane(g, .12, 2.2, wht, x, .02, 30.9, 0, -Math.PI / 2);
  for (const [a, b] of [[54, 63], [-181, -172]]) for (const zc of [23.4, 30.6]) for (let x = a; x < b; x += 1.2) plane(g, .6, 2.6, wht, x, .021, zc, 0, -Math.PI / 2);
  for (const dx of [-.12, .12]) { plane(g, .12, 144, yel, 58 + dx, .02, -53, 0, -Math.PI / 2); plane(g, .12, 144, yel, -177 + dx, .02, -53, 0, -Math.PI / 2); }
  for (let z = 17; z > -120; z -= 2.6) plane(g, .5, 1.4, wht, -56, .02, z, 0, -Math.PI / 2);
  // 타일 옹벽·둔치·하천
  const tileWall = new THREE.MeshStandardMaterial({ map: texRep(T.tile, XW / 2.4, 1), roughness: .8 });
  for (const [x0, x1] of [[X0, -182], [-172, 53], [63, X1]]) box(g, x1 - x0, 1.1, .3, tileWall, (x0 + x1) / 2, .55, 34.95);
  const bank = (z0, z1, y0, y1) => {
    const len = Math.hypot(z1 - z0, y1 - y0);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(XW, len), new THREE.MeshStandardMaterial({ map: texRep(T.grass, XW / 6, len / 6), roughness: 1 }));
    m.position.set(XC, (y0 + y1) / 2, (z0 + z1) / 2); m.rotation.x = -Math.PI / 2 - Math.atan2(y1 - y0, z1 - z0); m.receiveShadow = true; g.add(m);
  };
  bank(35.1, 47, 0, -4); bank(77, 89, -4, 0);
  const water = plane(g, XW, 30, new THREE.MeshStandardMaterial({ map: texRep(T.water, XW / 8, 4), roughness: .15, metalness: .2, color: '#9fb6bb' }), XC, -4.3, 62, 0, -Math.PI / 2);
  for (let x = X0 + 10; x < X1 - 10; x += 9) { const r = sph(g, rr(.6, 1.2), mat(pick(['#8a7f52', '#7d8c4e', '#a18f5c'])), x + rr(-2, 2), -3.6, 47.5 + rr(0, 2)); r.scale.y = .5; }
  // 건너편 도로
  groundStrip(g, X0, X1, 89, 140, T.asphalt, 4, -.02); groundStrip(g, X0, X1, 89, 91, T.paver, 2.4); groundStrip(g, X0, X1, 97, 99, T.paver, 2.4);
  for (const dz of [-.12, .12]) plane(g, XW, .12, yel, XC, .02, 94 + dz, 0, -Math.PI / 2);
  for (let x = X0 + 6; x < X1 - 6; x += 8) ginkgo(g, x, 90, .95);
  // 다리 둘: 북쪽 큰길 끝(x 53~63)과 남쪽 전파로 끝(x -182~-172)
  for (const bx of [58, -177]) {
    box(g, 10, .8, 54.4, mat('#a9aaa6', { r: .9 }), bx, -.4, 62);
    groundStrip(g, bx - 4.5, bx + 4.5, 34.8, 89.2, T.asphalt, 4, .015);
    for (const sx of [bx - 4.8, bx + 4.8]) { box(g, .3, 1.1, 54.4, mat('#d9dcd9', { r: .6 }), sx, .55, 62); for (let z = 36; z < 89; z += 2) box(g, .08, 1.0, .08, mat('#7a7f84', { r: .4, m: .6 }), sx, 1.3, z, false); box(g, .1, .1, 54.4, mat('#7a7f84', { r: .4, m: .6 }), sx, 1.85, 62, false); }
    for (const z of [50, 62, 74]) cyl(g, 1.0, 1.2, 5, mat('#9c9d99'), bx, -2.6, z, 14);
  }
  // ── Company 사옥 ── 북쪽 유리 커튼월 동(8층), 남쪽 저층부, 정문 베이지 석재 틀
  const glassF = { t: T.glass, s: [12, 8], r: .15, m: .3 }, stoneF = { t: T.stone, s: [4.8, 4.8] }, stoneWinF = { t: T.stoneWin, s: [6, 6] };
  bldg(g, -14, 12, -30, 14.5, 22, { pz: false, px: false, nx: stoneWinF, nz: stoneWinF, roof: '#9a9c9a' });
  bldg(g, 12, 33, -30, 14.5, 31, { pz: glassF, nx: false, px: { t: T.gray, s: [12, 3.4] }, nz: glassF, roof: '#9a9c9a' });
  const facade = (x0, x1, y0, y1, f) => { const m = new THREE.MeshStandardMaterial({ map: texRep(f.t, (x1 - x0) / f.s[0], (y1 - y0) / f.s[1]), roughness: f.r ?? .8, metalness: f.m ?? 0 }); return box(g, x1 - x0, y1 - y0, .3, m, (x0 + x1) / 2, (y0 + y1) / 2, 14.45); };
  facade(-14, -4, 0, 22, glassF); facade(4, 12, 0, 22, glassF); facade(-4, -2.3, 0, 22, stoneF); facade(2.3, 4, 0, 22, stoneF); facade(-2.3, 2.3, 3.2, 22, stoneF);
  box(g, 26.6, .5, .6, mat('#d6ccb8'), -1, 22.2, 14.5); box(g, 21.4, .5, .6, mat('#d6ccb8'), 22.5, 31.2, 14.5);
  // 정문 캐노피·기둥·계단·사인
  box(g, 7.2, .7, 3.6, mat('#d9cfbc', { r: .7 }), 0, 3.75, 16.2);
  const coSign = textTex([{ t: 'COMPANY', font: '900 190px Helvetica, Arial, sans-serif', y: 150, color: '#2f343c' }], { w: 1024, h: 300 });
  unflip(plane(g, 5.6, 1.65, new THREE.MeshBasicMaterial({ map: coSign, transparent: true }), 0, 5.4, 14.62));
  unflip(plane(g, 3.4, .6, new THREE.MeshBasicMaterial({ map: textTex([{ t: 'COMPANY', font: '800 110px Helvetica, Arial, sans-serif', color: '#2f343c' }], { w: 1024, h: 180 }), transparent: true }), 0, 3.75, 18.01));
  cyl(g, .35, .35, 3.4, mat('#e6e2da', { r: .5 }), 2.6, 1.7, 17.4, 16);
  for (let i = 0; i < 3; i++) box(g, 6.4, .16, .6, mat('#cfc9bf', { r: .8 }), 0, .08 + i * .16, 17.1 - i * .6);
  const totem = textTex([{ t: 'CO.', font: '900 120px Helvetica, Arial, sans-serif', y: 110, color: '#ffffff' }, ...'컴퍼니'.split('').map((ch, i) => ({ t: ch, font: '700 130px sans-serif', y: 300 + i * 170, color: '#ffffff' }))], { w: 256, h: 1024, bg: '#1f2226' });
  unflip(box(g, .9, 3.6, .35, new THREE.MeshStandardMaterial({ map: totem, roughness: .5 }), -6.5, 1.8, 18.3));
  for (const x of [-9, -8]) cyl(g, .05, .05, 9, mat('#d9dcde', { m: .7, r: .3 }), x, 4.5, 15.2, 8);
  plane(g, 1.5, 1, new THREE.MeshStandardMaterial({ color: '#ffffff', side: THREE.DoubleSide }), -9 + .76, 8.4, 15.2);
  plane(g, 1.5, 1, new THREE.MeshStandardMaterial({ color: '#2c5f9e', side: THREE.DoubleSide }), -8 + .76, 8.4, 15.2);
  // 앞마당 울타리(정문·차량출입구는 비움)
  const fenceM = mat('#2b2d30', { r: .5, m: .4 });
  const fence = (x0, x1, z) => { box(g, x1 - x0, .08, .06, fenceM, (x0 + x1) / 2, 1.1, z, false); box(g, x1 - x0, .08, .06, fenceM, (x0 + x1) / 2, .45, z, false); box(g, x1 - x0, .35, .35, mat('#d8d6d0'), (x0 + x1) / 2, .17, z, false); for (let x = x0; x <= x1; x += .25) box(g, .03, .7, .03, fenceM, x, .8, z, false); solid(x0, x1, z - .25, z + .25); };
  fence(-14, -4.2, 19); fence(4.2, 33, 19);
  // 사옥 북쪽 면을 따라 흰 장식 난간(거리뷰)
  const railW = mat('#f1f1ee', { r: .5 });
  box(g, .06, .06, 44, railW, 33.6, 1.2, -7.5, false); box(g, .06, .06, 44, railW, 33.6, .2, -7.5, false);
  for (let z = 14; z > -29.5; z -= .5) box(g, .04, 1.0, .04, railW, 33.6, .7, z, false);
  solid(33.3, 33.9, -30, 14.5);
  // 차량 출입구·차단기
  for (const x of [-14.5, -20]) box(g, .7, 1.4, .7, mat('#b8b2a8', { r: .7 }), x, .7, 19);
  box(g, .3, 1.0, .3, mat('#e9c23b'), -15.2, .5, 17.5); box(g, 4.4, .08, .08, mat('#f2f2f2', { e: '#ff5555', ei: .2 }), -17.4, 1.0, 17.5, false);
  groundStrip(g, -20, -14, -30, 19, T.asphalt, 4, .012);
  // ── 복개 노외주차장 1·2 ── 사옥 북쪽 한 차로 옆, 가드레일 너머 복개 위 주차장(뒷길 기준 서쪽 1, 동쪽 2)
  const lotT = canvasTex(256, 256, (c, w, h) => { c.drawImage(T.asphalt.image, 0, 0); c.fillStyle = '#e9e9e4'; for (let y = 0; y < h; y += 64) { c.fillRect(0, y, 96, 4); c.fillRect(160, y, 96, 4); } });
  const lotM = new THREE.MeshStandardMaterial({ map: texRep(lotT, 1, 1), roughness: .9 });
  const lots = [[18, -63], [-75, -122]];
  for (const [za, zb] of lots) {
    const len = za - zb, m = new THREE.MeshStandardMaterial({ map: texRep(lotT, 1, len / 10), roughness: .9 });
    plane(g, 14, len, m, 46, .013, (za + zb) / 2, 0, -Math.PI / 2);
    // 북쪽 큰길과의 경계: 낮은 화단
    box(g, .6, .5, len, mat('#8b8f86', { r: .9 }), 53.3, .25, (za + zb) / 2); solid(53, 53.6, zb, za);
    for (let z = za - 1; z > zb; z -= 2.2) { const s = sph(g, .55, mat(pick(['#5d7d3c', '#6c8a43'])), 53.3, .8, z); s.scale.y = .7; }
    // 주차 칸에 차(약 7할)
    for (const [cx, side] of [[41.8, 1], [50.4, -1]]) for (let z = za - 1.6; z > zb + 1; z -= 2.6) {
      if (Math.random() < .3) continue;
      car(g, Math.random() < .12 ? 'truck' : 'car', pick(['#2a2d33', '#7d8288', '#e9e9e6', '#3c4a5a', '#d8dadc', '#1c1f24']), cx, z, side * Math.PI / 2 + rr(-.04, .04));
      solid(cx - 2.6, cx + 2.6, z - 1.0, z + 1.0);
    }
  }
  // 사옥 쪽 한 차로와 가드레일(노랑·검정 연석 위)
  groundStrip(g, 33.9, 39, -63, 19, T.asphalt, 4, .012);
  for (let z = 14; z > -60; z -= 7) { if (Math.random() < .35) continue; car(g, 'car', pick(['#1d2025', '#bfc3c6', '#f0f0ee', '#58606a']), 35.2, z, Math.PI * (Math.random() < .5 ? 0 : 1)); solid(34.1, 36.3, z - 2.4, z + 2.4); }
  const curbT = canvasTex(128, 32, (c, w, h) => { for (let x = 0; x < w; x += 32) { c.fillStyle = (x / 32) % 2 ? '#1f1f1f' : '#e6c133'; c.fillRect(x, 0, 32, h); } });
  for (const [za, zb] of [[15.5, -63], [-75, -122]]) {
    const len = za - zb;
    box(g, .5, .35, len, new THREE.MeshStandardMaterial({ map: texRep(curbT, len / 2, 1) }), 39.1, .17, (za + zb) / 2);
    box(g, .08, .32, len, mat('#c9ccce', { m: .6, r: .35 }), 39.1, .85, (za + zb) / 2, false);
    for (let z = za; z > zb; z -= 2) box(g, .1, .7, .1, mat('#aeb2b4', { m: .5 }), 39.1, .6, z, false);
    solid(38.85, 39.35, zb, za);
  }
  // 입구 정산소와 P 표지
  box(g, 1.8, 2.4, 1.8, mat('#e9e6df', { r: .7 }), 46, 1.2, 17.2); box(g, 2.1, .15, 2.1, mat('#3f6ea8'), 46, 2.45, 17.2); solid(45, 47, 16.2, 18.2);
  const pSign = textTex([{ t: 'P', font: '900 150px Helvetica, Arial, sans-serif', y: 115, color: '#ffffff' }, { t: '공영주차장', font: '700 46px sans-serif', y: 205, color: '#ffffff' }], { w: 256, h: 256, bg: '#2a5db0' });
  cyl(g, .07, .07, 3.6, mat('#9aa0a4', { m: .6 }), 51, 1.8, 18.2, 8);
  unflip(plane(g, 1.3, 1.3, new THREE.MeshBasicMaterial({ map: pSign, side: THREE.DoubleSide }), 51, 3.4, 18.2));
  // ── 남쪽 회색 8층 ──
  bldg(g, -50, -20.5, -24, 14.5, 27, { all: { t: T.gray, s: [12, 3.4] }, roof: '#8a8c8a' }); solid(-50, -20.5, -24, 14.5);
  box(g, 3.2, .15, 1.2, mat('#3f7f6a'), -26, 3, 15.1); box(g, 3.2, .15, 1.2, mat('#3f7f6a'), -31, 3, 15.1);
  fence(-50, -21, 15.4);
  // 사옥 남쪽 담장(126번길 쪽)
  box(g, .3, 1.8, 78, mat('#b5b0a6', { r: .9 }), -50.3, .9, -24.5); solid(-50.6, -50, -63.5, 14.5);
  for (let z = 10; z > -60; z -= 6) ginkgo(g, -48.6, z, .8);
  // ── 126번길 건너(2026 네이버 거리뷰): 회색 비전센터, 파란 패널 건물과 벽돌집, 뒷길 모퉁이 정비소 ──
  bldg(g, -78, -63, -2, 12, 10, { all: { t: T.gray, s: [12, 3.4] }, roof: '#8a8c8a' }); solid(-78, -63, -2, 12);
  bldg(g, -76, -63, -40, -16, 9, { all: { t: T.blue, s: [8, 4] }, roof: '#556' }); solid(-76, -63, -40, -16);
  bldg(g, -76, -64, -50, -42, 6, { all: { t: T.brick, s: [8, 4] }, roof: '#4f7a6a' }); solid(-76, -64, -50, -42);
  bldg(g, -84, -63, -63, -52, 6, { all: { c: '#e6dfcc' }, roof: '#777' }); solid(-84, -63, -63, -52);
  { const gs = textTex([{ t: '자동차 정비', font: '800 92px sans-serif', y: 105, color: '#ffffff' }], { w: 512, h: 150, bg: '#2c56a8' }); const m = plane(g, 9, 1.4, new THREE.MeshBasicMaterial({ map: gs }), -62.88, 4.6, -57.5); m.rotation.y = Math.PI / 2; unflip(m); }
  // ── 교회 주차장(지상): 강변로 쪽 흰 울타리, 차단기 입구, 뒤쪽 파란 건물 ──
  groundStrip(g, -124, -79, -30, 18, lotT, 6, .013);
  bldg(g, -114, -82, -52, -34, 9, { all: { t: T.blue, s: [8, 4] }, roof: '#556' }); solid(-114, -82, -52, -34);
  for (const [z, ry] of [[12, 0], [3, Math.PI], [-12, 0], [-21, Math.PI]]) for (let x = -122; x < -81; x += 2.6) { if (Math.random() < .25) continue; car(g, Math.random() < .1 ? 'truck' : 'car', pick(['#e9e9e6', '#2a2d33', '#9aa0a6', '#f0f0ee', '#3c4a5a']), x, z, ry + rr(-.05, .05)); solid(x - 1, x + 1, z - 2.4, z + 2.4); }
  box(g, .3, 1.0, .3, mat('#e9c23b'), -94.6, .5, 17.6); box(g, 4.2, .08, .08, mat('#f2f2f2', { e: '#ff5555', ei: .2 }), -96.8, 1.0, 17.6, false);
  // ── 감리교회 ── 강변로를 따라 긴 정면: 비스듬한 구리색 패널과 푸른 유리 띠, 남쪽 끝은 베이지 석재·세로 나무 루버와 1층 카페 차양
  const chF = { t: T.church, s: [16, 15], r: .4, m: .2 };
  bldg(g, -152, -126, -22, 14, 15, { pz: chF, px: chF, nx: false, nz: { t: T.gray, s: [12, 3.4] }, roof: '#7d7f7d' }); solid(-152, -126, -22, 14);
  bldg(g, -170, -152, -22, 14, 15, { all: { t: T.stone, s: [4.8, 4.8] }, roof: '#7d7f7d' }); solid(-170, -152, -22, 14);
  for (let x = -169; x < -153; x += .7) box(g, .18, 7, .3, mat('#a0703f', { r: .6 }), x, 10.5, 14.2, false);
  for (let x = -168; x < -153; x += 3.2) { const aw = box(g, 2.8, .12, 1.4, mat('#3b3430', { r: .6 }), x + 1.4, 3.2, 14.75, false); aw.rotation.x = .25; box(g, 2.6, 2.6, .1, mat('#2e3b40', { r: .2, m: .3 }), x + 1.4, 1.4, 14.06, false); }
  { const cs = textTex([{ t: 'CAFE', font: '800 120px Helvetica, Arial, sans-serif', y: 110, color: '#ffffff' }], { w: 512, h: 160, bg: '#3b3430' }); unflip(plane(g, 3.2, 1, new THREE.MeshBasicMaterial({ map: cs }), -161, 4.6, 14.3)); }
  bldg(g, -170, -138, -62, -22, 20, { all: { t: T.gray, s: [12, 3.4] }, roof: '#8a8c8a' }); solid(-170, -138, -62, -22);
  box(g, .4, 5, .4, mat('#f3f3f3', { e: '#ffffff', ei: .35 }), -139, 17.5, 4); box(g, .4, .4, 2.6, mat('#f3f3f3', { e: '#ffffff', ei: .35 }), -139, 18.6, 4);
  box(g, .2, 2.6, 2.4, mat('#cfd6da', { m: .5, r: .2 }), -140, 1.3, 14.1, false); // 강변 쪽 출입문
  const zig = mat('#f4f4f2', { r: .5 });
  const zfence = (x0, x1, z) => { box(g, x1 - x0, .06, .06, zig, (x0 + x1) / 2, 1.0, z, false); box(g, x1 - x0, .06, .06, zig, (x0 + x1) / 2, .2, z, false); for (let x = x0; x < x1; x += 1.6) { box(g, .06, 1.0, .06, zig, x, .6, z, false); const d = box(g, .05, 1.1, .05, zig, x + .8, .6, z, false); d.rotation.z = Math.random() < .5 ? .6 : -.6; } solid(x0, x1, z - .25, z + .25); };
  zfence(-124, -99, 18.5); zfence(-93, -79, 18.5); zfence(-169, -142, 18.5); zfence(-138, -126, 18.5);
  for (let x = -123; x < -80; x += 6) ginkgo(g, x, 17.6, .9);
  // ── 전파로 건너 ──
  bldg(g, -205, -186, -20, 14, 16, { all: { t: T.gray, s: [12, 3.4] }, roof: '#8a8c8a' }); solid(-205, -186, -20, 14);
  bldg(g, -205, -186, -60, -26, 12, { all: { t: T.factory, s: [10, 4] }, roof: '#888' }); solid(-205, -186, -60, -26);
  // ── 뒷길 건너(동쪽): 고층 아파트, 오피스텔, 성당 ──
  for (const [x0, x1, z0, z1, h] of [[0, 34, -100, -84, 46], [-48, -18, -102, -86, 40], [8, 30, -125, -110, 52]]) {
    bldg(g, x0, x1, z0, z1, h, { all: { t: T.hiApt, s: [12, 5.6] }, roof: '#cfc9bf' }); bldg(g, x0 - .2, x1 + .2, z0 - .2, z1 + .2, 6, { all: { t: T.brick, s: [8, 4] }, roof: '#cfc9bf' }); solid(x0, x1, z0, z1);
  }
  bldg(g, -80, -54, -100, -80, 36, { all: { t: T.hiApt, s: [12, 5.6] }, roof: '#8a8c8a' }); bldg(g, -80.2, -53.8, -100.2, -79.8, 4, { all: { c: '#4d5257' }, roof: '#8a8c8a' }); solid(-80, -54, -100, -80);
  bldg(g, -132, -108, -104, -84, 11, { all: { c: '#f1efea' }, roof: '#8b8f93' }); solid(-132, -108, -104, -84);
  box(g, 2.2, 14, 2.2, mat('#f1efea'), -110, 7, -84); box(g, .3, 3, .3, mat('#c9a35a'), -110, 15.5, -84); box(g, .3, .3, 1.8, mat('#c9a35a'), -110, 16.3, -84);
  box(g, 24, 1.8, .3, new THREE.MeshStandardMaterial({ map: texRep(T.brick, 3, .45) }), -120, .9, -82.4); solid(-132, -108, -82.8, -82);
  for (let i = 0; i < 10; i++) { const x = -205 + i * 32 + rr(-4, 4), z = -150 + rr(-15, 10); bldg(g, x, x + 15, z, z + 15, rr(48, 72), { all: { t: T.hiApt, s: [12, 5.6] }, roof: '#cfc9bf' }); }
  // 북쪽 큰길 건너 고층 아파트(2026 거리뷰: 회색·흰색 20층 안팎, 아래 두 층은 석재, 앞 화단과 낮은 울타리)
  const aptF = { t: T.hiApt, s: [12, 5.6] };
  for (const [x0, x1, z0, z1, h] of [[68, 88, -10, 8, 58], [92, 112, -14, 4, 54], [70, 92, -46, -28, 50], [96, 116, -52, -34, 46]]) {
    bldg(g, x0, x1, z0, z1, h, { all: aptF, roof: '#d4d0c8' }); bldg(g, x0 - .15, x1 + .15, z0 - .15, z1 + .15, 6, { all: { c: '#9b928a' }, roof: '#d4d0c8' });
    box(g, 3, h - 6, .3, mat('#6f767c', { r: .7 }), x0 + 4, 6 + (h - 6) / 2, z1 + .2, false); solid(x0, x1, z0, z1);
  }
  box(g, .5, .5, 140, mat('#8b8f86', { r: .9 }), 66, .25, -52); for (let z = 16; z > -120; z -= 2.5) { const s = sph(g, .6, mat(pick(['#5d7d3c', '#6c8a43'])), 66.2, .9, z); s.scale.y = .7; }
  for (let z = 14; z > -118; z -= 9) ginkgo(g, 66.6, z, .85);
  solid(65.7, 66.3, -122, 18);
  // 사옥 블록 뒤쪽 건물들(뒷길 서측)과 북쪽 큰길 건너 낮은 건물
  for (const [x0, x1, z0, z1, h] of [[-14, 6, -62, -40, 9], [8, 31, -62, -40, 12], [67, 93, -80, -52, 10], [-48, -21, -60, -32, 8]]) { bldg(g, x0, x1, z0, z1, h, { all: { t: T.gray, s: [12, 3.4] }, roof: '#888' }); solid(x0, x1, z0, z1); }
  // 하천 건너: 공장 지대와 고층 아파트
  for (let x = X0 + 4; x < X1 - 10; x += 24) bldg(g, x, x + rr(14, 21), 101, 101 + rr(14, 22), rr(8, 16), { all: { t: T.factory, s: [10, 4] }, roof: '#8d8f8c' });
  for (let i = 0; i < 20; i++) { const x = -240 + i * 22 + rr(-4, 4), z = 150 + rr(0, 40); bldg(g, x, x + 14, z, z + 14, rr(50, 78), { all: { t: T.tower, s: [14, 6] }, roof: '#c9c4bb' }); }
  for (let i = 0; i < 5; i++) { const x = 140 + i * 18, z = -20 + rr(-30, 30); bldg(g, x, x + 14, z, z + 14, rr(45, 70), { all: { t: T.tower, s: [14, 6] }, roof: '#c9c4bb' }); }
  // 가로수·가로등·전신주와 전깃줄
  const nearBridge = x => (x > 51 && x < 66) || (x > -184 && x < -169);
  for (let x = X0 + 4; x < X1 - 4; x += 7) { if (nearBridge(x)) continue; ginkgo(g, x + rr(-.5, .5), 33.3); }
  for (let x = X0 + 10; x < X1 - 4; x += 28) { if (nearBridge(x)) continue; streetLight(g, x, 34.4, -1); }
  const poles = [];
  // 전신주는 차도 쪽 인도 가장자리(연석 z 22 바로 안쪽)
  for (let x = -200; x < 126; x += 30) { if (nearBridge(x) || (x > 33 && x < 54)) continue; cyl(g, .17, .22, 11, mat('#a8a8a2', { r: .9 }), x, 5.5, 21.65, 10); box(g, 2, .12, .12, mat('#555'), x, 10.2, 21.65, false); box(g, .3, 1.4, .32, mat('#f2c53d'), x, .7, 21.65, false); poles.push(x); solid(x - .2, x + .2, 21.45, 21.85); }
  const wireM = new THREE.LineBasicMaterial({ color: '#222' });
  for (const dz of [-.8, 0, .8]) { const pts = []; for (let i = 0; i < poles.length - 1; i++) { const a = poles[i], b = poles[i + 1]; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push(new THREE.Vector3(lerp(a, b, t), 10.1 - Math.sin(t * Math.PI) * .9, 21.65 + dz)); } } g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireM)); }
  // 하천 쪽 주차 차량
  const parked = [[-202, 'car'], [-195, 'car'], [-162, 'truck'], [-152, 'car'], [-140, 'bus'], [-122, 'car'], [-112, 'car'], [-96, 'truck'], [-84, 'car'], [-77, 'car'], [-66, 'bus'], [-50, 'truck'], [-40, 'car'], [-33, 'car'], [-26, 'truck'], [-12, 'car'], [-5, 'car'], [8, 'bus'], [22, 'truck'], [29, 'car'], [40, 'car'], [72, 'car'], [86, 'truck'], [100, 'car'], [110, 'car']];
  for (const [x, k] of parked) { car(g, k, pick(['#2a2d33', '#7d8288', '#e9e9e6', '#3c4a5a', '#8a1f24']), x, 31, Math.PI / 2 * (Math.random() < .5 ? 1 : -1)); solid(x - (k === 'bus' ? 5.6 : 3), x + (k === 'bus' ? 5.6 : 3), 30, 32); }
  // 126번길·뒷길 양쪽 주차 차량
  for (let z = 12; z > -58; z -= 6.5) { if (Math.random() < .3) continue; for (const x of [-58.8, -53.2]) { if (Math.random() < .4) continue; car(g, 'car', pick(['#f0f0ee', '#e9e9e6', '#2a2d33', '#9aa0a6']), x, z, Math.random() < .5 ? 0 : Math.PI); solid(x - 1, x + 1, z - 2.4, z + 2.4); } }
  for (let x = 30; x > -165; x -= 6.5) { if (Math.random() < .45 || (x > -62 && x < -50)) continue; car(g, 'car', pick(['#f0f0ee', '#2a2d33', '#9aa0a6', '#3c4a5a']), x, -72.8, Math.PI / 2 * (Math.random() < .5 ? 1 : -1)); solid(x - 2.4, x + 2.4, -73.8, -71.8); }
  // 달리는 차: 강변로 넷, 북쪽 큰길 하나
  const movers = [];
  for (let i = 0; i < 4; i++) { const dir = i % 2 ? -1 : 1; const c = car(g, i === 3 ? 'truck' : 'car', pick(['#1f2328', '#f0f0ee', '#6d7379', '#2e4a6b']), rr(X0, X1), dir > 0 ? 24.6 : 28.4, dir * Math.PI / 2); movers.push({ c, dir, v: rr(7, 11), ax: 'x', a: X0 - 5, b: X1 + 5 }); }
  { const c = car(g, 'car', '#c9ccd0', 59.6, -40, Math.PI); movers.push({ c, dir: -1, v: 8, ax: 'z', a: -125, b: 30 }); }
  // 인도를 걷는 사람들
  const walkers = [];
  for (let i = 0; i < 8; i++) {
    const p = new Person(randName(), pick(['casual', 'office', 'formal']), Math.random); const z = i % 2 ? 20.0 : 33.8;
    p.root.position.set(rr(-190, 110), 0, z); p.speed = rr(1.0, 1.4); g.add(p.root); walkers.push({ p, z });
  }
  // 막힘 판정: 건물·로비 벽·기둥, 하천(다리 위만 통과)
  solid(-14.3, -12.3, -30, 14.6); solid(12.3, 33.3, -30, 14.6); solid(-14.3, 33.3, -30.3, -14.3);
  solid(-12.3, -2.25, 13.85, 14.65); solid(2.25, 12.3, 13.85, 14.65); solid(-12.4, -11.8, -14, 14); solid(11.8, 12.4, -14, 14);
  solid(2.25, 2.95, 17.05, 17.75); solid(-6.95, -6.05, 18.1, 18.5);
  const blocked = (x, z) => {
    x = -x;
    if (z > 34.75 && z < 89 && !(x > 53.6 && x < 62.4) && !(x > -181.4 && x < -172.6)) return true;
    for (const c of colliders) if (x > c[0] - .25 && x < c[1] + .25 && z > c[2] - .25 && z < c[3] + .25) return true;
    return false;
  };
  const tick = (dt, t) => {
    for (const m of movers) { const p = m.c.position; p[m.ax] += m.dir * m.v * dt; if (p[m.ax] > m.b) p[m.ax] = m.a; if (p[m.ax] < m.a) p[m.ax] = m.b; for (const wh of m.c.userData.wheels) wh.rotation.x += m.v * dt / .36; }
    for (const w of walkers) { if (!w.p.path.length) w.p.goTo([{ x: rr(-195, 110), z: w.z + rr(-.4, .4) }]); w.p.update(dt, t); }
    water.material.map.offset.x = t * .01;
  };
  return { blocked, tick };
}
// 길찾기: 로비·앞마당·인도·주차장·뒷길·126번길·전파로·다리를 잇는 길목 그래프(화면 좌표, 북 = -x)
const CO_NODES = {
  lobby: [0, 12.6], door: [0, 15.6], gate: [0, 18], s0: [0, 20.4],
  sLot: [-46.3, 20.4], sBr: [-58, 20.4], s126: [56, 20.4], sCh: [96, 20.4], sJp: [177, 20.4],
  rBr: [-58, 33.5], rJp: [177, 33.5], fBr: [-58, 90.5], fJp: [177, 90.5],
  lot1: [-46.3, -20], lotE: [-46.3, -69], lot2: [-46.3, -100], lane: [-37, -20], bk126: [56, -69], bkJp: [177, -69], bkN: [-58, -69],
  chLot: [96, 7.5],
};
const CO_EDGES = [['lobby', 'door'], ['door', 'gate'], ['gate', 's0'], ['s0', 'sLot'], ['sLot', 'sBr'], ['s0', 's126'], ['s126', 'sCh'], ['sCh', 'sJp'], ['sBr', 'rBr'], ['sJp', 'rJp'], ['rBr', 'fBr'], ['rJp', 'fJp'], ['fBr', 'fJp'],
  ['sLot', 'lot1'], ['lot1', 'lotE'], ['lotE', 'lot2'], ['sLot', 'lane'], ['lane', 'lotE'], ['lotE', 'bkN'], ['sBr', 'bkN'], ['lotE', 'bk126'], ['s126', 'bk126'], ['bk126', 'bkJp'], ['sJp', 'bkJp'], ['sCh', 'chLot']];
function coClear(a, b) {
  const bl = world && world.blocked; if (!bl) return true;
  const d = Math.hypot(b.x - a.x, b.z - a.z), n = Math.ceil(d / .4);
  for (let i = 1; i < n; i++) { const t = i / n; if (bl(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t)) return false; }
  return true;
}
function coRoute(from, to) {
  if (coClear(from, to)) return [{ x: to.x, z: to.z }];
  const P = {}; for (const k in CO_NODES) P[k] = { x: CO_NODES[k][0], z: CO_NODES[k][1] };
  const near = q => { const ks = Object.keys(P).sort((a, b) => Math.hypot(P[a].x - q.x, P[a].z - q.z) - Math.hypot(P[b].x - q.x, P[b].z - q.z)); return ks.find(k => coClear(q, P[k])) || ks[0]; };
  const s = near(from), e = near(to);
  const dist = { [s]: 0 }, prev = {}, todo = new Set(Object.keys(P));
  while (todo.size) {
    let u = null; for (const k of todo) if (dist[k] !== undefined && (u === null || dist[k] < dist[u])) u = k;
    if (u === null || u === e) break; todo.delete(u);
    for (const [a, b] of CO_EDGES) { const v = a === u ? b : b === u ? a : null; if (!v || !todo.has(v)) continue; const nd = dist[u] + Math.hypot(P[u].x - P[v].x, P[u].z - P[v].z); if (dist[v] === undefined || nd < dist[v]) { dist[v] = nd; prev[v] = u; } }
  }
  const path = []; for (let k = e; k; k = prev[k]) { path.unshift(P[k]); if (k === s) break; }
  path.push({ x: to.x, z: to.z }); return path;
}
function buildOHC() {
  // 사옥 로비: 정문 → 넓은 로비(왼쪽 연혁 패널·전시대·청록 벤치, 오른쪽 큰 창과 라운지) → 로고 유리벽과 스피드게이트 → 목재 루버벽 사인
  const g = new THREE.Group(), W = 24, L = 28, H = 5.2;
  plane(g, W, L, new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#d9d6cf'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(0,0,0,.07)'; c.lineWidth = 2; c.strokeRect(0, 0, w, h); for (let i = 0; i < 500; i++) { c.fillStyle = `rgba(255,255,255,${Math.random() * .18})`; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }, [12, 14]), roughness: .55, envMapIntensity: .4 }), 0, 0, 0, 0, -Math.PI / 2);
  const white = mat('#f3f3f1', { r: .9 }), alu = mat('#c9ced3', { r: .35, m: .7 }), black = mat('#1d1d1e', { r: .45 }), teal = mat('#5d8e91', { r: .85 }), tealDark = mat('#46777a', { r: .85 });
  const warmWood = mat('#c9b18c', { r: .6 }), louver = mat('#5e4a3b', { r: .7 }), louverBack = mat('#3a2f27', { r: .8 });
  const glass = new THREE.MeshStandardMaterial({ color: '#d5e9ef', roughness: .05, metalness: .1, transparent: true, opacity: .2, depthWrite: false, side: THREE.DoubleSide });
  const city = basic({ map: sceneryTex('city') });
  // 천장: 흰 천장, 가운데 원형 간접조명, 레일 조명
  plane(g, W, L, mat('#e9e7e2', { r: .95 }), 0, H, 0, 0, Math.PI / 2);
  const ring = add(g, new THREE.TorusGeometry(2.2, .08, 8, 48), basic({ color: '#fff3dc' }), -3, H - .05, 4, false); ring.rotation.x = Math.PI / 2;
  for (const z of [-9, 2, 8]) { box(g, 10, .05, .08, mat('#2a2a2a'), -5, H - .3, z, false); for (let x = -9; x <= -1; x += 2) { const sp = cyl(g, .07, .09, .2, mat('#2a2a2a'), x, H - .45, z, 10, false); } }
  // 왼쪽 벽: 연혁 패널 + 전시대 + 청록 벤치
  box(g, .3, H, L, mat('#ece8e0', { r: .9 }), -W / 2 - .15, H / 2, 0);
  for (let i = 0; i < 6; i++) { const pnl = box(g, .06, 2.1, 1.35, new THREE.MeshStandardMaterial({ map: panelTextTex(), roughness: .5 }), -W / 2 + .05, 2.25, -4.6 + i * 1.5, false); pnl.material.map.center.set(.5, .5); }
  plane(g, 4.2, .55, basic({ map: textTex([{ t: 'Enhance Your Everyday', font: '600 64px sans-serif', color: '#6d6a63' }], { h: 128 }), transparent: true }), -W / 2 + .02, 2.55, 5.4, Math.PI / 2);
  plane(g, 4.2, .28, basic({ map: textTex([{ t: '오늘의 일상도 걱정 없이', font: '500 54px sans-serif', color: '#8a867e' }], { h: 96 }), transparent: true }), -W / 2 + .02, 2.95, 5.4, Math.PI / 2);
  for (let i = 0; i < 3; i++) {
    const z = 4 + i * 1.4;
    box(g, .7, 1.05, .7, warmWood, -W / 2 + .9, .53, z);
    box(g, .62, .5, .62, glass, -W / 2 + .9, 1.31, z, false);
    box(g, .2, .3, .1, mat('#f3f4f6', { r: .4 }), -W / 2 + .9, 1.22, z, false);
    box(g, .12, .2, .12, mat('#2a7fc0', { r: .4 }), -W / 2 + .9, 1.15, z + .18, false);
    const gl = new THREE.PointLight('#ffd7a0', 2.2, 2.6, 2); gl.position.set(-W / 2 + .9, 1.9, z); g.add(gl);
  }
  // 청록 벤치(ㄱ자, 등받이 쿠션)
  box(g, .75, .42, 7, teal, -W / 2 + .55, .21, -2.2); box(g, .22, .6, 7, tealDark, -W / 2 + .14, .72, -2.2);
  box(g, 3, .42, .75, teal, -W / 2 + 1.7, .21, -5.35); box(g, 3, .6, .22, tealDark, -W / 2 + 1.7, .72, -5.67);
  const seats = [];
  for (let i = 0; i < 6; i++) { const z = -4.6 + i * 1.1; seats.push({ x: -W / 2 + .62, z, ry: Math.PI / 2, kind: 'bench', approach: { x: -W / 2 + 1.7, z } }); }
  for (const x of [-W / 2 + 1.5, -W / 2 + 2.6]) seats.push({ x, z: -5.3, ry: 0, kind: 'bench', approach: { x, z: -4.3 } });
  // 전시대·연혁 앞에서 둘러보는 자리
  for (let i = 0; i < 3; i++) seats.push({ x: -W / 2 + 2.1, z: 4 + i * 1.4, ry: -Math.PI / 2, kind: 'look', approach: { x: -W / 2 + 2.6, z: 4 + i * 1.4 } });
  for (let i = 0; i < 3; i++) seats.push({ x: -W / 2 + 2.2, z: -3.8 + i * 1.6, ry: -Math.PI / 2, kind: 'look', approach: { x: -W / 2 + 2.8, z: -3.8 + i * 1.6 } });
  // 오른쪽: 바닥까지 내려오는 큰 창
  box(g, .3, .5, L, white, W / 2 + .15, .25, 0); box(g, .3, .6, L, white, W / 2 + .15, H - .3, 0);
  for (let z = -L / 2 + 2; z < L / 2; z += 2.2) box(g, .14, H, .12, alu, W / 2 - .02, H / 2, z, false);
  // 라운지: 소파 두 개가 마주 보고 가운데 낮은 탁자
  const sofa = mat('#e5e1d8', { r: .95 }), sofaBack = mat('#d6d1c6', { r: .95 });
  for (const [z, sz] of [[1.4, 1], [5.6, -1]]) {
    box(g, 3.2, .42, .85, sofa, 8, .21, z); box(g, 3.2, .55, .25, sofaBack, 8, .7, z - sz * .38);
    for (const ox of [-1, 0, 1]) seats.push({ x: 8 + ox, z: z + sz * .05, ry: sz > 0 ? 0 : Math.PI, kind: 'sofa', approach: { x: 8 + ox, z: z + sz * .95 } });
  }
  box(g, 2, .38, 1.1, warmWood, 8, .19, 3.5); sph(g, .14, mat('#e8eef0', { r: .2 }), 7.6, .5, 3.5); cyl(g, .12, .1, .26, mat('#3e6e6a', { r: .3 }), 8.5, .5, 3.4, 12);
  // 창가 1인 의자
  for (const z of [-6, -3.6]) { box(g, .8, .42, .8, mat('#4f5b63', { r: .9 }), 10.9, .21, z); box(g, .22, .55, .8, mat('#3f4a51', { r: .9 }), 11.25, .7, z); seats.push({ x: 10.95, z, ry: -Math.PI / 2, kind: 'sofa', approach: { x: 9.9, z } }); }
  box(g, .6, .5, .6, warmWood, 10.9, .25, -4.8);
  // 안내데스크
  box(g, 3.4, 1.05, .8, white, 4.4, .53, -1.6); box(g, 3.5, .06, .9, warmWood, 4.4, 1.08, -1.6, false); box(g, .5, .32, .04, black, 4, 1.3, -1.8, false);
  // 로비 카페 「일마지오」(IL MAZZIO) — 정문 오른쪽
  const cafeWood = mat('#7a5a40', { r: .6 }), cafeTop = mat('#efe9df', { r: .35 });
  box(g, 4.6, 1.02, .75, cafeWood, 6, .51, 10.7); box(g, 4.7, .06, .9, cafeTop, 6, 1.05, 10.65, false);
  box(g, .9, .55, .5, mat('#b9bec3', { r: .3, m: .8 }), 5.2, 1.36, 10.8, false); box(g, .9, .1, .5, black, 5.2, 1.68, 10.8, false);
  for (const ox of [-.2, .1]) cyl(g, .04, .035, .08, mat('#ffffff', { r: .4 }), 5.2 + ox, 1.13, 10.5, 8, false);
  box(g, .5, .35, .4, mat('#d9d4ca'), 7.3, 1.25, 10.8, false); box(g, .32, .22, .02, black, 6.3, 1.2, 10.36, false);
  box(g, 5.2, .06, .35, cafeTop, 6, 1.7, 13.75, false); box(g, 5.2, .06, .35, cafeTop, 6, 2.3, 13.75, false);
  for (let i = 0; i < 12; i++) cyl(g, .07, .06, .16, mat(pick(['#f3efe6', '#3b2a20', '#c9a37a', '#ffffff'])), 3.8 + i * .4, 1.82, 13.75, 8, false);
  box(g, 5.6, 2.8, .12, mat('#3d3029', { r: .8 }), 6, 2.2, 13.9);
  const cafeSign = textTex([{ t: 'IL MAZZIO', font: '600 150px Georgia, "Times New Roman", serif', y: 120, color: '#f3e7cf' }, { t: '일마지오 · CAFE', font: '500 54px sans-serif', y: 225, color: '#d9c6a3' }], { w: 1024, h: 300 });
  plane(g, 3.6, 1.05, new THREE.MeshBasicMaterial({ map: cafeSign, transparent: true }), 6, 3.2, 13.83, Math.PI);
  const menu = textTex([{ t: 'MENU', font: '700 64px Georgia, serif', y: 60, color: '#f3e7cf' }, { t: 'Americano', font: '400 40px Georgia, serif', y: 140, color: '#e8dcc4' }, { t: 'Caffè Latte', font: '400 40px Georgia, serif', y: 200, color: '#e8dcc4' }, { t: 'Tea · Juice', font: '400 40px Georgia, serif', y: 260, color: '#e8dcc4' }], { w: 512, h: 320, bg: '#2a2f2b' });
  box(g, 1.2, .75, .04, new THREE.MeshStandardMaterial({ map: menu, roughness: .8 }), 8.6, 1.95, 13.82, false).rotation.y = Math.PI;
  for (const x of [4.6, 6, 7.4]) { box(g, .01, 1.1, .01, mat('#222'), x, H - .55, 10.7, false); const pd = cyl(g, .14, .2, .2, mat('#e9dcc2', { e: '#ffd9a0', ei: .9 }), x, H - 1.2, 10.7, 12, false); }
  const cafeL = new THREE.PointLight('#ffcf94', 6, 7, 2); cafeL.position.set(6, 3.2, 11.5); g.add(cafeL);
  for (const x of [4.6, 7.4]) seats.push({ x, z: 9.7, ry: 0, kind: 'look', approach: { x, z: 9.0 } });
  // 로고 유리벽 + 스피드게이트 (z = -7)
  for (const sx of [-1, 1]) {
    const gw = box(g, W / 2 - 1.6, H - .1, .05, glass, sx * (W / 4 + .8), H / 2, -7, false); gw.receiveShadow = false;
    box(g, W / 2 - 1.6, .08, .12, alu, sx * (W / 4 + .8), H - .05, -7, false); box(g, W / 2 - 1.6, .08, .12, alu, sx * (W / 4 + .8), .04, -7, false);
    for (let x = 1.6; x < W / 2; x += 2.6) box(g, .06, H, .1, alu, sx * x, H / 2, -7, false);
  }
  const logoTex = textTex([{ t: 'COMPANY', font: '900 180px Helvetica, Arial, sans-serif', y: 150, color: '#3b4048' }], { w: 1024, h: 300 });
  plane(g, 4.6, 1.35, new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, side: THREE.DoubleSide, opacity: .8 }), -5, 2.6, -6.96);
  for (const gx of [-1.35, 0, 1.35]) { if (gx === 0) continue; box(g, .26, 1, 1.4, alu, gx, .5, -7); box(g, .27, .07, 1.2, mat('#3b8fd6', { e: '#3b8fd6', ei: 1.2 }), gx, 1.02, -7, false); const fl = box(g, .5, .5, .02, glass, gx - Math.sign(gx) * .38, .85, -7, false); }
  // 안쪽: 목재 루버벽 + 사인 + 청자 + 화분
  box(g, W, H, .3, louverBack, 0, H / 2, -L / 2 - .15);
  for (let x = -W / 2 + .2; x < W / 2; x += .3) box(g, .12, H - .2, .14, louver, x, H / 2, -L / 2 + .07, false);
  const signTex = textTex([{ t: 'COMPANY', font: '900 130px Helvetica, Arial, sans-serif', y: 150, color: '#2d3440' }], { w: 768, h: 300, bg: '#f5f5f3' });
  box(g, 2.4, .95, .14, new THREE.MeshStandardMaterial({ map: signTex, roughness: .4 }), 0, 2.2, -L / 2 + .25, false);
  const signLight = new THREE.PointLight('#ffffff', 4, 4, 2); signLight.position.set(0, 2.4, -L / 2 + 1.2); g.add(signLight);
  box(g, 2.6, .8, .5, warmWood, 3.2, .4, -L / 2 + .6);
  const vase = add(g, new THREE.SphereGeometry(.32, 20, 16), mat('#a9c3b4', { r: .25 }), 3.2, 1.12, -L / 2 + .6); vase.scale.y = 1.15;
  cyl(g, .08, .12, .22, mat('#a9c3b4', { r: .25 }), 3.2, 1.55, -L / 2 + .6, 12);
  const plant = (x, z, s = 1) => { cyl(g, .28 * s, .22 * s, .55 * s, white, x, .28 * s, z); for (let i = 0; i < 6; i++) { const lf = sph(g, .34 * s, mat(pick(['#3f7d46', '#4f8f52', '#2f6b3a'])), x + (Math.random() - .5) * .45 * s, (.8 + i * .24) * s, z + (Math.random() - .5) * .45 * s); lf.scale.set(1, 1.3, 1); } };
  plant(-3.4, -L / 2 + .9, 1.5); plant(6.2, -L / 2 + .9, 1.3); plant(-10, -L / 2 + .9, 1.6); plant(10.6, -7.8, 1.3); plant(-2.6, -6.4, 1.1); plant(2.6, -6.4, 1.1); plant(10.8, 12.4, 1.3); plant(-10.6, 11.6, 1.5);
  for (const x of [-7, 7]) seats.push({ x, z: -11.5, ry: Math.PI, kind: 'look', approach: { x, z: -10.5 } });
  // 정문
  for (const sx of [-1, 1]) box(g, W / 2 - 2.2, H, .3, white, sx * (W / 4 + 1.1), H / 2, L / 2 + .15);
  box(g, 4.4, H - 3, .3, white, 0, 3 + (H - 3) / 2, L / 2 + .15);
  // 빛: 로비는 따뜻한 간접광, 창으로 들어오는 낮빛
  g.add(new THREE.HemisphereLight('#fffaf0', '#a99f90', .7));
  sun(g, '#fff7ea', 1.6, [22, 14, 4], [0, 0, 0], 20);
  for (const [x, z, c, i] of [[-6, 4, '#ffc98a', 7], [-6, -4, '#ffc98a', 6], [5, 3, '#fff1dc', 5], [0, -10.5, '#ffd3a0', 7]]) { const p = new THREE.PointLight(c, i, 14, 1.6); p.position.set(x, H - .6, z); g.add(p); }
  const street = buildStreet(g);
  scene.fog = new THREE.Fog('#d9e2e8', 90, 330); scene.background = new THREE.Color('#cddbe4');
  return { group: g, seats, door: { x: 0, z: L / 2 - 1 }, start: { x: 0, z: 10.5 }, bounds: { x: 205, x0: -118, x1: 203, z0: -118, z1: 97 }, aisleX: 0, coffee: { x: 6, z: 9.7, ry: 0 }, blocked: street.blocked, tick: street.tick, route: coRoute };
}
const BUILD = { temple: buildTemple, church: buildChurch, cathedral: buildCathedral, ohc: buildOHC };

/* ───────── 소리 ───────── */
const Sound = {
  ctx: null, on: false, listening: false, place: null, nodes: [], timers: [], loopTimer: null,
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0; this.master.connect(c.destination);
    this.dry = c.createGain(); this.dry.connect(this.master);
    this.verb = c.createConvolver(); this.wet = c.createGain(); this.wet.gain.value = .35; this.verb.connect(this.wet); this.wet.connect(this.master);
    const len = c.sampleRate * 3.2, ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    this.verb.buffer = ir;
    const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), nd = nb.getChannelData(0); let last = 0;
    for (let i = 0; i < nd.length; i++) { const w = Math.random() * 2 - 1; last = (last + .02 * w) / 1.02; nd[i] = last * 3.5; }
    this.brown = nb;
    const wb = c.createBuffer(1, c.sampleRate, c.sampleRate), wd = wb.getChannelData(0); for (let i = 0; i < wd.length; i++) wd[i] = Math.random() * 2 - 1; this.white = wb;
  },
  out(g, wet = .5) { g.connect(this.dry); const s = this.ctx.createGain(); s.gain.value = wet; g.connect(s); s.connect(this.verb); },
  setOn(v) { this.init(); if (!this.ctx) return; this.on = v; this.ctx.resume(); this.master.gain.setTargetAtTime(v ? .9 : 0, this.ctx.currentTime, .3); if (v && this.place) this.ambient(this.place); },
  env(g, t, a, peak, dec) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + dec); },
  tone(f, t, dur, peak = .1, type = 'sine', wet = .5, a = .005) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f; this.env(g, t, a, peak, dur); o.connect(g); this.out(g, wet); o.start(t); o.stop(t + a + dur + .05); return o; },
  noise(t, dur, f, q, peak, wet = .4, type = 'bandpass') { const c = this.ctx, s = c.createBufferSource(); s.buffer = this.white; const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const g = c.createGain(); this.env(g, t, .002, peak, dur); s.connect(fl); fl.connect(g); this.out(g, wet); s.start(t); s.stop(t + dur + .05); },
  ready() { return this.ctx && this.on; },
  bell(f = 110, peak = .14, dur = 7) { if (!this.ready()) return; const t = this.ctx.currentTime; [[1, 1], [2.0, .5], [2.76, .4], [5.4, .2], [8.9, .08]].forEach(([m, a]) => this.tone(f * m, t, dur / Math.sqrt(m), peak * a, 'sine', .7)); },
  moktak(t) { if (!this.ready()) return; t = t ?? this.ctx.currentTime; const o = this.tone(620, t, .16, .32, 'sine', .3); o.frequency.exponentialRampToValueAtTime(420, t + .12); this.noise(t, .04, 1400, 3, .25, .3); },
  chime() { if (!this.ready()) return; const t = this.ctx.currentTime; for (let i = 0; i < 3; i++) this.tone(rr(1900, 3300), t + i * rr(.08, .3), 2.5, .025, 'sine', .8); },
  tick() { if (!this.ready()) return; this.noise(this.ctx.currentTime, .03, 2600, 6, .18, .2); },
  clap() { if (!this.ready()) return; this.noise(this.ctx.currentTime, .06, 1500, .7, .3, .3); },
  match() { if (!this.ready()) return; const t = this.ctx.currentTime; this.noise(t, .25, 3000, .5, .12, .3, 'highpass'); this.tone(880, t + .1, 1.2, .03, 'sine', .9); },
  soft() { if (!this.ready()) return; const t = this.ctx.currentTime; this.tone(660, t, 1.5, .05, 'sine', .8, .02); this.tone(990, t + .05, 1.2, .025, 'sine', .8, .02); },
  voice(f, t, dur, vowel = 'a', peak = .06, wet = .55) {
    const c = this.ctx, o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t);
    const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 5; lg.gain.value = f * .012; lfo.connect(lg); lg.connect(o.frequency);
    const F = { a: [730, 1090, 2440], o: [570, 840, 2410], u: [300, 870, 2240], i: [390, 1990, 2550], e: [530, 1840, 2480] }[vowel];
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + .07); g.gain.setValueAtTime(peak, t + dur - .12); g.gain.linearRampToValueAtTime(0, t + dur);
    F.forEach((ff, k) => { const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = ff; bp.Q.value = 9; const bg = c.createGain(); bg.gain.value = [1, .5, .25][k]; o.connect(bp); bp.connect(bg); bg.connect(g); });
    this.out(g, wet); o.start(t); lfo.start(t); o.stop(t + dur + .05); lfo.stop(t + dur + .05);
  },
  organ(notes, t, dur, peak = .035) { notes.forEach((f) => { [[1, 1], [2, .45], [4, .15], [.5, .3]].forEach(([m, a]) => this.tone(f * m, t, dur, peak * a, 'sine', .55, .12)); }); },
  stopAmbient() { this.nodes.forEach((n) => { try { n.stop(); } catch (e) { } }); this.nodes = []; this.timers.forEach(clearTimeout); this.timers = []; },
  ambient(place) {
    this.place = place; if (!this.ctx) return; this.stopAmbient(); if (!this.on) return;
    const c = this.ctx;
    const bed = (f, gain) => { const s = c.createBufferSource(); s.buffer = this.brown; s.loop = true; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = f; const g = c.createGain(); g.gain.value = gain; s.connect(lp); lp.connect(g); g.connect(this.dry); s.start(); this.nodes.push(s); };
    const every = (min, max, fn) => { const go = () => { fn(); this.timers.push(setTimeout(go, rr(min, max) * 1000)); }; this.timers.push(setTimeout(go, rr(min, max) * 1000)); };
    const bird = () => { if (!this.ready()) return; const t = c.currentTime; const n = 2 + (Math.random() * 3 | 0), base = rr(2400, 3800); for (let i = 0; i < n; i++) { const o = this.tone(base, t + i * .13, .09, .018, 'sine', .4); o.frequency.exponentialRampToValueAtTime(base * rr(1.2, 1.5), t + i * .13 + .08); } };
    if (place === 'temple') { bed(380, .05); every(4, 10, bird); every(9, 22, () => this.chime()); every(50, 90, () => this.bell(82, .1, 9)); this.wet.gain.value = .4; }
    if (place === 'church') { bed(250, .025); every(8, 18, bird); this.wet.gain.value = .35; }
    if (place === 'cathedral') { bed(180, .035); every(60, 100, () => this.bell(98, .07, 10)); this.wet.gain.value = .75; }
    if (place === 'ohc') { bed(700, .03); every(.4, 3, () => { if (Math.random() < .6) this.tick(); }); this.wet.gain.value = .2; }
  },
  setListen(v) {
    this.listening = v; clearTimeout(this.loopTimer); if (!v) return;
    if (!this.on) this.setOn(true);
    const c = this.ctx, place = this.place;
    const loop = () => {
      if (!this.listening || this.place !== place) return;
      const t = c.currentTime + .1; let len = 0;
      if (place === 'temple') {
        const pitch = [146.8, 146.8, 164.8, 146.8, 130.8, 146.8], vow = ['a', 'u', 'a', 'i', 'a', 'u'];
        for (let rep = 0; rep < 2; rep++) for (let i = 0; i < 6; i++) { const tt = t + (rep * 6 + i) * .52 + rep * .5; this.moktak(tt); this.voice(pitch[i] * (rep ? .5 * 2 : 1), tt, .46, vow[i], .05); }
        len = 12 * .52 + 1.6;
      } else if (place === 'church') {
        const G = 196, chords = [[G, 246.9, 293.7], [261.6, 329.6, 392], [293.7, 370, 440], [G, 246.9, 293.7], [164.8, 246.9, 329.6], [261.6, 329.6, 392], [293.7, 370, 440], [G, 246.9, 392]];
        const mel = [392, 392, 440, 493.9, 493.9, 440, 392, 370, 392, 440, 493.9, 523.3, 493.9, 440, 440, 392];
        chords.forEach((ch, i) => this.organ([ch[0] / 2, ...ch], t + i * 1.7, 1.75));
        mel.forEach((f, i) => this.organ([f], t + i * .85, .9, .03));
        len = chords.length * 1.7 + .4;
      } else if (place === 'cathedral') {
        const D = 146.8, mel = [293.7, 349.2, 392, 440, 392, 349.2, 329.6, 293.7, 329.6, 349.2, 392, 349.2, 329.6, 293.7];
        this.voice(D, t, mel.length * .8, 'o', .025, .9); this.voice(D * 1.5, t, mel.length * .8, 'o', .015, .9);
        mel.forEach((f, i) => this.voice(f / 2, t + i * .8, .78, i % 3 ? 'o' : 'a', .045, .85));
        len = mel.length * .8 + 1.5;
      } else {
        const chords = [[261.6, 329.6, 392, 493.9], [220, 261.6, 329.6, 392], [174.6, 220, 261.6, 329.6], [196, 246.9, 293.7, 329.6]];
        chords.forEach((ch, i) => ch.concat(ch.slice(1, 3).reverse()).forEach((f, k) => { this.tone(f * 2, t + i * 2.1 + k * .35, 1.3, .045, 'sine', .3); this.tone(f, t + i * 2.1 + k * .35, .9, .02, 'triangle', .3); }));
        len = chords.length * 2.1;
      }
      this.loopTimer = setTimeout(loop, len * 1000);
    };
    loop();
  },
};

/* ───────── 상태 ───────── */
const state = {
  place: null, room: 1, me: null, myName: '', people: [], target: 0, seed: 1, shadows: true,
  yaw: 0, pitch: .3, dist: 5.4, keys: {}, toastAt: 0, beads: 0, busy: null,
};
const params = new URLSearchParams(location.search);
state.place = ORDER.includes(params.get('place')) ? params.get('place') : 'temple';
state.room = clamp(parseInt(params.get('room') || '0', 10) || (1 + (Math.random() * 30 | 0)), 1, 30);
try { state.myName = localStorage.getItem('maeum.name') || ''; } catch (e) { }
if (!state.myName) state.myName = randName();

/* ───────── 입장 화면 ───────── */
const placeCards = $('#placeCards');
let gatePlace = state.place;
ORDER.forEach((k) => {
  const b = document.createElement('button'); b.className = 'place'; b.type = 'button'; b.dataset.k = k;
  b.innerHTML = `${ICON[k]}<b>${PLACES[k].label}</b><small>${PLACES[k].sub}</small>`;
  b.onclick = () => { gatePlace = k; [...placeCards.children].forEach((c) => c.classList.toggle('on', c.dataset.k === k)); };
  placeCards.appendChild(b);
});
[...placeCards.children].forEach((c) => c.classList.toggle('on', c.dataset.k === gatePlace));
$('#nameInput').value = state.myName;
$('#reroll').onclick = () => { $('#nameInput').value = randName(); };
$('#enter').onclick = () => {
  state.myName = ($('#nameInput').value.trim() || randName()).slice(0, 10);
  try { localStorage.setItem('maeum.name', state.myName); } catch (e) { }
  Sound.init();
  $('#gate').classList.add('hide');
  enterPlace(gatePlace, state.room);
};

/* ───────── 장소 들어가기 ───────── */
function clearWorld() {
  if (!world) return;
  state.people.forEach((p) => world.group.remove(p.root));
  if (state.me) world.group.remove(state.me.root);
  scene.remove(world.group); disposeGroup(world.group); world = null;
  state.people = []; $('#labels').innerHTML = '';
}
function enterPlace(place, room) {
  const P0 = PLACES[place];
  $('#loadTitle').textContent = P0.title; $('#loadText').textContent = P0.loading;
  $('#loading').classList.add('show');
  setTimeout(() => {
    clearWorld();
    state.place = place; state.room = room; state.seed = (ORDER.indexOf(place) + 1) * 1000 + room;
    const R = mulberry32(state.seed);
    world = BUILD[place](); scene.add(world.group);
    world.flames = []; world.flickers = [];
    world.group.traverse((o) => { if (o.userData.flame) world.flames.push(o); if (o.userData.flicker) world.flickers.push(o); });
    if (world.candles) for (let i = 0; i < 9; i++) { const c = pick(world.candles, R); c.visible = true; c.userData.until = performance.now() + rr(60, 300, R) * 1000; }
    applyShadows();
    // 나
    const me = new Person(state.myName, place === 'ohc' ? 'office' : P0.style, mulberry32(42), true);
    me.root.position.set(world.start.x, 0, world.start.z); me.root.rotation.y = Math.PI; me.speed = 2.6;
    world.group.add(me.root); state.me = me;
    state.yaw = 0; state.pitch = .3; state.dist = place === 'ohc' ? 4.6 : 5.4;
    // 방문객
    const [lo, hi] = P0.range; state.target = Math.round(rr(lo, hi, R));
    const free = world.seats.slice();
    for (let i = 0; i < state.target && free.length; i++) {
      const s = free.splice(Math.floor(R() * free.length), 1)[0];
      const p = spawnPerson(R, s); p.root.position.set(s.x, 0, s.z); p.root.rotation.y = s.ry; p.seat = s; s.occ = p; p.state = 'seated';
      p.cur = { ...POSE[p.restPose()] }; p.setPose(p.restPose());
    }
    rnd = Math.random;
    const u = new URL(location.href); u.searchParams.set('place', place); u.searchParams.set('room', room); history.replaceState(null, '', u);
    buildHUD(); updateCount();
    Sound.ambient(place); if (Sound.listening) { Sound.listening = false; $('#listenBtn').classList.remove('on'); }
    $('#hud').classList.add('show'); $('#loading').classList.remove('show');
    setTimeout(() => $('#hint').classList.add('gone'), 6000);
    canvas.focus();
  }, 450);
}
function spawnPerson(R, seat) {
  const style = seat?.style || PLACES[state.place].style;
  const p = new Person(randName(R), style, R);
  world.group.add(p.root); state.people.push(p); return p;
}
function applyShadows() { renderer.shadowMap.enabled = state.shadows; if (world) world.group.traverse((o) => { if (o.isDirectionalLight) o.castShadow = state.shadows; }); }

/* ───────── HUD ───────── */
function buildHUD() {
  const P0 = PLACES[state.place];
  const tabs = $('#tabs'); tabs.innerHTML = '';
  ORDER.forEach((k) => { const b = document.createElement('button'); b.textContent = PLACES[k].label; b.className = k === state.place ? 'on' : ''; b.onclick = () => { if (k !== state.place) { closePanels(); enterPlace(k, state.room); } }; tabs.appendChild(b); });
  $('#roomName').textContent = P0.halls[(state.room - 1) % P0.halls.length]; $('#roomNo').textContent = state.room;
  $('#listenBtn').textContent = P0.listen;
  const acts = $('#actions'); acts.innerHTML = '';
  P0.actions.forEach((ac) => { const b = document.createElement('button'); b.dataset.id = ac.id; b.innerHTML = `${ACT_ICON[ac.icon]}<span>${ac.label}</span>`; b.onclick = () => doAction(ac); acts.appendChild(b); });
  setBusy(null);
}
function setBusy(text, onStop) {
  state.busy = text ? { onStop } : null;
  $('#busy').classList.toggle('show', !!text); if (text) $('#busyText').textContent = text;
}
$('#stopBtn').onclick = () => { const b = state.busy; setBusy(null); stopMe(); b && b.onStop && b.onStop(); };
function stopMe() { const me = state.me; me.path = []; me.seq = null; me.showProp(null); me.setPose(me.restPose()); [...$('#actions').children].forEach((b) => b.classList.remove('on')); }
function toast(text) {
  const box = $('#toasts'); const el = document.createElement('div'); el.className = 'toast'; el.textContent = text;
  box.insertBefore(el, $('#busy'));
  const ts = box.querySelectorAll('.toast'); if (ts.length > 2) ts[0].remove();
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 450); }, 3600);
}
function bubble(p, text) {
  const el = document.createElement('div'); el.className = 'bubble'; el.textContent = text; $('#labels').appendChild(el);
  p.bubbleEl && p.bubbleEl.remove(); p.bubbleEl = el; p.bubbleUntil = performance.now() + 2600;
}
function updateCount() { $('#count').textContent = state.people.length + 1; if ($('#visitPanel').classList.contains('show')) renderVisitors(); }

/* ───────── 동작 ───────── */
function freeSeatNear(pos, maxD = Infinity) {
  let best = null, bd = maxD;
  for (const s of world.seats) { if (s.occ) continue; const d = Math.hypot(s.x - pos.x, s.z - pos.z); if (d < bd) { bd = d; best = s; } }
  return best;
}
function leaveSeat(p) { if (p.seat) { p.seat.occ = null; p.lastSeat = p.seat; p.seat = null; } }
// 자리에 앉아 있으면 들어온 길(접근점·경유점)을 거꾸로 밟아 통로로 나온다
function routeFrom(p) {
  const s = p.seat || p.lastSeat, pos = p.root.position, pts = [];
  if (s && Math.hypot(pos.x - s.x, pos.z - s.z) < .6) { const ap = s.approach || s; pts.push({ x: ap.x, z: ap.z }); if (s.via) pts.push(...s.via.slice().reverse()); }
  return pts;
}
const aisleFor = (x) => world.aisleX + (state.place === 'ohc' ? 0 : (x > 0 ? .6 : -.6));
function walkToSeat(p, seat, then) {
  const pts = routeFrom(p); leaveSeat(p); seat.occ = p;
  const cur = pts.length ? pts[pts.length - 1] : { x: p.root.position.x, z: p.root.position.z };
  const ap = seat.approach || seat, via = seat.via || [], ax = aisleFor(ap.x), firstZ = via.length ? via[0].z : ap.z;
  if (Math.abs(cur.z - firstZ) > 1 || via.length) { if (Math.abs(cur.x - ax) > .3) pts.push({ x: ax, z: cur.z }); pts.push({ x: ax, z: firstZ }); }
  pts.push(...via, { x: ap.x, z: ap.z }, { x: seat.x, z: seat.z });
  p.goTo(pts, () => { p.seat = seat; p.root.rotation.y = seat.ry; p.setPose(p.restPose()); then && then(); });
}
const SEQ = {
  gassho: (p) => [{ pose: p.seat?.kind === 'floor' ? 'floorGassho' : 'gassho', d: .8, fn: () => p.isMe && Sound.soft() }, { pose: p.seat ? 'floorGassho' : 'halfBow', d: 1.1 }, { pose: p.seat ? 'floorGassho' : 'gassho', d: .7 }],
  bow: (p) => { const s = []; for (let i = 0; i < 3; i++) s.push({ pose: 'gassho', d: .9 }, { pose: 'bowKneel', d: .8 }, { pose: 'bowDown', d: 1.4, fn: () => p.isMe && Sound.moktak() }, { pose: 'bowKneel', d: .7 }); s.push({ pose: 'gassho', d: .9 }); return s; },
  beads: (p) => { const s = [{ pose: 'beads', d: .5, fn: () => p.showProp('beads') }]; for (let i = 0; i < 12; i++) s.push({ pose: 'beads', d: .55, fn: () => { p.a.extras.beads.rotation.z += .5; if (p.isMe) { state.beads = (state.beads % 108) + 1; Sound.tick(); setBusy(`염주 ${state.beads} / 108`, null); } } }); s.push({ d: .3, fn: () => p.showProp(null) }); return s; },
  pray: (p) => [{ pose: p.seat ? 'chairPray' : 'pray', d: 3.2, fn: () => p.isMe && Sound.soft() }],
  praise: (p) => { const s = []; for (let i = 0; i < 4; i++) s.push({ pose: 'praise', d: .8, fn: () => { p.root.rotation.z = .05; } }, { pose: P({ ax: -2.6, az: .1, bx: -2.6, bz: -.1, hx: -.25 }), d: .8, fn: () => { p.root.rotation.z = -.05; } }); s.push({ d: .2, fn: () => { p.root.rotation.z = 0; } }); return s; },
  amen: (p) => [{ pose: 'amen', d: .9, fn: () => p.isMe && Sound.soft() }, { pose: 'stand', d: .3 }],
  sit: () => [{ d: .3 }],
  cross: (p) => [{ pose: 'crossHead', d: .55, fn: () => p.isMe && Sound.soft() }, { pose: 'crossChest', d: .55 }, { pose: 'crossL', d: .5 }, { pose: 'crossR', d: .5 }, { pose: 'gassho', d: .8 }],
  kneel: (p) => [{ pose: 'kneel', d: 6, fn: (pp) => { pp.root.position.z -= .35; } }, { d: .2, fn: (pp) => { pp.root.position.z += .35; } }],
  candle: (p) => [{ pose: 'candleReach', d: 1.2, fn: () => { lightCandle(); p.isMe && Sound.match(); } }, { pose: 'gassho', d: 1.6 }, { pose: 'stand', d: .3 }],
  nod: (p) => [{ pose: 'nod', d: .7 }, { pose: 'stand', d: .3 }],
  work: (p) => { const k = p.seat?.kind; const pose = k === 'stool' ? 'typeStool' : k === 'stand' ? 'standWork' : 'type'; const s = []; for (let i = 0; i < 10; i++) s.push({ pose, d: .4, fn: () => p.isMe && Math.random() < .8 && Sound.tick() }); return s; },
  coffee: (p) => [{ pose: 'cupDown', d: .5, fn: () => p.showProp('cup') }, { pose: P({ ...POSE[p.restPose()], ax: -2.15, az: -.55 }), d: 1.4 }, { pose: P({ ...POSE[p.restPose()], ax: -1.1, az: -.2 }), d: 1.2 }, { pose: P({ ...POSE[p.restPose()], ax: -2.15, az: -.55 }), d: 1.2 }, { d: .3, fn: () => p.showProp(null) }],
  clap: (p) => { const s = []; const base = POSE[p.restPose()]; for (let i = 0; i < 5; i++) s.push({ pose: P({ ...base, ax: -1.15, az: -.3, bx: -1.15, bz: .3 }), d: .16 }, { pose: P({ ...base, ax: -1.15, az: -.66, bx: -1.15, bz: .66 }), d: .16, fn: () => p.isMe && Sound.clap() }); return s; },
};
function lightCandle() {
  if (!world.candles) return;
  const off = world.candles.filter((c) => !c.visible);
  const c = off.length ? pick(off) : pick(world.candles);
  c.visible = true; c.userData.until = performance.now() + rr(120, 300) * 1000;
}
function doAction(ac) {
  const me = state.me;
  closePanels();
  const btn = $(`#actions [data-id="${ac.id}"]`);
  const perform = () => {
    [...$('#actions').children].forEach((b) => b.classList.toggle('on', b === btn));
    if (ac.id === 'beads') setBusy(`염주 ${state.beads} / 108`, null);
    else if (ac.id !== 'sit') setBusy(PLACES[state.place].status[ac.id] || ac.label, null);
    me.run(SEQ[ac.id](me), () => { me.setPose(me.restPose()); btn && btn.classList.remove('on'); setBusy(null); });
    if (!ac.quiet) toast(`${state.myName}님이 ${ac.msg}`);
  };
  if (ac.id === 'candle') {
    const f = world.rackFront; setBusy(ac.busy, null); const st = routeFrom(me); leaveSeat(me);
    const cz = st.length ? st[st.length - 1].z : me.root.position.z;
    me.goTo([...st, { x: 4, z: cz }, { x: 4, z: f.z }, f], () => { me.root.rotation.y = Math.PI / 2; perform(); });
    return;
  }
  if (ac.id === 'coffee' && world.coffee && !me.seat) {
    const f = world.coffee; setBusy('일마지오로 가는 중', null); const st = routeFrom(me);
    const cz = st.length ? st[st.length - 1].z : me.root.position.z;
    me.goTo([...st, { x: 0, z: cz }, { x: 0, z: f.z - .8 }, f], () => { me.root.rotation.y = f.ry ?? Math.PI; perform(); });
    return;
  }
  if (ac.needSeat && !me.seat) {
    const s = freeSeatNear(me.root.position);
    if (!s) { toast('빈 자리가 없어요'); return; }
    setBusy(ac.busy, null); btn && btn.classList.add('on');
    walkToSeat(me, s, () => { if (ac.id === 'sit') { setBusy(null); btn && btn.classList.remove('on'); toast(`${PLACES[state.place].seatWord}에 앉았어요`); } else perform(); });
    return;
  }
  if (ac.id === 'sit') return;
  perform();
}

/* ───────── 방문객 흉내 ───────── */
function npcAct(p) {
  const P0 = PLACES[state.place];
  let options = P0.actions.filter((a) => a.id !== 'sit' && a.id !== 'candle');
  if (state.place === 'ohc') options = p.seat?.kind === 'stand' ? options.filter((a) => a.id === 'work' || a.id === 'nod') : options;
  if (state.place === 'temple') options = options.filter((a) => a.id !== 'bow' || Math.random() < .35);
  const ac = pick(options); if (!ac) return;
  p.act = ac.id;
  p.run(SEQ[ac.id](p), () => { p.act = null; p.setPose(p.restPose()); });
  const near = p.root.position.distanceTo(state.me.root.position) < 12;
  if (near && Math.random() < .7) bubble(p, ac.bubble);
  const now = performance.now();
  if (now - state.toastAt > rr(5000, 9000) && Math.random() < .55) { state.toastAt = now; toast(`${p.name}님이 ${ac.msg}`); }
  if (ac.id === 'candle') lightCandle();
}
function npcTick(dt) {
  const P0 = PLACES[state.place];
  for (const p of state.people.slice()) {
    if (p.state === 'leaving') { if (!p.path.length) { removePerson(p); } continue; }
    if (p.state === 'entering') continue;
    p.think -= dt; p.life -= dt;
    if (p.think <= 0 && !p.seq) {
      p.think = rr(8, 26);
      if (state.place === 'cathedral' && Math.random() < .06 && world.candles) { lightCandle(); if (performance.now() - state.toastAt > 6000) { state.toastAt = performance.now(); toast(`${p.name}님이 초를 봉헌했어요`); } }
      else npcAct(p);
    }
    if (p.life <= 0 && !p.seq && state.people.length > state.target - 6) {
      p.state = 'leaving'; const start = routeFrom(p); leaveSeat(p); p.setPose('stand');
      const d = world.door, cur = start.length ? start[start.length - 1] : p.root.position, ax = aisleFor(cur.x);
      p.goTo([...start, { x: ax, z: cur.z }, { x: d.x + rr(-.8, .8), z: d.z }]);
      if (Math.random() < .5 && performance.now() - state.toastAt > 4000) { state.toastAt = performance.now(); toast(`${p.name}님이 ${P0.leave}`); }
    }
  }
}
function removePerson(p) { world.group.remove(p.root); p.bubbleEl && p.bubbleEl.remove(); state.people.splice(state.people.indexOf(p), 1); updateCount(); }
let spawnTimer = 6;
function spawnTick(dt) {
  spawnTimer -= dt; if (spawnTimer > 0) return;
  spawnTimer = rr(5, 14);
  // 목표 인원이 천천히 오르내린다
  const [lo, hi] = PLACES[state.place].range; state.target = clamp(state.target + Math.round(rr(-2, 2)), lo, hi);
  if (state.people.length >= state.target + 2) return;
  const empty = world.seats.filter((s) => !s.occ); if (!empty.length) return;
  const s = pick(empty);
  const p = spawnPerson(Math.random, s); const d = world.door;
  p.root.position.set(d.x + rr(-.8, .8), 0, d.z); p.root.rotation.y = Math.PI; p.state = 'entering';
  walkToSeat(p, s, () => { p.state = 'seated'; if (Math.random() < .5) setTimeout(() => npcAct(p), 1500); });
  updateCount();
  if (Math.random() < .55 && performance.now() - state.toastAt > 4000) { state.toastAt = performance.now(); toast(`${p.name}님이 ${PLACES[state.place].enter}`); }
}

/* ───────── 입력 ───────── */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
let drag = null;
canvas.addEventListener('pointerdown', (e) => { if (touches.size) return; drag = { x: e.clientX, y: e.clientY, moved: 0, id: e.pointerId }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  if (!drag || drag.id !== e.pointerId) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.moved += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY;
  state.yaw -= dx * .006; state.pitch = clamp(state.pitch + dy * .004, .04, 1.25);
});
canvas.addEventListener('pointerup', (e) => {
  if (!drag) return; const moved = drag.moved; drag = null;
  if (moved > 8 || !world) return;
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  const hit = new THREE.Vector3(); if (!ray.ray.intersectPlane(floorPlane, hit)) return;
  const b = world.bounds; hit.x = clamp(hit.x, b.x0 ?? -b.x, b.x1 ?? b.x); hit.z = clamp(hit.z, b.z0, b.z1);
  const me = state.me; closePanels();
  const s = freeSeatNear(hit, .75);
  setBusy(null); [...$('#actions').children].forEach((x) => x.classList.remove('on'));
  if (s) { setBusy(`${PLACES[state.place].seatWord}로 가는 중`, null); walkToSeat(me, s, () => setBusy(null)); }
  else {
    if (world.blocked && world.blocked(hit.x, hit.z)) return;
    const st = routeFrom(me); leaveSeat(me); me.setPose('stand');
    const from = st.length ? st[st.length - 1] : me.root.position;
    me.goTo([...st, ...(world.route ? world.route(from, hit) : [hit])]);
  }
});
// 확대·축소: 휠, 두 손가락 벌리기, +/- 단추와 키. Company 는 거리가 넓어 더 멀리까지 물러난다
const zoomMax = () => state.place === 'ohc' ? 70 : 20;
const zoomBy = (f) => { state.dist = clamp(state.dist * f, 1.6, zoomMax()); };
canvas.addEventListener('wheel', (e) => { zoomBy(Math.exp(e.deltaY * .0015)); e.preventDefault(); }, { passive: false });
const touches = new Map(); let pinch = 0;
canvas.addEventListener('pointerdown', (e) => { touches.set(e.pointerId, e); if (touches.size === 2) { const [a, b] = touches.values(); pinch = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); drag = null; } });
canvas.addEventListener('pointermove', (e) => {
  if (!touches.has(e.pointerId)) return; touches.set(e.pointerId, e);
  if (touches.size === 2 && pinch) { const [a, b] = touches.values(), d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); if (d > 0) zoomBy(pinch / d); pinch = d; }
});
for (const t of ['pointerup', 'pointercancel']) canvas.addEventListener(t, (e) => { touches.delete(e.pointerId); if (touches.size < 2) pinch = 0; });
$('#zoomIn').onclick = () => zoomBy(1 / 1.35);
$('#zoomOut').onclick = () => zoomBy(1.35);
addEventListener('keydown', (e) => { if (e.target.tagName === 'INPUT') return; if (e.key === '+' || e.key === '=') zoomBy(1 / 1.2); if (e.key === '-' || e.key === '_') zoomBy(1.2); });
addEventListener('keydown', (e) => { if (e.target.tagName === 'INPUT') return; state.keys[e.key.toLowerCase()] = true; });
addEventListener('keyup', (e) => { state.keys[e.key.toLowerCase()] = false; });
addEventListener('blur', () => { state.keys = {}; });

function keyMove(dt) {
  const k = state.keys, me = state.me;
  let f = 0, s = 0;
  if (k.w || k.arrowup) f += 1; if (k.s || k.arrowdown) f -= 1; if (k.a || k.arrowleft) s -= 1; if (k.d || k.arrowright) s += 1;
  if (!f && !s) return false;
  if (me.seq || me.path.length) { me.seq = null; me.path = []; me.showProp(null); setBusy(null); }
  leaveSeat(me);
  const fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw), rx = -fz, rz = fx;
  let dx = fx * f + rx * s, dz = fz * f + rz * s; const d = Math.hypot(dx, dz); dx /= d; dz /= d;
  const p = me.root.position, b = world.bounds;
  const nx = clamp(p.x + dx * me.speed * dt, b.x0 ?? -b.x, b.x1 ?? b.x), nz = clamp(p.z + dz * me.speed * dt, b.z0, b.z1), bl = world.blocked;
  if (!bl || !bl(nx, nz)) { p.x = nx; p.z = nz; } else if (!bl(nx, p.z)) p.x = nx; else if (!bl(p.x, nz)) p.z = nz;
  const want = Math.atan2(dx, dz); let diff = want - me.root.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); me.root.rotation.y += diff * Math.min(1, dt * 12);
  me.setPose('stand'); me.extWalk = true;
  return true;
}

/* ───────── 패널 ───────── */
function closePanels() { document.querySelectorAll('.panel').forEach((p) => p.classList.remove('show')); }
document.querySelectorAll('[data-close]').forEach((b) => b.onclick = closePanels);
function togglePanel(id, fill) { const el = $(id), was = el.classList.contains('show'); closePanels(); if (!was) { fill && fill(); el.classList.add('show'); } }
function renderVisitors() {
  const P0 = PLACES[state.place], ul = $('#vlist'); ul.innerHTML = '';
  const row = (name, st, me) => { const li = document.createElement('li'); if (me) li.className = 'me'; li.innerHTML = `<b></b><span></span>`; li.firstChild.textContent = me ? `${name} (나)` : name; li.lastChild.textContent = st; ul.appendChild(li); };
  const stOf = (p) => p.state === 'entering' ? '들어오는 중' : p.state === 'leaving' ? '나가는 중' : p.act ? (P0.status[p.act] || '') : p.seat ? P0.status.seated : P0.status.walking;
  row(state.myName, state.me.seq ? '함께하는 중' : state.me.seat ? P0.status.seated : '둘러보는 중', true);
  state.people.slice(0, 80).forEach((p) => row(p.name, stOf(p)));
}
$('#countBtn').onclick = () => togglePanel('#visitPanel', renderVisitors);
$('#roomBtn').onclick = () => togglePanel('#roomPanel', () => {
  const P0 = PLACES[state.place], box = $('#rooms'); box.innerHTML = ''; $('#roomPanelTitle').textContent = `${P0.label} · 방 고르기`;
  for (let i = 1; i <= 30; i++) {
    const R = mulberry32((ORDER.indexOf(state.place) + 1) * 1000 + i), n = i === state.room ? state.people.length + 1 : Math.round(rr(P0.range[0], P0.range[1], R));
    const b = document.createElement('button'); b.className = i === state.room ? 'on' : '';
    b.innerHTML = `<span>${P0.halls[(i - 1) % P0.halls.length]} ${i}</span><small>${n}명</small>`;
    b.onclick = () => { closePanels(); if (i !== state.room) enterPlace(state.place, i); }; box.appendChild(b);
  }
});
$('#setBtn').onclick = () => togglePanel('#setPanel', () => { $('#nameEdit').value = state.myName; });
$('#nameSave').onclick = () => { const v = $('#nameEdit').value.trim(); if (!v) return; state.myName = v.slice(0, 10); state.me.name = state.myName; try { localStorage.setItem('maeum.name', state.myName); } catch (e) { } toast(`이제 ${state.myName}님으로 불려요`); };
$('#shadowBtn').onclick = () => { state.shadows = !state.shadows; $('#shadowBtn').textContent = state.shadows ? '켜짐' : '꺼짐'; applyShadows(); world && world.group.traverse((o) => { if (o.material) o.material.needsUpdate = true; }); };
$('#qualityBtn').onclick = () => {
  quality = quality === 'mid' ? 'high' : quality === 'high' ? 'low' : 'mid';
  $('#qualityBtn').textContent = { low: '가볍게', mid: '보통', high: '선명하게' }[quality];
  renderer.setPixelRatio(quality === 'low' ? 1 : quality === 'high' ? Math.min(devicePixelRatio, 2.5) : Math.min(devicePixelRatio, 1.75)); resize();
};
const SOUND_OFF = '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l4 6M21 9l-4 6"/>', SOUND_ON = '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>';
function syncSound() { $('#soundIcon').innerHTML = Sound.on ? SOUND_ON : SOUND_OFF; $('#soundBtn').setAttribute('aria-label', Sound.on ? '소리 끄기' : '소리 켜기'); }
syncSound();
$('#soundBtn').onclick = () => { Sound.setOn(!Sound.on); if (!Sound.on) { Sound.setListen(false); $('#listenBtn').classList.remove('on'); } syncSound(); };
$('#listenBtn').onclick = () => { const v = !Sound.listening; Sound.setListen(v); $('#listenBtn').classList.toggle('on', v); syncSound(); };
$('#shotBtn').onclick = () => {
  renderer.render(scene, camera);
  const a = document.createElement('a'); a.download = `maeum-${state.place}-${Date.now()}.png`; a.href = canvas.toDataURL('image/png'); a.click();
  const f = $('#flash'); f.style.opacity = .7; setTimeout(() => f.style.opacity = 0, 80);
  toast('장면을 담았어요');
};
$('#exitBtn').onclick = () => { closePanels(); Sound.setListen(false); $('#listenBtn').classList.remove('on'); $('#hud').classList.remove('show'); $('#gate').classList.remove('hide'); gatePlace = state.place; [...placeCards.children].forEach((c) => c.classList.toggle('on', c.dataset.k === gatePlace)); };
document.addEventListener('visibilitychange', () => { if (Sound.ctx) { document.hidden ? Sound.ctx.suspend() : Sound.on && Sound.ctx.resume(); } });

/* ───────── 이름표 ───────── */
const tmpV = new THREE.Vector3();
let meLabel = null;
function project(obj, yOff) { obj.getWorldPosition(tmpV); tmpV.y += yOff; tmpV.project(camera); return { x: (tmpV.x * .5 + .5) * innerWidth, y: (-tmpV.y * .5 + .5) * innerHeight, vis: tmpV.z < 1 }; }
function updateLabels() {
  if (!meLabel || !meLabel.isConnected) { meLabel = document.createElement('div'); meLabel.className = 'label'; $('#labels').appendChild(meLabel); }
  if (meLabel.dataset.n !== state.myName) { meLabel.dataset.n = state.myName; meLabel.innerHTML = '<i>나</i>'; meLabel.appendChild(document.createTextNode(state.myName)); }
  const p = project(state.me.root, state.me.cur.hy + 1.25);
  meLabel.style.left = p.x + 'px'; meLabel.style.top = p.y + 'px'; meLabel.style.display = p.vis ? 'flex' : 'none';
  const now = performance.now();
  for (const q of state.people) {
    if (!q.bubbleEl) continue;
    if (now > q.bubbleUntil) { q.bubbleEl.remove(); q.bubbleEl = null; continue; }
    const pp = project(q.root, q.cur.hy + 1.2); q.bubbleEl.style.left = pp.x + 'px'; q.bubbleEl.style.top = pp.y + 'px'; q.bubbleEl.style.display = pp.vis ? 'block' : 'none';
  }
}

/* ───────── 루프 ───────── */
const clock = new THREE.Clock();
const camTarget = new THREE.Vector3(), camPos = new THREE.Vector3();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  if (!world) { renderer.render(scene, camera); return; }
  keyMove(dt);
  state.me.update(dt, t);
  for (const p of state.people) p.update(dt, t);
  npcTick(dt); spawnTick(dt); world.tick && world.tick(dt, t);
  // 촛불 흔들림·꺼짐
  const now = performance.now();
  for (const o of world.flames) { o.scale.y = 1 + Math.sin(t * 13 + o.id) * .15; if (o.userData.until && now > o.userData.until) { o.visible = false; o.userData.until = 0; } }
  for (const o of world.flickers) o.intensity = (o.userData.base ??= o.intensity) * (0.85 + Math.sin(t * 9 + o.id) * .08 + Math.random() * .07);
  if (world.candleLight) { const lit = world.candles.filter((c) => c.visible).length; world.candleLight.userData.base = lit * .45; }
  // 카메라
  const mp = state.me.root.position;
  camTarget.lerp(tmpV.set(mp.x, (state.me.cur.hy > .4 ? 1.15 : .8), mp.z), Math.min(1, dt * 6));
  const cp = Math.cos(state.pitch);
  camPos.set(camTarget.x + Math.sin(state.yaw) * cp * state.dist, camTarget.y + Math.sin(state.pitch) * state.dist, camTarget.z + Math.cos(state.yaw) * cp * state.dist);
  camPos.y = Math.max(.4, camPos.y);
  camera.position.lerp(camPos, Math.min(1, dt * 8)); camera.lookAt(camTarget.x, camTarget.y + .25, camTarget.z);
  renderer.render(scene, camera);
  updateLabels();
}
camera.position.set(0, 3, 20);
frame();
// 처음부터 입장 화면이 뜨지만, 링크에 place가 있으면 그 장소를 골라 둔다
if (params.get('place')) { gatePlace = state.place; [...placeCards.children].forEach((c) => c.classList.toggle('on', c.dataset.k === gatePlace)); }
window.__maeum = { state, enterPlace, PLACES, get world() { return world; } };
