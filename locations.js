// Build county lists (including Ocean) and link each to a generic town page
window.HONESTECH_LOCATIONS={
  middlesex:["Edison","Woodbridge","Piscataway","New Brunswick","Old Bridge","East Brunswick","South Brunswick","North Brunswick","Sayreville","Perth Amboy","Carteret","Metuchen","South Plainfield","South River","Milltown","Dunellen","Cranbury","Plainsboro","Jamesburg"].map(n=>({name:n,slug:n.toLowerCase().replace(/[^a-z0-9]+/g,'-')})),
  monmouth:["Middletown","Howell","Marlboro","Manalapan","Freehold","Long Branch","Neptune","Ocean Township","Red Bank","Holmdel","Aberdeen","Hazlet","Wall","Tinton Falls","Eatontown","Shrewsbury","Keyport","Keansburg","Asbury Park","Belmar"].map(n=>({name:n,slug:n.toLowerCase().replace(/[^a-z0-9]+/g,'-')})),
  ocean:[
    "Toms River","Brick","Lakewood","Jackson","Manchester","Berkeley Township","Lacey","Stafford","Barnegat","Little Egg Harbor",
    "Point Pleasant","Point Pleasant Beach","Seaside Heights","Seaside Park","Beachwood","Pine Beach","Ocean Gate","Island Heights",
    "Bay Head","Lavallette","Mantoloking","Plumsted","Barnegat Light","Harvey Cedars","Surf City","Ship Bottom","Beach Haven","Long Beach Township"
  ].map(n=>({name:n,slug:n.toLowerCase().replace(/[^a-z0-9]+/g,'-')}))
};

function buildList(id,key){
  const el=document.getElementById(id), towns=(window.HONESTECH_LOCATIONS[key]||[]);
  if(!el)return; el.innerHTML='';
  towns.forEach(t=>{
    const a=document.createElement('a');
    a.className='town-btn';
    a.textContent=t.name;
    a.href=`/locations/town.html?county=${key}&town=${t.slug}`;
    el.appendChild(a);
  });
}

buildList('list-middlesex','middlesex');
buildList('list-monmouth','monmouth');
buildList('list-ocean','ocean');
