// Dátumy: server posiela ISO 8601; bez zóny predpokladáme UTC. Zobrazujeme lokálny čas.
function parseDate(s){ if(!s) return null; if(!/(Z|[+-]\d{2}:?\d{2})$/.test(s)) s+='Z'; return new Date(s); }
function fmtDate(s){ const d=parseDate(s); return d?d.toLocaleString('sk-SK',{dateStyle:'medium',timeStyle:'short'}):''; }
const p2=n=>String(n).padStart(2,'0');
function toInput(d){ if(typeof d==='string') d=parseDate(d); return `${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}T${p2(d.getHours())}:${p2(d.getMinutes())}`; }
function toIso(local){ return new Date(local).toISOString(); }
function isOverdue(t){ return !t.is_finished && parseDate(t.date_to) < new Date(); }
