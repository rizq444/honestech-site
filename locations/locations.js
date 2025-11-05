(function(){
  function slug(s){return s.toLowerCase().normalize('NFD').replace(/[^\w\s-]/g,'').trim().replace(/\s+/g,'-');}
  const data = [
    { county: "Middlesex County", key: "middlesex", towns: ["Edison", "New Brunswick", "Piscataway", "Woodbridge", "Old Bridge", "Perth Amboy", "South Amboy", "Sayreville", "South River", "East Brunswick", "North Brunswick", "Highland Park", "Metuchen", "Carteret", "Middlesex Borough", "Cranbury", "Dunellen", "Helmetta", "Jamesburg", "Milltown", "Monroe Township", "Plainsboro", "South Brunswick", "Spotswood"] },
    { county: "Monmouth County", key: "monmouth", towns: ["Asbury Park", "Atlantic Highlands", "Belmar", "Bradley Beach", "Brielle", "Colts Neck", "Deal", "Eatontown", "Englishtown", "Fair Haven", "Farmingdale", "Freehold", "Hazlet", "Highlands", "Holmdel", "Howell", "Keansburg", "Keyport", "Little Silver", "Long Branch", "Manalapan", "Manasquan", "Marlboro", "Matawan", "Middletown", "Millstone", "Monmouth Beach", "Neptune Township", "Neptune City", "Ocean Township", "Oceanport", "Red Bank", "Rumson", "Sea Bright", "Sea Girt", "Shrewsbury", "Spring Lake", "Tinton Falls", "Union Beach", "Upper Freehold", "Wall Township", "West Long Branch"] },
    { county: "Ocean County", key: "ocean", towns: ["Toms River", "Brick Township", "Lakewood", "Jackson", "Point Pleasant", "Point Pleasant Beach", "Seaside Heights", "Seaside Park", "Lavallette", "Berkeley (Bayville)", "Beachwood", "Pine Beach", "Ocean Gate", "South Toms River", "Island Heights", "Manchester Township", "Plumsted (New Egypt)", "Lacey Township (Forked River)", "Barnegat", "Barnegat Light", "Stafford (Manahawkin)", "Long Beach Township", "Ship Bottom", "Surf City", "Harvey Cedars", "Beach Haven", "Little Egg Harbor", "Eagleswood"] }
  ];
  const root = document.getElementById('locations-root');
  data.forEach(({county, key, towns}) => {
    const sec = document.createElement('section');
    sec.className = 'county';
    const h2 = document.createElement('h2'); h2.textContent = county; sec.appendChild(h2);
    const ul = document.createElement('ul'); ul.className = 'towns';
    towns.forEach(name => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'town';
      a.textContent = name;
      a.href = `town.html?county=${encodeURIComponent(key)}&town=${encodeURIComponent(slug(name))}`;
      li.appendChild(a); ul.appendChild(li);
    });
    sec.appendChild(ul);
    root.appendChild(sec);
  });
})();