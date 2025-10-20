(function(){
  const body = document.body;
  const toggle = document.getElementById('navToggle');
  const panel = document.getElementById('navPanel');
  const backdrop = document.getElementById('navBackdrop');
  if(!toggle || !panel || !backdrop) return;
  const open = () => { body.classList.add('nav-open'); toggle.setAttribute('aria-expanded','true'); panel.setAttribute('aria-hidden','false'); backdrop.hidden = false; };
  const close = () => { body.classList.remove('nav-open'); toggle.setAttribute('aria-expanded','false'); panel.setAttribute('aria-hidden','true'); backdrop.hidden = true; };
  toggle.addEventListener('click', ()=> body.classList.contains('nav-open') ? close() : open());
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
  panel.querySelectorAll('a').forEach(a=> a.addEventListener('click', close));
})();