const app = document.querySelector('#app');
const state = { step: 0, floor: null, color: null, kolam: null };

const floors = [
  { name: 'White', color: '#f8f5ef' }, { name: 'Terracotta', color: '#8f3f30' },
  { name: 'Sand', color: '#ffd4a2' }, { name: 'Grass', color: '#6caf08' }
];
const colors = [
  { name: 'Purple', value: '#a020a0' }, { name: 'Yellow', value: '#e8b923' },
  { name: 'Red', value: '#b7352e' }, { name: 'White', value: '#fffaf0' }
];
const patterns = [
  { name: 'Line', svg: '<g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M50 9 60 22 78 20 76 38 91 50 76 62 78 80 60 78 50 91 40 78 22 80 24 62 9 50 24 38 22 20 40 22Z"/><path d="M50 21c12 0 12 17 0 17s-12 24 0 24 12 17 0 17M21 50c0-12 17-12 17 0s24 12 24 0 17-12 17 0"/></g><g fill="currentColor"><circle cx="50" cy="9" r="3"/><circle cx="91" cy="50" r="3"/><circle cx="50" cy="91" r="3"/><circle cx="9" cy="50" r="3"/><circle cx="50" cy="50" r="3"/></g>' },
  { name: 'Geometric', svg: '<g fill="none" stroke="currentColor" stroke-width="4"><path d="M50 6 61 28 85 15 72 39 94 50 72 61 85 85 61 72 50 94 39 72 15 85 28 61 6 50 28 39 15 15 39 28Z"/><circle cx="50" cy="50" r="27"/><circle cx="50" cy="50" r="12"/><path d="M50 6v88M6 50h88M19 19l62 62m0-62L19 81"/></g>' },
  { name: 'Star', svg: '<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><circle cx="50" cy="50" r="7"/><path d="M50 13c10 10 10 19 0 27-10-8-10-17 0-27ZM87 50C77 60 68 60 60 50c8-10 17-10 27 0ZM50 87C40 77 40 68 50 60c10 8 10 17 0 27ZM13 50c10-10 19-10 27 0-8 10-17 10-27 0Z"/><path d="M31 18c17 10 28 25 38 46M69 18C52 28 41 43 31 64M31 82c17-10 28-25 38-46M69 82C52 72 41 57 31 36Z"/><circle cx="50" cy="8" r="3"/><circle cx="92" cy="50" r="3"/><circle cx="50" cy="92" r="3"/><circle cx="8" cy="50" r="3"/></g>' },
  { name: 'Diya', svg: '<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M50 14c12 11 13 21 0 30-13-9-12-19 0-30ZM86 50c-11 12-21 13-30 0 9-13 19-12 30 0ZM50 86c-12-11-13-21 0-30 13 9 12 19 0 30ZM14 50c11-12 21-13 30 0-9 13-19 12-30 0Z"/><path d="M50 31c4 13 4 25 0 38m19-19c-13 4-25 4-38 0M25 25l17 17m16 16 17 17M75 25 58 42M42 58 25 75"/><path d="M45 8q5-8 10 0M92 45q8 5 0 10M55 92q-5 8-10 0M8 55q-8-5 0-10"/></g>' }
];

const uploadedKolams = [
  ['Classic', 'kolam-classic.png'],
  ['Floral', 'kolam-floral.png'],
  ['Star', 'kolam-lotus.png'],
  ['Sikku', 'kolam-sikku.png'],
  ['Pulli', 'kolam-pulli.png']
];
patterns.length = 0;
uploadedKolams.forEach(([name, file]) => patterns.push({
  name,
  svg: '<defs><mask id="kolamMask" style="mask-type:alpha"><image href="' + file + '" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid meet"/></mask></defs><rect width="100" height="100" fill="currentColor" mask="url(#kolamMask)"/>'
}));

function designSvg(index, color = 'currentColor') {
  const gradient = color.startsWith('linear-gradient')
    ? (color.includes('violet') ? '<linearGradient id="kolamGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ec2525"/><stop offset=".2" stop-color="#ff9d00"/><stop offset=".4" stop-color="#ffe600"/><stop offset=".6" stop-color="#33b84a"/><stop offset=".8" stop-color="#2874db"/><stop offset="1" stop-color="#bd35c8"/></linearGradient>' : '<linearGradient id="kolamGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e92727"/><stop offset="1" stop-color="#fffaf0"/></linearGradient>')
    : '';
  const ink = gradient ? 'url(#kolamGradient)' : color;
  const artwork = patterns[index].svg
    .replaceAll('currentColor', ink)
    .replaceAll('kolamMask', 'kolamMask' + index);
  return `<svg viewBox="0 0 100 100" role="img" aria-label="Kolam design">${gradient ? `<defs>${gradient}</defs>` : ''}<g style="color:${color}">${artwork}</g></svg>`;
}
function button(label, action, secondary = false) { return `<button class="action ${secondary ? 'secondary' : ''}" data-action="${action}">${label}</button>`; }
function choicesMarkup(items, kind) {
  return `<div class="choices">${items.map((item, i) => `<button class="choice ${state[kind] === i ? 'selected' : ''}" data-pick="${kind}" data-index="${i}">${kind === 'floor' || kind === 'color' ? `<span class="swatch" style="background:${item.value || item.color}"></span>` : `<span class="pattern-preview">${designSvg(i)}</span>`}${item.name}</button>`).join('')}</div>`;
}
function selectedPreview() {
  const floor = floors[state.floor] || floors[0];
  const color = state.color === null ? '#a15e3b' : colors[state.color].value;
  return `<div class="preview" style="background:${floor.color}">${state.kolam === null ? '<span class="hint">Your kolam will appear here</span>' : designSvg(state.kolam, color)}</div>`;
}
function render() {
  if (state.step === 0) app.innerHTML = `<h1 class="landing-title">KOLAM MAKER</h1><p class="subtitle">Create your own little kolam</p><div class="button-row">${button('Start Making', 'start')}</div>`;
  if (state.step === 1) app.innerHTML = `<h1>Create something beautiful</h1>${selectedPreview()}<p class="prompt">Choose your floor</p>${choicesMarkup(floors,'floor')}<div class="button-row">${button('Next','next')}</div>`;
  if (state.step === 2) app.innerHTML = `<h1>Create something beautiful</h1>${selectedPreview()}<p class="prompt">Choose your color</p>${choicesMarkup(colors,'color')}<div class="button-row">${button('Back','back',true)}${button('Next','next')}</div>`;
  if (state.step === 3) app.innerHTML = `<h1>Create something beautiful</h1>${selectedPreview()}<p class="prompt">Choose your Kolam</p>${choicesMarkup(patterns,'kolam')}<p class="hint">Choose one design to continue</p><div class="button-row">${button('Back','back',true)}${button('Finish','finish')}</div>`;
  if (state.step === 4) {
    const floor = floors[state.floor] || floors[0]; const color = state.color === null ? '#a15e3b' : colors[state.color].value;
    app.innerHTML = `<h1 class="result-title">Yayy you made your own kolam</h1><div class="result-card" style="background:${floor.color}">${designSvg(state.kolam ?? 0, color)}</div><p class="result-message">One of our best kolam<br>is yours!</p><div class="button-row">${button('Redo','redo')}</div>`;
  }
}
app.addEventListener('click', event => {
  const pick = event.target.closest('[data-pick]');
  if (pick) { state[pick.dataset.pick] = Number(pick.dataset.index); render(); return; }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'start') state.step = 1;
  if (action === 'next' && state.step < 3) { if (state.step === 1 && state.floor === null) state.floor = 0; if (state.step === 2 && state.color === null) state.color = 0; state.step++; }
  if (action === 'back') state.step--;
  if (action === 'finish') { if (state.kolam === null) state.kolam = 0; state.step = 4; }
  if (action === 'redo') { state.step = 1; state.floor = null; state.color = null; state.kolam = null; }
  render();
});
render();
