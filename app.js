import { officialWords } from './words.js';
import { parseWords, pickSet, secondsLeft } from './practice.js';
const $ = id => document.getElementById(id);
let words = officialWords, custom = false;
try { const saved = JSON.parse(localStorage.getItem('spell-sprout-words')); if(Array.isArray(saved) && saved.every(w => typeof w === 'string') && parseWords(saved.join('\n')).length >= 5) { words = parseWords(saved.join('\n')); custom = true; } } catch {}
let set = [], index = 0, phase = 'ready', generation = 0, interval, voices = [], deadline = 0;
const synth = window.speechSynthesis;
function summary() { $('listSummary').textContent = `${words.length} words · ${custom ? 'Your saved spelling list' : 'Junior 2026 Spell Bowl · official PDF list'}`; }
function loadVoices() { if(!synth) return; const previous = $('voice').value; voices = synth.getVoices().filter(v => /^en/i.test(v.lang)); $('voice').replaceChildren(...voices.map((v,i) => new Option(`${v.name} (${v.lang})`, String(i)))); if(!voices.length) $('voice').add(new Option('Device default English voice','')); else if(previous && voices[Number(previous)]) $('voice').value = previous; }
loadVoices(); if(synth) synth.addEventListener('voiceschanged',loadVoices);
function render() {
  $('dots').replaceChildren(...Array.from({length:5},(_,i) => {const dot=document.createElement('span'); dot.className='dot'+(phase==='complete'||i<index?' done':set.length&&i===index?' active':'');return dot;}));
  $('setLabel').textContent = phase==='complete'?'SET COMPLETE':set.length?`WORD ${index+1} OF 5`:'READY WHEN YOU ARE';
  $('timer').hidden=phase!=='writing'; $('answer').hidden=phase!=='reveal';
  $('primary').hidden=['speaking','writing'].includes(phase); $('primary').disabled=false;
  $('primary').textContent=phase==='reveal'?(index===4?'Finish this set ✓':'Next word →'):phase==='complete'?'Practice another set ↗':'Let’s practice ↗';
  $('again').hidden=phase!=='reveal'; $('end').hidden=!set.length||phase==='complete'; $('edit').disabled=Boolean(set.length)&&phase!=='complete'; $('voice').disabled=Boolean(set.length)&&phase!=='complete';
  const copy={ready:['♫','Your next victory starts here.','We’ll say each word twice. Keep your answer on paper!'],speaking:['♫','Listen closely…','Your word is being read twice. The timer starts after the second reading.'],writing:['✎','Pencil to paper.','Write the word in your notebook. Take your time.'],reveal:['✓','Time to check your spelling.','Compare with your notebook and make any corrections.'],complete:['✳','Five words. A little stronger.','Nice practice! Review your corrections, then try a fresh set.']}[phase];
  $('icon').textContent=copy[0]; $('heading').textContent=copy[1]; $('instruction').textContent=copy[2];
}
function speak(text, token) { return new Promise((resolve,reject) => {
  if(!synth) {reject(new Error('This browser does not support speech. Try Chrome, Edge, or Safari.'));return;}
  const utterance=new SpeechSynthesisUtterance(text); utterance.lang='en-US'; utterance.rate=.8;
  if(voices[Number($('voice').value)]) utterance.voice=voices[Number($('voice').value)];
  const timeout=setTimeout(()=>{if(token===generation) synth.cancel(); reject(new Error('Audio did not finish. Check your sound and retry.'));},30000);
  utterance.onend=()=>{clearTimeout(timeout);resolve();}; utterance.onerror=()=>{clearTimeout(timeout);reject(new Error('Audio could not play. Check your sound and retry.'));}; synth.speak(utterance);
}); }
function fail(error,token) {if(token!==generation)return; $('status').textContent=error.message; $('retry').hidden=false;}
async function pronounce() {
  const token=++generation; synth?.cancel(); phase='speaking'; $('status').textContent=''; $('retry').hidden=true;render();
  try { await speak(set[index],token); if(token!==generation)return; await new Promise(r=>setTimeout(r,800)); if(token!==generation)return; await speak(set[index],token); if(token!==generation)return; phase='writing';deadline=Date.now()+60000;render();tick();interval=setInterval(tick,200); } catch(error) {fail(error,token);}
}
function tick() { if(phase!=='writing')return;const seconds=secondsLeft(deadline);$('timer').textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;if(seconds===0){clearInterval(interval);reveal();} }
async function spell() {const token=++generation;synth?.cancel();$('status').textContent='';$('retry').hidden=true;$('again').disabled=true;try{await speak(set[index],token);for(const letter of set[index]) {if(token!==generation)return;await speak(letter===' '?'space':letter==='-'?'hyphen':letter,token);}if(token!==generation)return;await speak(set[index],token);}catch(error){fail(error,token);}finally{if(token===generation)$('again').disabled=false;} }
function reveal(){phase='reveal';$('answer').textContent=set[index];render();spell();}
function reset(){++generation;synth?.cancel();clearInterval(interval);set=[];index=0;phase='ready';$('status').textContent='';$('retry').hidden=true;$('again').disabled=false;render();}
$('primary').onclick=()=>{if(phase==='reveal'){++generation;synth?.cancel();$('again').disabled=false;$('retry').hidden=true;$('status').textContent='';if(index===4){phase='complete';render();return;}index++;pronounce();}else{set=pickSet(words);index=0;pronounce();}};
$('end').onclick=reset;$('again').onclick=spell;$('retry').onclick=()=>phase==='reveal'?spell():pronounce();
$('edit').onclick=()=>{$('words').value=words.join('\n');$('listError').textContent='';$('editor').showModal();};
$('file').onchange=async event=>{const file=event.target.files[0];if(file){if(file.size>1000000){$('listError').textContent='Please use a text file smaller than 1 MB.';return;}$('words').value=await file.text();}};
$('save').onclick=()=>{const list=parseWords($('words').value);if(list.length<5){$('listError').textContent='Please add at least 5 unique words.';return;}words=list;custom=true;try{localStorage.setItem('spell-sprout-words',JSON.stringify(words));}catch{$('status').textContent='Your list is loaded for this visit, but this browser could not save it.';}summary();$('editor').close();};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});window.addEventListener('pagehide',()=>{++generation;synth?.cancel();clearInterval(interval);});summary();render();
