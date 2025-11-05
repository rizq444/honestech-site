
(function(){
  function $(sel, ctx){ return (ctx||document).querySelector(sel); }
  function $all(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }

  var btn = $('#navToggle');
  var panel = $('#navPanel');
  var backdrop = $('#navBackdrop');

  // If a panel exists, make sure it's hidden on load
  if(panel){
    if(!panel.hasAttribute('hidden')) panel.setAttribute('hidden','');
    panel.setAttribute('aria-hidden','true');
  }
  if(backdrop){
    if(!backdrop.hasAttribute('hidden')) backdrop.setAttribute('hidden','');
  }

  // Ensure a HOME link exists at the top of the menu
  if(panel){
    var nav = panel.querySelector('nav') || panel;
    var hasHome = nav && nav.querySelector('a[href="/"]');
    if(nav && !hasHome){
      var a = document.createElement('a');
      a.href = '/';
      a.textContent = 'Home';
      nav.insertBefore(a, nav.firstChild);
    }
  }

  function openNav(){
    if(!panel || !backdrop || !btn) return;
    panel.removeAttribute('hidden');
    backdrop.removeAttribute('hidden');
    btn.setAttribute('aria-expanded','true');
    panel.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');
  }
  function closeNav(){
    if(!panel || !backdrop || !btn) return;
    panel.setAttribute('hidden','');
    backdrop.setAttribute('hidden','');
    btn.setAttribute('aria-expanded','false');
    panel.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll');
  }

  if(btn){
    btn.addEventListener('click', function(){
      var open = panel && !panel.hasAttribute('hidden');
      open ? closeNav() : openNav();
    });
  }
  if(backdrop) backdrop.addEventListener('click', closeNav);

  // Close when pressing ESC
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeNav(); });

  // Close immediately when a menu link is clicked (before navigating)
  if(panel){
    panel.addEventListener('click', function(e){
      var t = e.target;
      if(t && t.closest('a')) closeNav();
    });
  }

  // As a double-safety, ensure panel is closed after page show (bfcache restore on iOS)
  window.addEventListener('pageshow', function(){ closeNav(); });
})();
