function $(id){return document.getElementById(id)}
let debounceTimer = null;
function debounce(fn, ms){ clearTimeout(debounceTimer); debounceTimer = setTimeout(fn, ms||300); }

// Tabs
$('tabLogin').addEventListener('click', ()=>{ $('loginBox').style.display='block'; $('signupBox').style.display='none'; $('tabLogin').classList.add('active'); $('tabSignup').classList.remove('active'); });
$('tabSignup').addEventListener('click', ()=>{ $('loginBox').style.display='none'; $('signupBox').style.display='block'; $('tabSignup').classList.add('active'); $('tabLogin').classList.remove('active'); });

// Login
$('loginSubmit').addEventListener('click', async ()=>{
  const email = $('loginEmail').value; const password = $('loginPassword').value;
  $('loginMsg').textContent = '';
  try{
    const r = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password })});
    const j = await r.json(); if (j.token){ localStorage.setItem('mp_token', j.token); location.href='/'; } else { $('loginMsg').textContent = j.error || 'Login failed'; }
  }catch(e){ $('loginMsg').textContent = 'Network error'; }
});

// Signup: realtime email availability + password strength
$('signupEmail').addEventListener('input', ()=>{
  const email = $('signupEmail').value.trim(); $('emailStatus').textContent = 'Checking...';
  debounce(async ()=>{
    if (!email) { $('emailStatus').textContent=''; return; }
    try{
      const r = await fetch('/api/check-email?email='+encodeURIComponent(email)); const j = await r.json(); $('emailStatus').textContent = j.available ? 'Email available' : 'Email already taken';
    }catch(e){ $('emailStatus').textContent='Error'; }
  }, 400);
});

function pwStrength(pw){
  if (!pw) return 'Empty';
  let score = 0;
  if (pw.length>=8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return ['Very weak','Weak','Fair','Good','Strong'][score];
}
$('signupPassword').addEventListener('input', ()=>{ $('pwStrength').textContent = 'Strength: '+pwStrength($('signupPassword').value); });

$('signupSubmit').addEventListener('click', async ()=>{
  const email = $('signupEmail').value; const password = $('signupPassword').value; const name = $('signupName').value;
  $('signupMsg').textContent = '';
  try{
    const r = await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password, name })});
    const j = await r.json(); if (j.token){ localStorage.setItem('mp_token', j.token); location.href='/'; } else { $('signupMsg').textContent = j.error || 'Signup failed'; }
  }catch(e){ $('signupMsg').textContent = 'Network error'; }
});

// allow Enter key
document.addEventListener('keydown', (e)=>{ if (e.key==='Enter'){ if ($('loginBox').style.display !== 'none') $('loginSubmit').click(); else $('signupSubmit').click(); }});
