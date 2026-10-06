(() => {
const $ = s => document.querySelector(s);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEY = 'susenkova-pec-v1';
const TAU = Math.PI * 2;
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------------- Data ---------------- */
const B = [
  {id:'cursor', name:'Kurzor', icon:'👆', base:15, cps:.1, desc:'Klikne za tebe každých 10 sekund.'},
  {id:'grandma', name:'Babička', icon:'👵', base:100, cps:1, desc:'Milá babička, která peče sušenky.'},
  {id:'farm', name:'Farma', icon:'🌾', base:1100, cps:8, desc:'Pěstuje sušenky ze sušenkových semínek.'},
  {id:'mine', name:'Důl', icon:'⛏️', base:12000, cps:47, desc:'Těží těsto a čokoládové kousky.'},
  {id:'factory', name:'Továrna', icon:'🏭', base:130000, cps:260, desc:'Sušenky na pásu, ve dne i v noci.'},
  {id:'bank', name:'Banka', icon:'🏦', base:1.4e6, cps:1400, desc:'Sušenky vydělávají úroky.'},
  {id:'temple', name:'Chrám', icon:'🛕', base:2e7, cps:7800, desc:'Plný vzácné starobylé čokolády.'},
  {id:'tower', name:'Čarodějná věž', icon:'🧙', base:3.3e8, cps:44000, desc:'Vyčaruje sušenky z ničeho.'},
  {id:'rocket', name:'Raketa', icon:'🚀', base:5.1e9, cps:260000, desc:'Dováží sušenky ze Sušenkové planety.'},
];
const NAMES = {
  cursor:['Zesílený ukazováček','Karpální tunel navíc','Obouruční klikání'],
  grandma:['Ocelové válečky','Babiččin tajný recept','Pletené chňapky'],
  farm:['Kakaové lusky','Hnojivo z drobků','Šlechtěné sušenkovníky'],
  mine:['Cukrové vrtáky','Megavrták','Čokoládové žíly'],
  factory:['Pásová výroba','Robotičtí cukráři','Noční směna'],
  bank:['Úroky v těstě','Sušenkové dluhopisy','Zlatý trezor'],
  temple:['Zlaté idoly','Obětní mouka','Posvátná trouba'],
  tower:['Kouzelné hůlky','Grimoár pečení','Čarovné droždí'],
  rocket:['Vanilková mlhovina','Warp pohon','Sušenkový měsíc'],
};
const TIERS = [[1,10],[10,100],[50,2500]];
const U = [];
B.forEach(b => NAMES[b.id].forEach((n,i) => U.push({id:b.id+i, name:n, icon:b.icon, type:'b', target:b.id, req:TIERS[i][0], cost:b.base*TIERS[i][1], desc:`${b.name}: produkce ×2`})));
U.push(
  {id:'c0', name:'Posilovací rukavice', icon:'🧤', type:'c', cost:100, desc:'Síla kliku ×2'},
  {id:'c1', name:'Kovaný prst', icon:'☝️', type:'c', cost:1000, desc:'Síla kliku ×2'},
  {id:'c2', name:'Zlaté prsty', icon:'✨', type:'c', cost:1e6, desc:'Síla kliku ×2'},
  {id:'p0', name:'Plastová myš', icon:'🖱️', type:'p', cost:5e4, desc:'Každý klik přidá 1 % produkce za sekundu'},
  {id:'p1', name:'Železná myš', icon:'🖱️', type:'p', cost:5e6, desc:'Každý klik přidá další 1 % produkce'},
  {id:'p2', name:'Titanová myš', icon:'🖱️', type:'p', cost:5e8, desc:'Každý klik přidá další 1 % produkce'},
  {id:'g0', name:'Sklenice mléka', icon:'🥛', type:'g', mult:1.1, cost:1e5, desc:'Veškerá produkce +10 %'},
  {id:'g1', name:'Kokosový sen', icon:'🥥', type:'g', mult:1.15, cost:1e7, desc:'Veškerá produkce +15 %'},
  {id:'g2', name:'Čokoládová fontána', icon:'⛲', type:'g', mult:1.25, cost:1e9, desc:'Veškerá produkce +25 %'},
  {id:'l0', name:'Šťastný den', icon:'🍀', type:'l', cost:777777, desc:'Zlaté sušenky chodí 2× častěji'},
  {id:'l1', name:'Sériové štěstí', icon:'🌟', type:'l', cost:77777777, desc:'Zlaté sušenky i jejich efekty vydrží 2× déle'},
);
U.sort((a,b) => a.cost - b.cost);

const A = [
  ['a_click','Ručně dělané','Klikni na sušenku poprvé.','👆',()=>S.clicks>=1],
  ['a_100','Pekař začátečník','Upeč celkem 100 sušenek.','🥣',()=>S.total>=100],
  ['a_1e4','Rodinná pekárna','Upeč celkem 10 000 sušenek.','🏠',()=>S.total>=1e4],
  ['a_1e6','Sušenkový magnát','Upeč celkem milion sušenek.','💼',()=>S.total>=1e6],
  ['a_1e9','Těstové impérium','Upeč celkem miliardu sušenek.','👑',()=>S.total>=1e9],
  ['a_1e12','Galaktická trouba','Upeč celkem bilion sušenek.','🌌',()=>S.total>=1e12],
  ['a_c1k','Klikací maniak','Klikni tisíckrát.','🔥',()=>S.clicks>=1000],
  ['a_c10k','Prst z oceli','Klikni desettisíckrát.','🦾',()=>S.clicks>=1e4],
  ['a_crit','Kritik','Trefi kritický klik.','💥',()=>S.crits>=1],
  ['a_combo50','Kombo!','Dosáhni komba 50.','⚡',()=>S.bestCombo>=50],
  ['a_combo200','Nezastavitelný','Dosáhni komba 200.','🌪️',()=>S.bestCombo>=200],
  ['a_gold','Zlatá ruka','Chyť zlatou sušenku.','🪙',()=>S.golden>=1],
  ['a_gold10','Lovec zlata','Chyť 10 zlatých sušenek.','🏆',()=>S.golden>=10],
  ['a_grandma','Babiččin mazlíček','Kup první babičku.','👵',()=>S.owned.grandma>=1],
  ['a_cur50','Armáda kurzorů','Vlastni 50 kurzorů.','🖐️',()=>S.owned.cursor>=50],
  ['a_fact','Průmyslník','Postav první továrnu.','🏭',()=>S.owned.factory>=1],
  ['a_rocket','Na oběžné dráze','Vypusť první raketu.','🚀',()=>S.owned.rocket>=1],
  ['a_cps100','Rozjetý vlak','Peč 100 sušenek za sekundu.','🚂',()=>C.raw>=100],
  ['a_cps1e4','Sušenková mašina','Peč 10 000 sušenek za sekundu.','⚙️',()=>C.raw>=1e4],
  ['a_upg10','Sběratel','Kup 10 vylepšení.','🧺',()=>S.upgrades.length>=10],
].map(([id,name,desc,icon,test]) => ({id,name,desc,icon,test}));

const NEWS = [
  [100, ['Ve městě se otevřela nová pekárna. Sousedé zatím nic necítí.','Tvoje první sušenka chutná trochu připáleně. Nevadí, další bude lepší.','Místní kocour začal vysedávat před tvou troubou.']],
  [1e4, ['Babičky z okolí si šuškají o tvém receptu.','Pes od sousedů teď chodí ke tvým dveřím každý den.','Pekárna na rohu hlásí pokles tržeb. Prý kvůli tobě.']],
  [1e6, ['Cena mouky vzrostla o 300 %. Analytici ukazují na jedinou pekárnu.','Vědci zkoumají, proč celé město voní vanilkou.','Zubaři hlásí rekordní měsíc.']],
  [1e9, ['Vláda zvažuje sušenky jako oficiální měnu.','Turisté jezdí fotit tvoji továrnu. Fronta je 3 km dlouhá.','Burza: akcie mléka dnes stouply o 40 %.']],
  [Infinity, ['Astronomové našli na Marsu stopy čokolády.','Sušenky už tvoří 4 % hmotnosti Země. Odborníci jsou znepokojeni.','Mimozemšťané poslali první zprávu: „Ještě jednu, prosím.“']],
];

/* ---------------- State ---------------- */
function fresh(){
  const owned = {}; B.forEach(b => owned[b.id] = 0);
  return {cookies:0, total:0, handmade:0, clicks:0, crits:0, golden:0, bestCombo:0, owned, upgrades:[], ach:[], start:Date.now(), last:Date.now(), sound:true, buyAmt:1, buffs:[]};
}
let S = fresh();
const R = {combo:0, lastClick:0, goldTimer:rnd(20,40), goldLife:0, goldOn:false, popT:0};
const C = {raw:0, clickBase:1, clickPct:0, goldFreq:1, goldLong:1};

function has(id){ return S.upgrades.includes(id); }
function recalc(){
  let sum = 0;
  for (const b of B){
    let m = 1;
    for (const u of U) if (u.type==='b' && u.target===b.id && has(u.id)) m *= 2;
    sum += S.owned[b.id] * b.cps * m;
  }
  let g = 1, cb = 1, cp = 0;
  for (const u of U){
    if (!has(u.id)) continue;
    if (u.type==='g') g *= u.mult;
    if (u.type==='c') cb *= 2;
    if (u.type==='p') cp += .01;
  }
  C.raw = sum * g * (1 + .02 * S.ach.length);
  C.clickBase = cb; C.clickPct = cp;
  C.goldFreq = has('l0') ? 2 : 1;
  C.goldLong = has('l1') ? 2 : 1;
}
const buff = id => S.buffs.find(b => b.id===id);
const cps = () => C.raw * (buff('frenzy') ? 7 : 1);
const comboMult = () => 1 + Math.min(R.combo, 200) / 100;
const clickValue = () => (C.clickBase + cps() * C.clickPct) * (buff('cf') ? 77 : 1) * comboMult();
const costOf = (b, n) => {
  const o = S.owned[b.id];
  return Math.ceil(b.base * Math.pow(1.15, o) * (Math.pow(1.15, n) - 1) / .15);
};
function gain(n){ S.cookies += n; S.total += n; }

/* ---------------- Formatting ---------------- */
const UNITS = [[1e6,'mil.'],[1e9,'mld.'],[1e12,'bil.'],[1e15,'bld.'],[1e18,'tril.'],[1e21,'trld.'],[1e24,'kvadr.']];
function fmt(n, dec){
  if (!isFinite(n)) return '∞';
  if (n < 1e6){
    if (dec && n < 100 && n % 1) return n.toFixed(1).replace('.', ',');
    return Math.floor(n).toLocaleString('cs-CZ');
  }
  let u = UNITS[0]; for (const x of UNITS) if (n >= x[0]) u = x;
  return (n / u[0]).toFixed(3).replace('.', ',') + ' ' + u[1];
}
function plural(n){
  n = Math.floor(n);
  if (n === 1) return 'sušenka';
  if (n >= 2 && n <= 4) return 'sušenky';
  return 'sušenek';
}

/* ---------------- Cookie art ---------------- */
function rng(seed){ let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function drawCookie(cv, seed, gold){
  const size = cv.width, x = cv.getContext('2d'), r = rng(seed);
  const R0 = size * .44, cx = size / 2, cy = size / 2;
  x.clearRect(0, 0, size, size);
  const N = 72, ph = [r()*6, r()*6, r()*6], path = new Path2D();
  for (let i = 0; i < N; i++){
    const a = i / N * TAU;
    const k = 1 + Math.sin(a*3+ph[0])*.018 + Math.sin(a*7+ph[1])*.012 + Math.sin(a*13+ph[2])*.008 + (r()-.5)*.012;
    const px = cx + Math.cos(a)*R0*k, py = cy + Math.sin(a)*R0*k;
    i ? path.lineTo(px, py) : path.moveTo(px, py);
  }
  path.closePath();
  const pal = gold ? ['#fff4b8','#f8cd4f','#cf9015','#8a5a06'] : ['#f7c67c','#e19b48','#b86f2b','#7a4318'];
  const g = x.createRadialGradient(cx-R0*.25, cy-R0*.3, R0*.1, cx, cy, R0*1.05);
  g.addColorStop(0, pal[0]); g.addColorStop(.45, pal[1]); g.addColorStop(.85, pal[2]); g.addColorStop(1, pal[3]);
  x.fillStyle = g; x.fill(path);
  x.save(); x.clip(path);
  for (let i = 0; i < 46; i++){
    const a = r()*TAU, d = Math.sqrt(r())*R0;
    x.fillStyle = gold ? `rgba(160,100,0,${.05+r()*.1})` : `rgba(110,55,15,${.05+r()*.12})`;
    x.beginPath(); x.ellipse(cx+Math.cos(a)*d, cy+Math.sin(a)*d, R0*(.04+r()*.1), R0*(.03+r()*.07), r()*3, 0, TAU); x.fill();
  }
  const rg = x.createRadialGradient(cx, cy, R0*.72, cx, cy, R0*1.03);
  rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, gold ? 'rgba(110,60,0,.45)' : 'rgba(60,25,5,.5)');
  x.fillStyle = rg; x.fillRect(0, 0, size, size);
  x.strokeStyle = gold ? 'rgba(140,90,0,.35)' : 'rgba(90,45,15,.35)'; x.lineWidth = size*.006; x.lineCap = 'round';
  for (let i = 0; i < 7; i++){
    let a = r()*TAU, d = R0*(.2+r()*.6), px = cx+Math.cos(a)*d, py = cy+Math.sin(a)*d;
    x.beginPath(); x.moveTo(px, py);
    for (let j = 0; j < 4; j++){ a += (r()-.5)*1.2; px += Math.cos(a)*R0*.08; py += Math.sin(a)*R0*.08; x.lineTo(px, py); }
    x.stroke();
  }
  for (let i = 0; i < 12; i++){
    const a = r()*TAU, d = Math.sqrt(r())*R0*.78, px = cx+Math.cos(a)*d, py = cy+Math.sin(a)*d, s = R0*(.07+r()*.06);
    const cp = new Path2D(), M = 9;
    for (let j = 0; j < M; j++){
      const b = j/M*TAU, k = s*(.75+r()*.45);
      j ? cp.lineTo(px+Math.cos(b)*k, py+Math.sin(b)*k*.85) : cp.moveTo(px+Math.cos(b)*k, py+Math.sin(b)*k*.85);
    }
    cp.closePath();
    x.save(); x.translate(s*.12, s*.2); x.fillStyle = 'rgba(0,0,0,.28)'; x.fill(cp); x.restore();
    x.fillStyle = gold ? '#9a6406' : '#3a1d0f'; x.fill(cp);
    x.fillStyle = gold ? 'rgba(255,240,180,.6)' : 'rgba(150,90,60,.6)';
    x.beginPath(); x.ellipse(px-s*.25, py-s*.3, s*.28, s*.15, -.6, 0, TAU); x.fill();
  }
  for (let i = 0; i < 80; i++){
    const a = r()*TAU, d = Math.sqrt(r())*R0;
    x.fillStyle = `rgba(255,240,210,${.15+r()*.3})`;
    x.fillRect(cx+Math.cos(a)*d, cy+Math.sin(a)*d, size*.004, size*.004);
  }
  const hl = x.createRadialGradient(cx-R0*.35, cy-R0*.4, 0, cx-R0*.35, cy-R0*.4, R0*.8);
  hl.addColorStop(0, gold ? 'rgba(255,255,230,.5)' : 'rgba(255,240,200,.28)'); hl.addColorStop(1, 'rgba(255,240,200,0)');
  x.fillStyle = hl; x.fillRect(0, 0, size, size);
  x.restore();
}
drawCookie($('#cookieCv'), 7, false);
drawCookie($('#goldCv'), 21, true);
const sprites = [11, 23, 37].map(seed => { const c = document.createElement('canvas'); c.width = c.height = 64; drawCookie(c, seed, false); return c; });
const goldSprite = document.createElement('canvas'); goldSprite.width = goldSprite.height = 64; drawCookie(goldSprite, 5, true);
document.documentElement.style.setProperty('--ck', `url(${sprites[0].toDataURL()})`);

/* ---------------- Sound ---------------- */
let AC = null;
function ac(){
  if (!S.sound) return null;
  if (!AC){ try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ return null; } }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(f, dur, type='sine', vol=.12, slide=0, delay=0){
  const a = ac(); if (!a) return;
  const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + .02);
}
const SFX = {
  pop(){ const n = performance.now(); if (n - R.popT < 28) return; R.popT = n; tone(380 + Math.random()*90 + Math.min(R.combo,200)*2.2, .09, 'triangle', .13, -180); },
  crit(){ tone(660, .18, 'square', .05, 600); tone(990, .25, 'triangle', .1, 400, .05); },
  buy(){ tone(520, .08, 'triangle', .12); tone(780, .12, 'triangle', .12, 0, .07); },
  gold(){ [523,659,784,1047,1319].forEach((f,i) => tone(f, .3, 'triangle', .1, 0, i*.07)); },
  ach(){ [784,988,1175].forEach((f,i) => tone(f, .5, 'sine', .1, 0, i*.1)); },
};

/* ---------------- FX canvas ---------------- */
const fx = $('#fx'), fctx = fx.getContext('2d');
const bg = $('#bg'), bctx = bg.getContext('2d');
const orbit = $('#orbit'), octx = orbit.getContext('2d');
const stage = $('#stage'), wrap = $('#wrap'), cookieBtn = $('#cookie');
let DPR = 1;
function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  fx.width = innerWidth * DPR; fx.height = innerHeight * DPR;
  const sr = stage.getBoundingClientRect();
  bg.width = sr.width * DPR; bg.height = sr.height * DPR;
  const or = orbit.getBoundingClientRect();
  orbit.width = or.width * DPR; orbit.height = or.height * DPR;
}
addEventListener('resize', resize);

const P = [];
const MAXP = RM ? 120 : 700;
function burst(x, y, n, kind){
  if (RM) n = Math.ceil(n / 4);
  for (let i = 0; i < n && P.length < MAXP; i++){
    const a = kind === 'gold' ? rnd(0, TAU) : rnd(-Math.PI*.95, -Math.PI*.05);
    const sp = kind === 'gold' ? rnd(150, 520) : rnd(120, 380);
    const t = kind === 'gold' ? (Math.random() < .5 ? 'spark' : 'gcookie') : (Math.random() < .14 ? 'cookie' : Math.random() < .3 ? 'spark' : 'crumb');
    P.push({x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, life:0, max:rnd(.6, 1.3), rot:rnd(0,TAU), vr:rnd(-8,8),
      size: t==='crumb' ? rnd(3,7) : t==='spark' ? rnd(2,4) : rnd(14,26), t,
      color: ['#b86f2b','#e19b48','#7a4318','#3a1d0f','#f7c67c'][Math.floor(Math.random()*5)], spr: sprites[Math.floor(Math.random()*3)]});
  }
}
function drawFx(dt){
  fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  fctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = P.length - 1; i >= 0; i--){
    const p = P[i];
    p.life += dt;
    if (p.life >= p.max){ P.splice(i, 1); continue; }
    p.vy += (p.t === 'spark' ? 300 : 900) * dt; p.vx *= .985;
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    const k = 1 - p.life / p.max;
    fctx.globalAlpha = Math.min(1, k * 1.6);
    if (p.t === 'crumb'){
      fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.rot); fctx.fillStyle = p.color;
      fctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*.7); fctx.restore();
    } else if (p.t === 'spark'){
      fctx.globalCompositeOperation = 'lighter';
      fctx.strokeStyle = 'rgba(255,214,110,1)'; fctx.lineWidth = p.size; fctx.lineCap = 'round';
      fctx.beginPath(); fctx.moveTo(p.x, p.y); fctx.lineTo(p.x - p.vx*.035, p.y - p.vy*.035); fctx.stroke();
      fctx.globalCompositeOperation = 'source-over';
    } else {
      fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.rot);
      fctx.drawImage(p.t === 'gcookie' ? goldSprite : p.spr, -p.size/2, -p.size/2, p.size, p.size); fctx.restore();
    }
  }
  fctx.globalAlpha = 1;
}

/* falling background cookies */
const F = [];
let fallAcc = 0;
function drawBg(dt){
  const w = bg.width / DPR, h = bg.height / DPR;
  const rate = RM ? 0 : Math.min(26, Math.log10(cps() + 1) * 3.2);
  fallAcc += rate * dt;
  while (fallAcc >= 1 && F.length < 120){
    fallAcc -= 1;
    F.push({x:rnd(0, w), y:-40, vy:rnd(50, 140), rot:rnd(0,TAU), vr:rnd(-1.5,1.5), s:rnd(16, 38), spr:sprites[Math.floor(Math.random()*3)]});
  }
  bctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  bctx.clearRect(0, 0, w, h);
  bctx.globalAlpha = .28;
  for (let i = F.length - 1; i >= 0; i--){
    const f = F[i];
    f.y += f.vy * dt; f.rot += f.vr * dt;
    if (f.y > h + 40){ F.splice(i, 1); continue; }
    bctx.save(); bctx.translate(f.x, f.y); bctx.rotate(f.rot); bctx.drawImage(f.spr, -f.s/2, -f.s/2, f.s, f.s); bctx.restore();
  }
  bctx.globalAlpha = 1;
}

/* orbiting cursors */
let orbitA = 0;
function drawOrbit(dt, t){
  const w = orbit.width / DPR, h = orbit.height / DPR, cx = w/2, cy = h/2;
  octx.setTransform(DPR, 0, 0, DPR, 0, 0);
  octx.clearRect(0, 0, w, h);
  const n = Math.min(S.owned.cursor, 80);
  if (!n) return;
  orbitA += dt * (RM ? 0 : .12);
  const cr = wrap.clientWidth * .44;
  const sz = Math.max(12, cr * .11);
  for (let i = 0; i < n; i++){
    const ring = i < 40 ? 0 : 1;
    const idx = ring ? i - 40 : i;
    const cnt = ring ? n - 40 : Math.min(n, 40);
    const a = orbitA * (ring ? -1 : 1) + idx / cnt * TAU + ring * .3;
    const tap = RM ? 0 : Math.max(0, Math.sin(t * 3 - idx * .7)) ** 8 * 8;
    const rad = cr + 10 + ring * (sz * 1.5) - tap;
    octx.save();
    octx.translate(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    octx.rotate(a - Math.PI / 2);
    octx.beginPath();
    octx.moveTo(0, 0); octx.lineTo(0, sz); octx.lineTo(sz*.27, sz*.76); octx.lineTo(sz*.45, sz*1.12);
    octx.lineTo(sz*.6, sz*1.05); octx.lineTo(sz*.42, sz*.69); octx.lineTo(sz*.74, sz*.69); octx.closePath();
    octx.fillStyle = '#f5ecdc'; octx.strokeStyle = '#2a170e'; octx.lineWidth = 1.5; octx.lineJoin = 'round';
    octx.fill(); octx.stroke();
    octx.restore();
  }
}

/* ---------------- Floaters & toasts ---------------- */
let flCount = 0;
function floater(x, y, text, cls){
  if (flCount > 40) return;
  const el = document.createElement('div');
  el.className = 'fl' + (cls ? ' ' + cls : '');
  el.textContent = text;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  el.style.setProperty('--dx', rnd(-28, 28).toFixed(0) + 'px');
  document.body.appendChild(el); flCount++;
  el.addEventListener('animationend', () => { el.remove(); flCount--; });
}
function toast(icon, kicker, title, desc){
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div class="ico"></div><div><small></small><b></b><span class="d"></span></div>`;
  el.querySelector('.ico').textContent = icon;
  el.querySelector('small').textContent = kicker;
  el.querySelector('b').textContent = title;
  el.querySelector('.d').textContent = desc;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, 4200);
}
function shake(){
  if (RM) return;
  stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake');
}

/* ---------------- Clicking ---------------- */
const countEl = $('#count');
function doClick(x, y){
  ac();
  const now = performance.now();
  R.combo = now - R.lastClick < 500 ? R.combo + 1 : Math.max(1, R.combo);
  R.lastClick = now;
  S.bestCombo = Math.max(S.bestCombo, Math.floor(R.combo));
  S.clicks++;
  let v = clickValue();
  const crit = Math.random() < .05;
  if (crit){ v *= 7; S.crits++; }
  gain(v); S.handmade += v;
  floater(x, y, '+' + fmt(v, true), crit ? 'crit' : '');
  burst(x, y, crit ? 46 : 12);
  if (crit){ shake(); SFX.crit(); burst(x, y, 20, 'gold'); } else SFX.pop();
  if (!RM) countEl.animate([{transform:'scale(1.07)'},{transform:'scale(1)'}], {duration:160});
}
cookieBtn.addEventListener('pointerdown', e => {
  e.preventDefault();
  cookieBtn.classList.add('down');
  doClick(e.clientX, e.clientY);
});
const up = () => cookieBtn.classList.remove('down');
cookieBtn.addEventListener('pointerup', up);
cookieBtn.addEventListener('pointerleave', () => { up(); cookieBtn.style.setProperty('--rx','0deg'); cookieBtn.style.setProperty('--ry','0deg'); });
cookieBtn.addEventListener('click', e => {
  if (e.detail !== 0) return; // keyboard only; pointer clicks are counted on pointerdown
  const r = cookieBtn.getBoundingClientRect();
  doClick(r.left + r.width/2 + rnd(-30,30), r.top + r.height/2 + rnd(-30,30));
});
cookieBtn.addEventListener('pointermove', e => {
  if (RM || e.pointerType !== 'mouse') return;
  const r = cookieBtn.getBoundingClientRect();
  const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
  cookieBtn.style.setProperty('--ry', (dx * 18).toFixed(1) + 'deg');
  cookieBtn.style.setProperty('--rx', (-dy * 18).toFixed(1) + 'deg');
});

/* ---------------- Golden cookie ---------------- */
const goldBtn = $('#golden');
function spawnGold(){
  const sr = stage.getBoundingClientRect();
  goldBtn.style.left = rnd(.06, .82) * sr.width + 'px';
  goldBtn.style.top = rnd(.18, .7) * sr.height + 'px';
  goldBtn.classList.remove('out');
  goldBtn.hidden = false;
  R.goldOn = true; R.goldLife = 13 * C.goldLong;
}
function hideGold(){
  R.goldOn = false;
  goldBtn.classList.add('out');
  setTimeout(() => { if (!R.goldOn) goldBtn.hidden = true; }, 500);
  R.goldTimer = rnd(45, 110) / C.goldFreq;
}
function addBuff(id, name, dur){
  dur *= C.goldLong;
  const b = buff(id);
  if (b){ b.left = dur; b.dur = dur; } else S.buffs.push({id, name, left:dur, dur});
}
goldBtn.addEventListener('pointerdown', e => {
  e.preventDefault(); e.stopPropagation();
  activateGold(e.clientX, e.clientY);
});
goldBtn.addEventListener('click', e => {
  if (e.detail !== 0) return;
  const r = goldBtn.getBoundingClientRect();
  activateGold(r.left + r.width/2, r.top + r.height/2);
});
function activateGold(x, y){
  if (!R.goldOn) return;
  ac();
  S.golden++;
  const roll = Math.random();
  let label;
  if (roll < .45){
    const v = Math.min(S.cookies * .15, cps() * 900) + 13;
    gain(v); label = 'Štěstí! +' + fmt(v);
  } else if (roll < .85){
    addBuff('frenzy', 'Šílenství ×7', 45); label = 'Šílenství! Produkce ×7';
  } else {
    addBuff('cf', 'Klikací šílenství ×77', 13); label = 'Klikací šílenství! Klik ×77';
  }
  floater(x, y, label, 'big');
  burst(x, y, 90, 'gold'); shake(); SFX.gold();
  hideGold(); recalc(); renderBuffs();
}

/* ---------------- Shop ---------------- */
const bldEls = {};
function buildShop(){
  const box = $('#blds'); box.innerHTML = '';
  for (const b of B){
    const el = document.createElement('button');
    el.className = 'row';
    el.innerHTML = `<span class="ico"></span><span class="info"><span class="nm"></span><span class="cost"></span><span class="sub"></span></span><span class="own">0</span>`;
    el.querySelector('.ico').textContent = b.icon;
    el.addEventListener('click', () => buyBuilding(b, el));
    box.appendChild(el);
    bldEls[b.id] = el;
  }
}
function buyBuilding(b, el){
  const n = S.buyAmt, c = costOf(b, n);
  if (S.cookies < c) return;
  S.cookies -= c; S.owned[b.id] += n;
  recalc(); SFX.buy();
  const r = el.getBoundingClientRect();
  burst(r.left + 32, r.top + r.height/2, 14, 'gold');
  floater(r.right - 40, r.top + 10, '+' + n, '');
  if (!RM) el.animate([{background:'rgba(255,214,110,.45)'},{background:'rgba(255,214,110,.09)'}], {duration:400});
  updateShop(true);
}
function updateShop(force){
  let mysteryShown = false;
  for (const b of B){
    const el = bldEls[b.id], o = S.owned[b.id];
    const known = o > 0 || S.total >= b.base * .4;
    if (!known){
      el.hidden = mysteryShown; mysteryShown = true;
      el.className = 'row mystery'; el.disabled = true;
      el.querySelector('.nm').textContent = '???';
      el.querySelector('.cost').textContent = fmt(costOf(b, S.buyAmt));
      el.querySelector('.sub').textContent = 'Zatím neobjeveno';
      el.querySelector('.own').textContent = '';
      el.title = '';
      continue;
    }
    el.hidden = false; el.disabled = false;
    const c = costOf(b, S.buyAmt), can = S.cookies >= c;
    el.className = 'row' + (can ? ' can' : '');
    el.querySelector('.nm').textContent = b.name + (S.buyAmt > 1 ? ` ×${S.buyAmt}` : '');
    el.querySelector('.cost').textContent = fmt(c);
    let m = 1; for (const u of U) if (u.type==='b' && u.target===b.id && has(u.id)) m *= 2;
    const each = b.cps * m * (C.raw && totalBase() ? C.raw / totalBase() : 1);
    el.querySelector('.sub').textContent = o ? `${fmt(each, true)}/s každý · celkem ${fmt(each * o, true)}/s` : `${fmt(each, true)}/s · ${b.desc}`;
    el.querySelector('.own').textContent = o || '';
    el.title = b.desc;
  }
  renderUpgrades(force);
}
function totalBase(){
  let sum = 0;
  for (const b of B){ let m = 1; for (const u of U) if (u.type==='b' && u.target===b.id && has(u.id)) m *= 2; sum += S.owned[b.id]*b.cps*m; }
  return sum;
}
const upgVisible = u => !has(u.id) && (u.type === 'b' ? S.owned[u.target] >= u.req : S.total >= u.cost * .25);
let upgKey = '';
const upgEls = {};
function renderUpgrades(force){
  const list = U.filter(upgVisible);
  const key = list.map(u => u.id).join();
  const panel = $('#p-u');
  if (key !== upgKey || force === 'rebuild'){
    upgKey = key; panel.innerHTML = '';
    if (!list.length) panel.innerHTML = '<p class="empty">Další vylepšení se odemknou, až upečeš víc sušenek nebo koupíš víc budov.</p>';
    for (const u of list){
      const el = document.createElement('button');
      el.className = 'row';
      el.innerHTML = `<span class="ico"></span><span class="info"><span class="nm"></span><span class="cost"></span><span class="sub"></span></span><span class="own"></span>`;
      el.querySelector('.ico').textContent = u.icon;
      el.querySelector('.nm').textContent = u.name;
      el.querySelector('.cost').textContent = fmt(u.cost);
      el.querySelector('.sub').textContent = u.desc;
      el.title = u.desc;
      el.addEventListener('click', () => {
        if (S.cookies < u.cost || has(u.id)) return;
        S.cookies -= u.cost; S.upgrades.push(u.id);
        recalc(); SFX.buy();
        const r = el.getBoundingClientRect();
        burst(r.left + 32, r.top + r.height/2, 30, 'gold');
        floater(r.left + r.width/2, r.top, u.name, '');
        updateShop(true);
      });
      panel.appendChild(el); upgEls[u.id] = el;
    }
  }
  let afford = 0;
  for (const u of list){
    const can = S.cookies >= u.cost; if (can) afford++;
    upgEls[u.id].className = 'row' + (can ? ' can' : '');
  }
  const dot = $('#udot'); dot.hidden = !afford; dot.textContent = afford;
}

/* ---------------- Achievements ---------------- */
function checkAch(){
  let changed = false;
  for (const a of A){
    if (S.ach.includes(a.id) || !a.test()) continue;
    S.ach.push(a.id); changed = true;
    toast(a.icon, 'Úspěch odemčen', a.name, a.desc);
    SFX.ach();
    const r = cookieBtn.getBoundingClientRect();
    burst(r.left + r.width/2, r.top + r.height/2, 50, 'gold');
  }
  if (changed){ recalc(); renderAch(); }
}
function renderAch(){
  const p = $('#p-a');
  const pct = Math.round(S.ach.length * 2);
  p.innerHTML = `<p class="ach-sum">Odemčeno <b>${S.ach.length} z ${A.length}</b>. Každý úspěch přilévá mléko a zvyšuje produkci o 2 % (teď +${pct} %).</p>`;
  for (const a of A){
    const got = S.ach.includes(a.id);
    const el = document.createElement('div');
    el.className = 'ach' + (got ? '' : ' lock');
    el.innerHTML = `<div class="ico"></div><div><div class="nm"></div><div class="ds"></div></div>`;
    el.querySelector('.ico').textContent = got ? a.icon : '🔒';
    el.querySelector('.nm').textContent = a.name;
    el.querySelector('.ds').textContent = a.desc;
    p.appendChild(el);
  }
  $('#milk').style.setProperty('--mh', (3 + S.ach.length / A.length * 17) + '%');
}

/* ---------------- Stats ---------------- */
function dur(sec){
  sec = Math.floor(sec);
  const h = Math.floor(sec/3600), m = Math.floor(sec%3600/60), s = sec%60;
  return h ? `${h} h ${m} min` : m ? `${m} min ${s} s` : `${s} s`;
}
function renderStats(){
  const owned = B.reduce((a,b) => a + S.owned[b.id], 0);
  const rows = [
    ['Sušenek v bance', fmt(S.cookies)],
    ['Upečeno celkem', fmt(S.total)],
    ['Upečeno rukama', fmt(S.handmade)],
    ['Produkce za sekundu', fmt(cps(), true)],
    ['Síla kliku', fmt(clickValue(), true)],
    ['Počet kliků', fmt(S.clicks)],
    ['Kritické kliky', fmt(S.crits)],
    ['Nejlepší kombo', fmt(S.bestCombo)],
    ['Zlaté sušenky', fmt(S.golden)],
    ['Budov celkem', fmt(owned)],
    ['Vylepšení', `${S.upgrades.length} z ${U.length}`],
    ['Doba hraní', dur((Date.now() - S.start) / 1000)],
  ];
  $('#stats').innerHTML = rows.map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
}
function resetIdle(msg){
  const box = $('#reset');
  box.innerHTML = (msg ? `<p>${msg}</p>` : '') + '<button class="btn" id="resetBtn">Začít znovu</button>';
  $('#resetBtn').onclick = askReset;
}
$('#resetBtn').onclick = askReset;
function askReset(){
  const box = $('#reset');
  box.innerHTML = '<p>Smaže se všechno: sušenky, budovy, vylepšení i úspěchy.</p><button class="btn danger" id="resetYes">Smazat a začít znovu</button><button class="btn" id="resetNo">Zrušit</button>';
  $('#resetNo').onclick = () => resetIdle();
  $('#resetYes').onclick = () => {
    try { localStorage.removeItem(KEY); } catch(e){}
    const snd = S.sound;
    S = fresh(); S.sound = snd;
    R.combo = 0; R.goldTimer = rnd(20, 40); if (R.goldOn) hideGold();
    recalc(); updateShop('rebuild'); renderUpgrades('rebuild'); renderAch(); renderBuffs(); setAmt(1);
    resetIdle('Pec je vyhaslá a čistá. Hodně štěstí!');
  };
}

/* ---------------- Tabs & controls ---------------- */
let activeTab = 'p-b';
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-selected', x === t));
  document.querySelectorAll('.panel').forEach(p => p.hidden = p.id !== t.dataset.p);
  activeTab = t.dataset.p;
  if (activeTab === 'p-s') renderStats();
}));
function setAmt(n){
  S.buyAmt = n;
  document.querySelectorAll('.amt button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.n === n));
  updateShop();
}
document.querySelectorAll('.amt button').forEach(b => b.addEventListener('click', () => setAmt(+b.dataset.n)));
const soundBtn = $('#sound');
function renderSound(){ soundBtn.textContent = 'Zvuk: ' + (S.sound ? 'zapnutý' : 'vypnutý'); soundBtn.setAttribute('aria-pressed', S.sound); }
soundBtn.addEventListener('click', () => { S.sound = !S.sound; renderSound(); if (S.sound) SFX.buy(); });

/* ---------------- Buffs & news ---------------- */
function renderBuffs(){
  const box = $('#buffs');
  box.innerHTML = S.buffs.map(b => `<span class="buff ${b.id==='cf'?'click':''}" data-id="${b.id}" style="--p:${(b.left/b.dur).toFixed(3)}">${b.name} · ${Math.ceil(b.left)} s</span>`).join('');
  stage.classList.toggle('frenzy', S.buffs.length > 0);
}
const newsEl = $('#news');
function nextNews(){
  const pool = NEWS.find(n => S.total < n[0])[1];
  newsEl.textContent = pool[Math.floor(Math.random() * pool.length)];
}
newsEl.addEventListener('animationiteration', nextNews);

/* ---------------- Save / load ---------------- */
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }
function load(data){
  let d = data && data.S;
  if (!d){ try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch(e){ d = null; } }
  if (!d) return false;
  const f = fresh();
  S = Object.assign(f, d);
  S.owned = Object.assign(fresh().owned, d.owned || {});
  S.buffs = Array.isArray(d.buffs) ? d.buffs : [];
  return !(data && data.S);
}

/* ---------------- Main loop ---------------- */
const unitEl = $('#unit'), rateEl = $('#rate'), comboEl = $('#combo'), comboTxt = $('#comboTxt'), comboBar = $('#comboBar');
let lastT = performance.now(), slow = 0, saveT = 0, buffT = 0;
function frame(t){
  const dt = Math.min(.1, (t - lastT) / 1000); lastT = t;
  const nowMs = Date.now();
  const prod = Math.min(86400, Math.max(0, (nowMs - S.last) / 1000)); S.last = nowMs;
  gain(cps() * prod);

  if (S.buffs.length){
    for (const b of S.buffs) b.left -= prod;
    const before = S.buffs.length;
    S.buffs = S.buffs.filter(b => b.left > 0);
    buffT += dt;
    if (buffT > .2 || before !== S.buffs.length){ buffT = 0; renderBuffs(); }
  }

  if (performance.now() - R.lastClick > 700) R.combo = Math.max(0, R.combo - dt * 45);
  const heat = Math.min(R.combo, 200) / 200;
  comboBar.style.width = (heat * 100) + '%';
  comboTxt.textContent = '×' + comboMult().toFixed(2).replace('.', ',');
  comboEl.classList.toggle('fire', R.combo >= 100);
  wrap.style.setProperty('--heat', heat.toFixed(2));

  if (R.goldOn){ R.goldLife -= dt; if (R.goldLife <= 0) hideGold(); }
  else { R.goldTimer -= dt; if (R.goldTimer <= 0) spawnGold(); }

  countEl.textContent = fmt(S.cookies);
  unitEl.textContent = S.cookies < 1e6 ? plural(S.cookies) : 'sušenek';
  rateEl.textContent = fmt(cps(), true);

  drawBg(dt); drawOrbit(dt, t / 1000); drawFx(dt);

  slow += dt;
  if (slow > .25){ slow = 0; updateShop(); checkAch(); if (activeTab === 'p-s') renderStats(); }
  saveT += dt;
  if (saveT > 5){ saveT = 0; save(); }
  requestAnimationFrame(frame);
}

function start(data){
  const fromStorage = load(data || {});
  recalc();
  if (fromStorage){
    const away = (Date.now() - S.last) / 1000;
    if (away > 60 && C.raw > 0){
      const earned = C.raw * Math.min(away, 86400) * .5;
      gain(earned);
      setTimeout(() => toast('🌙', 'Vítej zpátky', `+${fmt(earned)} sušenek`, `Pec pekla i bez tebe (${dur(away)}, poloviční tempo).`), 600);
    }
  }
  S.last = Date.now();
  buildShop(); resize(); setAmt(S.buyAmt || 1); renderAch(); renderBuffs(); renderSound(); nextNews();
  requestAnimationFrame(t => { lastT = t; resize(); frame(t); });
}

document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
addEventListener('pagehide', save);
start({});
})();
