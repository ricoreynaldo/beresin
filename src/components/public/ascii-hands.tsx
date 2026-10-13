"use client";

import * as React from "react";

/**
 * Dua tangan ala "The Creation of Adam" yang digambar sebagai titik & karakter
 * ASCII di atas <canvas>.
 *
 * Siluet tiap tangan disusun dari poligon (lengan + punggung tangan) dan jari
 * berbentuk kapsul meruncing, dalam koordinat lokal ±470×270 yang proporsinya
 * mengikuti referensi desain. Siluet dirender ke mask lalu disampling per sel
 * grid. Karakter di tiap sel ditentukan oleh kedalaman (jarak ke tepi), noise,
 * dan "tone": elips terang/gelap yang meniru arsiran cahaya di referensi.
 */

type Pt = readonly [number, number];
type Limb = { pts: Pt[]; w: readonly [number, number] };
/** Elips arsiran di koordinat lokal; amt positif = lebih padat/gelap, negatif = terang. */
type Tone = { x: number; y: number; rx: number; ry: number; rot: number; amt: number };
type HandShape = {
  polys: Pt[][];
  limbs: Limb[];
  /** Ujung telunjuk (titik sentuh) di koordinat lokal. */
  tip: Pt;
  tones: Tone[];
  /** Efek tepi atas: positif = tepi atas padat (bulatan), negatif = tepi atas terang. */
  rim: number;
  /** Peluang sel terpadat digambar sebagai bulatan, bukan karakter. */
  circles: number;
  /** Kepadatan dasar seluruh tangan. */
  base: number;
};

/**
 * Tangan kiri, menghadap kanan: lengan tebal naik diagonal dari kiri bawah,
 * pergelangan menekuk, punggung tangan melengkung turun ke telunjuk; jari
 * lain menggantung lemas di bawahnya.
 */
const ADAM: HandShape = {
  polys: [
    [
      [-900, 420], [-300, 130], [0, 60], [40, 52], [80, 43], [120, 32], [160, 20], [183, 12],
      [205, 14], [233, 22], [270, 33], [300, 43], [330, 57], [355, 70], [383, 92], [410, 112],
      [428, 128], [412, 142], [380, 146], [345, 142], [310, 137], [275, 128], [245, 116],
      [215, 106], [192, 106], [170, 116], [140, 132], [105, 150], [75, 172], [45, 195],
      [0, 215], [-300, 330], [-900, 560],
    ],
  ],
  limbs: [
    { pts: [[416, 140], [426, 155], [432, 168]], w: [18, 12] },
    { pts: [[325, 128], [318, 155], [310, 180], [303, 203]], w: [34, 16] },
    { pts: [[378, 132], [386, 165], [392, 198], [396, 226]], w: [28, 15] },
    { pts: [[410, 112], [432, 135], [446, 157], [453, 174]], w: [26, 15] },
  ],
  tip: [456, 182],
  tones: [
    { x: 105, y: 112, rx: 80, ry: 22, rot: -0.35, amt: -0.6 },
    { x: 240, y: 78, rx: 30, ry: 14, rot: 0.3, amt: -0.45 },
    { x: 300, y: 108, rx: 26, ry: 10, rot: 0.2, amt: -0.3 },
    { x: 30, y: 192, rx: 75, ry: 30, rot: -0.45, amt: 0.4 },
    { x: 265, y: 42, rx: 95, ry: 18, rot: 0.35, amt: 0.3 },
    { x: 395, y: 200, rx: 12, ry: 30, rot: 0.1, amt: 0.2 },
  ],
  rim: 0.32,
  circles: 0.85,
  base: 0.14,
};

/**
 * Tangan kanan, menghadap kiri: lengan lurus dari kanan, telunjuk terjulur
 * horizontal, jari tengah & manis tertekuk menggantung ke bawah.
 */
const CREATOR: HandShape = {
  polys: [
    [
      [8, 92], [12, 80], [40, 72], [80, 66], [120, 64], [145, 62], [175, 57], [215, 45],
      [265, 35], [300, 27], [350, 13], [400, 8], [480, 6], [900, 0], [900, 140], [480, 135],
      [400, 133], [330, 135], [300, 145], [270, 158], [240, 166], [205, 166], [190, 150],
      [165, 138], [148, 124], [135, 106], [110, 104], [80, 104], [40, 103], [14, 100],
    ],
  ],
  limbs: [
    { pts: [[200, 165], [210, 198], [222, 220], [232, 232]], w: [22, 13] },
    { pts: [[178, 140], [176, 175], [172, 212]], w: [28, 16] },
    { pts: [[150, 135], [152, 175], [153, 220], [156, 262]], w: [32, 17] },
    { pts: [[110, 84], [70, 85], [35, 87], [14, 90]], w: [24, 16] },
  ],
  tip: [6, 91],
  tones: [
    { x: 330, y: 36, rx: 240, ry: 28, rot: -0.12, amt: -0.55 },
    { x: 85, y: 71, rx: 80, ry: 8, rot: 0, amt: -0.45 },
    { x: 290, y: 115, rx: 170, ry: 28, rot: -0.05, amt: 0.28 },
    { x: 160, y: 200, rx: 20, ry: 60, rot: 0, amt: 0.15 },
  ],
  rim: -0.25,
  circles: 0.1,
  base: 0.2,
};

const TIERS = [
  { chars: ".·:.·", gray: 150, alpha: 0.95 },
  { chars: ":;?7=", gray: 146, alpha: 0.9 },
  { chars: "$S%5?$", gray: 128, alpha: 1 },
  { chars: "#%$@#", gray: 124, alpha: 1 },
] as const;

type Particle = {
  x: number;
  y: number;
  hand: 0 | 1;
  tier: number;
  circle: boolean;
  ch: string;
  r: number;
  seed: number;
  delay: number;
  sx: number;
  sy: number;
  tipDist: number;
};

type Placement = { ox: number; oy: number; tip: Pt };

type Scene = {
  width: number;
  height: number;
  scale: number;
  step: number;
  particles: Particle[];
  hands: [Placement, Placement];
  /** Pergeseran tiap tangan saat sudah bersentuhan. */
  travel: [Pt, Pt];
};

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Value noise halus untuk tekstur kepadatan karakter. */
function noise(x: number, y: number) {
  const cell = 22;
  const gx = Math.floor(x / cell);
  const gy = Math.floor(y / cell);
  const fx = x / cell - gx;
  const fy = y / cell - gy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const h = (i: number, j: number) => rand(i * 157.31 + j * 311.7);
  const top = h(gx, gy) + (h(gx + 1, gy) - h(gx, gy)) * sx;
  const bottom = h(gx, gy + 1) + (h(gx + 1, gy + 1) - h(gx, gy + 1)) * sx;
  return top + (bottom - top) * sy;
}

function toneAt(shape: HandShape, lx: number, ly: number) {
  let sum = 0;
  for (const t of shape.tones) {
    const dx = lx - t.x;
    const dy = ly - t.y;
    const cos = Math.cos(-t.rot);
    const sin = Math.sin(-t.rot);
    const u = (dx * cos - dy * sin) / t.rx;
    const v = (dx * sin + dy * cos) / t.ry;
    sum += t.amt * Math.exp(-(u * u + v * v) * 1.4);
  }
  return sum;
}

function buildScene(width: number, height: number): Scene {
  const narrow = width < 640;
  const tipX = ADAM.tip[0];
  const scale = narrow
    ? Math.min(0.6, Math.max(0.4, (width * 0.6) / tipX))
    : Math.min(1.25, Math.max(0.55, (width * 0.41) / tipX));
  const step = narrow ? 4 : Math.min(6, Math.max(4, Math.round(5 * scale + 0.6)));

  const leftTarget: Pt = narrow ? [width * 0.42, height * 0.76] : [width * 0.405, height * 0.6];
  const rightTarget: Pt = narrow ? [width * 0.58, height * 0.66] : [width * 0.595, height * 0.5];

  const shapes = [ADAM, CREATOR];
  const hands: [Placement, Placement] = [
    {
      ox: leftTarget[0] - ADAM.tip[0] * scale,
      oy: leftTarget[1] - ADAM.tip[1] * scale,
      tip: leftTarget,
    },
    {
      ox: rightTarget[0] - CREATOR.tip[0] * scale,
      oy: rightTarget[1] - CREATOR.tip[1] * scale,
      tip: rightTarget,
    },
  ];

  const contact: Pt = [(leftTarget[0] + rightTarget[0]) / 2, (leftTarget[1] + rightTarget[1]) / 2];
  const travel: [Pt, Pt] = [
    [contact[0] - leftTarget[0] - 1, contact[1] - leftTarget[1]],
    [contact[0] - rightTarget[0] + 1, contact[1] - rightTarget[1]],
  ];

  // Lengan harus tetap menyambung ke tepi layar walau tangan bergeser ke tengah.
  const margin = Math.ceil(Math.abs(travel[0][0]) + 40);
  const maskWidth = width + margin * 2;

  const particles: Particle[] = [];

  hands.forEach((place, handIndex) => {
    const shape = shapes[handIndex];
    const mask = document.createElement("canvas");
    mask.width = maskWidth;
    mask.height = height;
    const ctx = mask.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const map = ([x, y]: Pt): Pt => [margin + place.ox + x * scale, place.oy + y * scale];

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
    ctx.lineJoin = "round";
    ctx.lineWidth = 8 * scale;
    for (const poly of shape.polys) {
      ctx.beginPath();
      poly.forEach((p, i) => {
        const [x, y] = map(p);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Jari: stempel lingkaran di sepanjang garis, radius mengecil ke ujung.
    // Digambar merah supaya sel jari bisa dikenali saat sampling (kanal hijau = 0).
    ctx.fillStyle = "#f00";
    for (const limb of shape.limbs) {
      const pts = limb.pts.map(map);
      const lengths = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
      const total = lengths.reduce((a, b) => a + b, 0);
      let walked = 0;
      for (let i = 0; i < lengths.length; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[i + 1];
        for (let d = 0; d <= lengths[i]; d += 1.5) {
          const t = (walked + d) / total;
          const radius = ((limb.w[0] + (limb.w[1] - limb.w[0]) * t) / 2) * scale;
          const k = d / (lengths[i] || 1);
          ctx.beginPath();
          ctx.arc(x1 + (x2 - x1) * k, y1 + (y2 - y1) * k, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        walked += lengths[i];
      }
    }

    const data = ctx.getImageData(0, 0, maskWidth, height).data;
    const cols = Math.floor(maskWidth / step);
    const rows = Math.floor(height / step);
    const inside = new Uint8Array(cols * rows);
    const finger = new Uint8Array(cols * rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = Math.floor(c * step + step / 2);
        const py = Math.floor(r * step + step / 2);
        const at = (py * maskWidth + px) * 4;
        inside[r * cols + c] = data[at + 3] > 127 ? 1 : 0;
        finger[r * cols + c] = data[at + 3] > 127 && data[at + 1] < 128 ? 1 : 0;
      }
    }

    // Transformasi jarak (chamfer, 2 lintasan) di grid sel → kedalaman dari tepi.
    const dist = new Float32Array(cols * rows);
    const BIG = 1e6;
    for (let i = 0; i < dist.length; i++) dist[i] = inside[i] ? BIG : 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        if (!dist[i]) continue;
        let v = dist[i];
        if (c > 0) v = Math.min(v, dist[i - 1] + 1);
        if (r > 0) v = Math.min(v, dist[i - cols] + 1);
        if (r > 0 && c > 0) v = Math.min(v, dist[i - cols - 1] + 1.4);
        if (r > 0 && c < cols - 1) v = Math.min(v, dist[i - cols + 1] + 1.4);
        dist[i] = v;
      }
    }
    for (let r = rows - 1; r >= 0; r--) {
      for (let c = cols - 1; c >= 0; c--) {
        const i = r * cols + c;
        if (!dist[i]) continue;
        let v = dist[i];
        if (c < cols - 1) v = Math.min(v, dist[i + 1] + 1);
        if (r < rows - 1) v = Math.min(v, dist[i + cols] + 1);
        if (r < rows - 1 && c < cols - 1) v = Math.min(v, dist[i + cols + 1] + 1.4);
        if (r < rows - 1 && c > 0) v = Math.min(v, dist[i + cols - 1] + 1.4);
        dist[i] = v;
      }
    }

    const depthRange = Math.max(3, (20 * scale) / step);
    const rimRows = Math.max(1, Math.round((9 * scale) / step));
    const tip = place.tip;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const x = c * step + step / 2 - margin;
        const y = r * step + step / 2;
        const seed = handIndex * 100_000 + i;

        let tier: number;
        if (inside[i]) {
          const d = dist[i];
          const isFinger = finger[i] === 1;
          if (d <= 1 && !isFinger && rand(seed) < 0.15) continue; // tepi sedikit bergerigi
          const depth = Math.min(1, d / depthRange);
          const rim = r >= rimRows && !inside[i - cols * rimRows] ? 1 : 0;
          const lx = (x - place.ox) / scale;
          const ly = (y - place.oy) / scale;
          // Jari tipis kalah di faktor kedalaman, jadi diberi tambahan agar tetap tegas.
          const v =
            shape.base +
            (isFinger ? 0.18 : 0) +
            depth * 0.4 +
            noise(x + handIndex * 500, y) * 0.4 +
            rim * shape.rim +
            toneAt(shape, lx, ly);
          // Area terang di referensi bukan kosong, tapi titik-titik jarang.
          if (v < 0.2 && !isFinger && rand(seed + 0.25) < 0.55) continue;
          tier = v < 0.36 ? 0 : v < 0.56 ? 1 : v < 0.78 ? 2 : 3;
        } else {
          // Serpihan titik di sekitar tepi, seperti di referensi.
          const near =
            (c > 1 && inside[i - 2]) ||
            (c < cols - 2 && inside[i + 2]) ||
            (r > 1 && inside[i - cols * 2]) ||
            (r < rows - 2 && inside[i + cols * 2]);
          if (!near || rand(seed + 0.5) > 0.05) continue;
          tier = 0;
        }

        const chars = TIERS[tier].chars;
        const angle = rand(seed + 1) * Math.PI * 2;
        const spread = (40 + rand(seed + 2) * 90) * scale;
        const along = handIndex === 0 ? x / tip[0] : (width - x) / (width - tip[0]);

        particles.push({
          x,
          y,
          hand: handIndex as 0 | 1,
          tier,
          circle: tier === 3 && rand(seed + 7) < shape.circles * (finger[i] ? 0.4 : 1),
          ch: chars[Math.floor(rand(seed + 3) * chars.length)],
          r: step * (0.34 + rand(seed + 4) * 0.14),
          seed: rand(seed + 5) * Math.PI * 2,
          delay: Math.min(1, Math.max(0, along)) * 0.55 + rand(seed + 6) * 0.25,
          sx: Math.cos(angle) * spread,
          sy: Math.sin(angle) * spread,
          tipDist: Math.hypot(x - tip[0], y - tip[1]),
        });
      }
    }
  });

  return { width, height, scale, step, particles, hands, travel };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const INTRO_MS = 900;
const REACH_MS = 1500;
const AFTER_CONTACT_MS = 1100;
/** Warna karakter saat tangan sudah "tajam" setelah bersentuhan. */
const CLEAR_GRAY = 30;
/** Bulatan lebih tebal dari karakter, jadi warna tajamnya dibuat lebih terang agar tidak menggumpal. */
const CLEAR_GRAY_CIRCLE = 92;

export type AsciiHandsHandle = {
  /** Menggerakkan kedua tangan sampai bersentuhan; resolve setelah efek sentuhan. */
  reach: () => Promise<void>;
};

export const AsciiHands = React.forwardRef<AsciiHandsHandle, { className?: string }>(
  function AsciiHands({ className }, ref) {
    const wrapRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const sceneRef = React.useRef<Scene | null>(null);
    const startRef = React.useRef(0);
    const reachRef = React.useRef<{ start: number; resolve: () => void; done: boolean } | null>(
      null
    );
    const reducedRef = React.useRef(false);

    React.useImperativeHandle(ref, () => ({
      reach() {
        if (reducedRef.current || !sceneRef.current) return Promise.resolve();
        if (reachRef.current) return Promise.resolve();
        return new Promise<void>((resolve) => {
          reachRef.current = { start: performance.now(), resolve, done: false };
        });
      },
    }));

    React.useEffect(() => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!wrap || !canvas || !ctx) return;

      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedRef.current = media.matches;

      let frame = 0;
      let visible = true;

      function draw(now: number) {
        const scene = sceneRef.current;
        if (!scene || !ctx) return;
        const reduced = reducedRef.current;
        const { width, height, particles, travel, scale, step } = scene;
        const elapsed = reduced ? Infinity : now - startRef.current;

        const reach = reachRef.current;
        const reachT = reach ? Math.min(1, (now - reach.start) / REACH_MS) : 0;
        const rp = easeInOutCubic(reachT);
        const sinceContact = reach && reachT >= 1 ? now - reach.start - REACH_MS : -1;

        const offsets = [0, 1].map((h) => {
          const bob = reduced ? 0 : Math.sin(now * 0.0009 + h * Math.PI) * 3 * scale * (1 - rp);
          return [travel[h][0] * rp, travel[h][1] * rp + bob] as const;
        });

        ctx.clearRect(0, 0, width, height);
        ctx.font = `500 ${Math.round(step * 1.2)}px ui-monospace, Menlo, Consolas, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Setelah bersentuhan, tangan "menajam": mulai dari ujung jari lalu menjalar
        // ke seluruh tangan, karakter jadi gelap, pekat, dan berhenti berkerlip.
        const front = sinceContact >= 0 ? sinceContact * 1.4 : -1;
        const spread = 160 * scale;

        for (const p of particles) {
          const intro = reduced
            ? 1
            : easeOutCubic(Math.min(1, Math.max(0, (elapsed - p.delay * 1000) / INTRO_MS)));
          if (intro <= 0) continue;

          const [dx, dy] = offsets[p.hand];
          const x = p.x + dx + (1 - intro) * p.sx;
          const y = p.y + dy + (1 - intro) * p.sy;
          if (x < -12 || x > width + 12) continue;

          const clear =
            front >= 0 ? easeOutCubic(Math.min(1, Math.max(0, (front - p.tipDist) / spread))) : 0;

          const tier = TIERS[p.tier];
          let alpha = tier.alpha * intro;
          if (!reduced) {
            const flicker = 0.78 + 0.22 * Math.sin(now * 0.0016 + p.x * 0.013 + p.seed);
            alpha *= flicker + (1 - flicker) * clear;
          }
          alpha += (1 - alpha) * clear;

          const target = p.circle ? CLEAR_GRAY_CIRCLE : CLEAR_GRAY;
          const gray = Math.round(tier.gray + (target - tier.gray) * clear);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `rgb(${gray},${gray},${gray})`;

          if (p.circle) {
            ctx.beginPath();
            ctx.arc(x, y, p.r, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Kerlip: sesekali karakter berganti dalam tier yang sama (berhenti saat tajam).
            if (!reduced && clear === 0 && Math.random() < 0.004) {
              p.ch = tier.chars[Math.floor(Math.random() * tier.chars.length)];
            }
            ctx.fillText(p.ch, x, y);
          }
        }

        ctx.globalAlpha = 1;

        if (reach && !reach.done && sinceContact >= AFTER_CONTACT_MS) {
          reach.done = true;
          reach.resolve();
        }
      }

      function loop(now: number) {
        draw(now);
        if (!reducedRef.current && visible) frame = requestAnimationFrame(loop);
      }

      function rebuild() {
        if (!wrap || !canvas || !ctx) return;
        const width = wrap.clientWidth;
        const height = wrap.clientHeight;
        if (!width || !height) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const first = !sceneRef.current;
        sceneRef.current = buildScene(width, height);
        if (first) startRef.current = performance.now();
        draw(performance.now());
      }

      rebuild();

      let resizeTimer = 0;
      const resizeObserver = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(rebuild, 120);
      });
      resizeObserver.observe(wrap);

      // Animasi berhenti saat hero tidak terlihat supaya tidak membebani CPU.
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(frame);
        if (visible && !reducedRef.current) frame = requestAnimationFrame(loop);
      });
      intersection.observe(wrap);

      function onMotionChange() {
        reducedRef.current = media.matches;
        cancelAnimationFrame(frame);
        if (media.matches) draw(performance.now());
        else frame = requestAnimationFrame(loop);
      }
      media.addEventListener("change", onMotionChange);

      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(resizeTimer);
        resizeObserver.disconnect();
        intersection.disconnect();
        media.removeEventListener("change", onMotionChange);
      };
    }, []);

    return (
      <div ref={wrapRef} className={className} aria-hidden>
        <canvas ref={canvasRef} className="block" />
      </div>
    );
  }
);
