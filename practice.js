export function parseWords(text) {
  const seen = new Set();
  return text.split(/[\n,;]+/).map(w => w.trim().normalize('NFC')).filter(w => { const key = w.toLocaleLowerCase(); if (!w || seen.has(key)) return false; seen.add(key); return true; });
}
export function pickSet(words, random = Math.random) {
  const pool = [...words];
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, 5);
}
export function secondsLeft(deadline, now = Date.now()) { return Math.max(0, Math.ceil((deadline - now) / 1000)); }
