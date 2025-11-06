
(function(){
  function $(s, c){ return (c||document).querySelector(s); }
  var btn=$('#navToggle'), panel=$('#navPanel'), backdrop=$('#navBackdrop');

  function closeNav(){ if(panel){panel.setAttribute('hidden',''); panel.setAttribute('aria-hidden','true');}
    if(backdrop){backdrop.setAttribute('hidden','');}
    if(btn){btn.setAttribute('aria-expanded','false');}
    document.body.classList.remove('no-scroll');
  }
  function openNav(){ if(panel){panel.removeAttribute('hidden'); panel.setAttribute('aria-hidden','false');}
    if(backdrop){backdrop.removeAttribute('hidden');}
    if(btn){btn.setAttribute('aria-expanded','true');}
    document.body.classList.add('no-scroll');
  }

  // Ensure hidden on first paint
  if(panel && !panel.hasAttribute('hidden')) panel.setAttribute('hidden','');
  if(panel) panel.setAttribute('aria-hidden','true');
  if(backdrop && !backdrop.hasAttribute('hidden')) backdrop.setAttribute('hidden','');

  // Inject Home if missing
  if(panel){
    var nav = panel.querySelector('nav') || panel;
    if(nav && !nav.querySelector('a[href="/"]')){ var a=document.createElement('a'); a.href='/'; a.textContent='Home'; nav.insertBefore(a, nav.firstChild); }
  }

  if(btn){ btn.addEventListener('click', function(){ var open = panel && !panel.hasAttribute('hidden'); open?closeNav():openNav(); }); }
  if(backdrop){ backdrop.addEventListener('click', closeNav); }
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeNav(); });

  if(panel){ panel.addEventListener('click', function(e){ if(e.target && e.target.closest('a')) closeNav(); }); }

  window.addEventListener('pageshow', closeNav);
  document.addEventListener('DOMContentLoaded', closeNav);
})();
