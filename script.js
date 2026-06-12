const slides = [...document.querySelectorAll('.slide')];
const total = slides.length;
let index = 0;
let locked = false;

// Extract images from the existing HTML. The old slide image tags can stay in the file.
const images = slides.map(slide => slide.querySelector('.slide__img')?.getAttribute('src'));

// Per-slide camera presets. Adjust these numbers to tune the morph direction.
// x/y are viewport percentage translations; scale controls zoom; rotate gives cinematic drift.
const cameraPresets = [
  { scale: 1.08, x: 0,   y: 0,   r: 0,    origin: '50% 50%' }, // slide 1
  { scale: 1.18, x: -4,  y: 1,   r: .25,  origin: '42% 54%' }, // slide 2, push toward platform
  { scale: 1.22, x: 5,   y: -2,  r: -.25, origin: '58% 46%' }, // slide 3, subsea drift
  { scale: 1.16, x: -7,  y: 0,   r: .15,  origin: '46% 50%' }, // slide 4, wind zone pan
  { scale: 1.12, x: 1,   y: -4,  r: 0,    origin: '52% 44%' }, // slide 5, digital twin high angle
  { scale: 1.20, x: -2,  y: 2,   r: -.12, origin: '48% 52%' }  // slide 6, hero push-in
];

const deck = document.getElementById('deck');
const camera = document.createElement('div');
camera.className = 'camera';
camera.innerHTML = `
  <img class="camera__img camera__img--current" alt="" />
  <img class="camera__img camera__img--next" alt="" />
`;
document.body.prepend(camera);

const vignette = document.createElement('div');
vignette.className = 'vignette';
document.body.append(vignette);

const currentImg = camera.querySelector('.camera__img--current');
const nextImg = camera.querySelector('.camera__img--next');
const progressFill = document.getElementById('progressFill');
const cur = document.getElementById('cur');
const totalEl = document.getElementById('total');
const dots = document.getElementById('dots');

totalEl.textContent = total;

slides.forEach((_, i) => {
  const button = document.createElement('button');
  button.className = 'dot';
  button.type = 'button';
  button.addEventListener('click', () => goTo(i));
  dots.append(button);
});

function transformFor(i, extraScale = 1) {
  const p = cameraPresets[i] || cameraPresets[0];
  return `translate3d(${p.x}vw, ${p.y}vh, 0) scale(${p.scale * extraScale}) rotate(${p.r}deg)`;
}

function applyPreset(el, i, extraScale = 1) {
  const p = cameraPresets[i] || cameraPresets[0];
  el.style.transformOrigin = p.origin;
  el.style.transform = transformFor(i, extraScale);
}

function updateUI() {
  slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
  [...dots.children].forEach((d, i) => d.classList.toggle('is-active', i === index));
  cur.textContent = index + 1;
  progressFill.style.width = `${((index + 1) / total) * 100}%`;
}

function init() {
  currentImg.src = images[0];
  nextImg.src = images[0];
  applyPreset(currentImg, 0, 1);
  updateUI();
}

function goTo(target) {
  if (locked || target === index || target < 0 || target >= total) return;
  locked = true;

  const from = index;
  const to = target;
  const direction = to > from ? 1 : -1;

  nextImg.src = images[to];

  // Start next image slightly before the target camera state to create a real camera travel.
  const startOffset = direction > 0 ? -2.8 : 2.8;
  const pTo = cameraPresets[to] || cameraPresets[0];
  nextImg.style.transformOrigin = pTo.origin;
  nextImg.style.transform = `translate3d(${pTo.x + startOffset}vw, ${pTo.y}vh, 0) scale(${pTo.scale * .985}) rotate(${pTo.r - direction * .18}deg)`;

  // Force browser to register the start state before transition begins.
  nextImg.getBoundingClientRect();
  camera.classList.add('is-transitioning');

  // Move outgoing and incoming images in the same direction; this feels closer to PowerPoint Morph.
  requestAnimationFrame(() => {
    const pFrom = cameraPresets[from] || cameraPresets[0];
    currentImg.style.transformOrigin = pFrom.origin;
    currentImg.style.transform = `translate3d(${pFrom.x - direction * 3.8}vw, ${pFrom.y}vh, 0) scale(${pFrom.scale * 1.035}) rotate(${pFrom.r + direction * .16}deg)`;
    applyPreset(nextImg, to, 1.018);
  });

  slides[from].classList.remove('is-active');
  slides[to].classList.add('is-active');
  index = to;
  updateUI();

  window.setTimeout(() => {
    camera.classList.remove('is-transitioning');
    currentImg.src = images[index];
    applyPreset(currentImg, index, 1);
    nextImg.style.opacity = 0;
    nextImg.src = images[index];
    applyPreset(nextImg, index, 1);
    locked = false;
  }, 1500);
}

document.getElementById('nextBtn')?.addEventListener('click', () => goTo(index + 1));
document.getElementById('prevBtn')?.addEventListener('click', () => goTo(index - 1));

document.addEventListener('keydown', e => {
  if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) {
    e.preventDefault();
    goTo(index + 1);
  }
  if (['ArrowLeft', 'PageUp'].includes(e.key)) {
    e.preventDefault();
    goTo(index - 1);
  }
});

let touchStartX = null;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  if (touchStartX == null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 55) goTo(index + (dx < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });

init();
