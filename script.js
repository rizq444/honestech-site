
(function(){
  function qs(s, c){ return (c||document).querySelector(s); }
  var btn = qs('#navToggle'), panel = qs('#navPanel'), backdrop = qs('#navBackdrop');
  function openN(){ if(!panel||!backdrop||!btn) return; panel.removeAttribute('hidden'); backdrop.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); panel.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll'); }
  function closeN(){ if(!panel||!backdrop||!btn) return; panel.setAttribute('hidden',''); backdrop.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); panel.setAttribute('aria-hidden','true'); document.body.classList.remove('no-scroll'); }
  window.addEventListener('pageshow', closeN);
  if(btn){ btn.addEventListener('click', function(){ var open = panel && !panel.hasAttribute('hidden'); open?closeN():openN(); }); }
  if(backdrop) backdrop.addEventListener('click', closeN);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeN(); });
  if(panel){
    var nav = panel.querySelector('nav')||panel;
    if(nav && !nav.querySelector('a[href="/"]')){ var a=document.createElement('a'); a.href='/'; a.textContent='Home'; nav.insertBefore(a, nav.firstChild); }
    panel.addEventListener('click', function(e){ if(e.target && e.target.closest('a')) closeN(); });
  }
})();
