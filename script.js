
(function(){
  var btn = document.getElementById('navToggle');
  var panel = document.getElementById('navPanel');
  var backdrop = document.getElementById('navBackdrop');
  if(!btn || !panel || !backdrop) return;

  function openNav(){
    panel.removeAttribute('hidden');
    backdrop.removeAttribute('hidden');
    btn.setAttribute('aria-expanded','true');
    panel.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');
  }
  function closeNav(){
    panel.setAttribute('hidden','');
    backdrop.setAttribute('hidden','');
    btn.setAttribute('aria-expanded','false');
    panel.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll');
  }
  btn.addEventListener('click', function(){
    var open = !panel.hasAttribute('hidden');
    open ? closeNav() : openNav();
  });
  backdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeNav(); });
  panel.addEventListener('click', function(e){ if(e.target.tagName==='A') closeNav(); });
})();
