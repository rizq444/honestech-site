(()=> {
  // PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // Form logic
  const form = document.getElementById('apptForm');
  const statusEl = document.getElementById('status');

  // Min date = today; default time 17:30
  const today = new Date(); today.setHours(0,0,0,0);
  form.querySelector('input[name="date"]').min = today.toISOString().slice(0,10);
  form.querySelector('input[name="time"]').value = '17:30';

  function validate(){
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => { if(!el.value.trim()) ok=false; });
    const email = form.querySelector('input[name="email"]').value.trim();
    if(!/^\S+@\S+\.\S+$/.test(email)) ok=false;
    const hour = +form.querySelector('input[name="time"]').value.split(':')[0];
    if(hour < 17) ok=false; // after 5pm
    return ok;
  }

  function toICS(data){
    function pad(n){ return String(n).padStart(2,'0'); }
    function fmt(d){ return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+
                     pad(d.getUTCHours())+pad(d.getUTCMinutes())+'00Z'; }
    const start = new Date(data.date+'T'+data.time);
    const end = new Date(start.getTime() + 90*60000);
    return [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Honestech//Appt//EN','BEGIN:VEVENT',
      'UID:'+Date.now(),'DTSTAMP:'+fmt(new Date()),
      'DTSTART:'+fmt(start),'DTEND:'+fmt(end),
      'SUMMARY:Honestech — '+data.service,
      'LOCATION:'+data.address,
      'DESCRIPTION:Name: '+data.name+'\\nPhone: '+data.phone+'\\nEmail: '+data.email+
      '\\nVehicle: '+data.vehicle+'\\nNotes: '+(data.notes||'')+'\\n\\nLabor: $100/hr',
      'END:VEVENT','END:VCALENDAR'
    ].join('\\r\\n');
  }

  async function sendFormSubmit(payload){
    const r = await fetch('https://formsubmit.co/ajax/honestechservice@gmail.com', {
      method: 'POST',
      headers: {'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({
        _subject: 'New Booking via Honestech App',
        _captcha: 'false',
        _template: 'table',
        ...payload
      })
    });
    return r.ok;
  }

  function saveLocal(payload){
    const key = 'honestech_queue';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push({createdAt: new Date().toISOString(), ...payload});
    localStorage.setItem(key, JSON.stringify(list));
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!validate()){ statusEl.textContent = 'Please complete all required fields (time must be 5:00 PM or later).'; return; }

    const data = Object.fromEntries(new FormData(form).entries());

    // Offer calendar file
    try{
      const ics = toICS(data);
      const blob = new Blob([ics], {type:'text/calendar'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Honestech_'+data.date+'_'+data.time.replace(':','')+'.ics';
      a.click();
    }catch(_){}

    statusEl.textContent = 'Submitting…';
    let ok = false;
    try { ok = await sendFormSubmit(data); } catch(_){ ok = false; }

    if(ok){
      statusEl.textContent = 'Request sent! Check your email for confirmation.';
      saveLocal({...data, _sent:true});
      form.reset();
      form.querySelector('input[name="time"]').value = '17:30';
    }else{
      statusEl.textContent = 'You are offline or the server failed — saved locally, will retry later.';
      saveLocal({...data, _sent:false});
    }
  });
})();
