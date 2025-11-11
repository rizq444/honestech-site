
(function(){
  const toggle = document.getElementById('navToggle');
  const panel = document.getElementById('navPanel');
  const backdrop = document.getElementById('navBackdrop');
  function close(){ panel.setAttribute('aria-hidden','true'); backdrop.classList.remove('show'); toggle.setAttribute('aria-expanded','false'); }
  function open(){ panel.setAttribute('aria-hidden','false'); backdrop.classList.add('show'); toggle.setAttribute('aria-expanded','true'); }
  toggle && toggle.addEventListener('click', ()=>{
    (panel.getAttribute('aria-hidden') !== 'false') ? open() : close();
  });
  backdrop && backdrop.addEventListener('click', close);
  document.querySelectorAll('.nav-menu a').forEach(a=>a.addEventListener('click', close));
})();
