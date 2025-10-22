// County → Towns
window.HONESTECH_LOCATIONS = {
  middlesex: [
    "Edison","Woodbridge","Piscataway","New Brunswick","Old Bridge","East Brunswick","South Brunswick",
    "North Brunswick","Sayreville","Perth Amboy","Carteret","Metuchen","Middlesex","Highland Park",
    "South Plainfield","South River","Spotswood","Milltown","Dunellen","Cranbury","Plainsboro",
    "Helmetta","Jamesburg"
  ].map(n => ({ name: n, slug: n.toLowerCase().replace(/[^a-z0-9]+/g,'-') })),

  monmouth: [
    "Middletown","Howell","Marlboro","Manalapan","Freehold","Long Branch","Neptune","Ocean Township",
    "Red Bank","Holmdel","Aberdeen","Hazlet","Wall","Tinton Falls","Eatontown","Shrewsbury",
    "Little Silver","Keyport","Keansburg","Highlands","Atlantic Highlands","Asbury Park","Belmar",
    "Bradley Beach","Neptune City","Spring Lake","Sea Girt","Colts Neck","Englishtown","Farmingdale",
    "Brielle","Avon-by-the-Sea","Fair Haven","Rumson","Union Beach","Oceanport","Monmouth Beach",
    "West Long Branch","Allentown","Roosevelt","Shrewsbury Township"
  ].map(n => ({ name: n, slug: n.toLowerCase().replace(/[^a-z0-9]+/g,'-') }))
};

// On /locations.html, render lists
(function(){
  const d = window.HONESTECH_LOCATIONS;
  function renderList(containerId, countyKey){
    const ul = document.getElementById(containerId);
    if(!ul || !d[countyKey]) return;
    ul.innerHTML = '';
    d[countyKey].forEach(t => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = t.name;
      a.href = `/locations/town.html?county=${countyKey}&town=${t.slug}`;
      li.appendChild(a);
      ul.appendChild(li);
    });
  }
  renderList('list-middlesex','middlesex');
  renderList('list-monmouth','monmouth');
})();