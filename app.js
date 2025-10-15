(function(){
  const form = document.getElementById('bookingForm');
  const resultBox = document.getElementById('result');
  const dlIcs = document.getElementById('downloadIcs');
  const googleCal = document.getElementById('googleCal');
  const mailto = document.getElementById('mailto');
  const year = document.getElementById('year');
  const statusEl = document.getElementById('serverlessStatus');
  if(year) year.textContent = new Date().getFullYear();

  // FormSubmit (AJAX)
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/honestechservice@gmail.com";

  // Honeypot
  const honeypot = document.createElement('input');
  honeypot.type = 'text'; honeypot.name = 'website'; honeypot.autocomplete = 'off'; honeypot.style.display = 'none';
  if(form) form.appendChild(honeypot);

  const dateEl = document.getElementById('date');
  const timeEl = document.getElementById('time');
  const today = new Date(); today.setHours(0,0,0,0);
  if(dateEl) dateEl.min = today.toISOString().slice(0,10);
  if(timeEl) timeEl.value = "17:30";

  function err(el, msg){
    const small = el && el.parentElement && el.parentElement.querySelector('.err');
    if(small){ small.textContent = msg || ''; }
  }
  function validate(){
    let ok = true;
    form.querySelectorAll('[required]').forEach(el=>{
      if(!el.value.trim()){ err(el,'Required'); ok=false; } else { err(el,''); }
    });
    const email = document.getElementById('email');
    if(email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){ err(email,'Enter a valid email'); ok=false; }
    const t = timeEl && timeEl.value;
    if(t){
      const h = parseInt(t.split(':')[0]||'0',10);
      if(h < 17){ err(timeEl,'Choose 5:00 PM or later'); ok=false; } else { err(timeEl,''); }
    }
    return ok;
  }
  function pad(n){ return String(n).padStart(2,'0'); }
  function buildICS(data){
    const start = new Date(data.datetime);
    const end = new Date(start.getTime() + 90*60000);
    function toICSDate(d){
      return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+'Z';
    }
    const summary = 'Honestech Mobile Mechanic — ' + data.service;
    const description = [
      'Name: ' + data.name,
      'Phone: ' + data.phone,
      'Email: ' + data.email,
      'Vehicle: ' + data.vehicle,
      'Address: ' + data.address,
      'Notes: ' + (data.notes || ''),
      '',
      'Labor: $100/hr',
      'Customer supplies parts.'
    ].join('\n');
    return [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Honestech//Booking//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
      'UID:'+(crypto.randomUUID?crypto.randomUUID():Date.now()),
      'DTSTAMP:'+toICSDate(new Date()),
      'DTSTART:'+toICSDate(start),'DTEND:'+toICSDate(end),
      'SUMMARY:'+summary,'LOCATION:'+data.address,
      'DESCRIPTION:'+description.replace(/\n/g,'\\n'),
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
  }
  function buildGoogleCalURL(data){
    const start = new Date(data.datetime);
    const end = new Date(start.getTime() + 90*60000);
    function fmt(d){ return d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'T'+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds()); }
    const text = 'Honestech Mobile Mechanic — ' + data.service;
    const details = 'Name: '+data.name+'%0APhone: '+data.phone+'%0AEmail: '+data.email+'%0AVehicle: '+data.vehicle+'%0AAddress: '+data.address+'%0ANotes: '+encodeURIComponent(data.notes||'')+'%0A%0ALabor: $100/hr — customer supplies parts.';
    const location = encodeURIComponent(data.address);
    return 'https://calendar.google.com/calendar/r/eventedit?text='+encodeURIComponent(text)+'&dates='+fmt(start)+'/'+fmt(end)+'&details='+details+'&location='+location;
  }
  function buildMailto(data){
    const subject = 'Appointment Request — '+data.service+' — '+data.name;
    const lines = [
      'Service: '+data.service,'Date: '+data.date+' at '+data.time,'Name: '+data.name,'Phone: '+data.phone,'Email: '+data.email,'Vehicle: '+data.vehicle,'Address: '+data.address,'Notes: '+(data.notes||'')
    ];
    return 'mailto:honestechservice@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));
  }

  async function postServerless(payload){
    if(!form) return;
    if(!payload) return;
    try{
      statusEl.textContent = "Submitting…";
      const r = await fetch("https://formsubmit.co/ajax/honestechservice@gmail.com", {
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({
          _subject:'New Honestech Booking', _captcha:'false', ...payload
        })
      });
      if(r.ok){ statusEl.textContent = "Submitted! Check your email for the request."; }
      else { statusEl.textContent = "Submission error — email draft provided below."; }
    }catch(e){
      statusEl.textContent = "Network error — email draft provided below.";
    }
  }

  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      if(!validate()) return;

      const data = Object.fromEntries(new FormData(form).entries());
      const t = (data.time||'').split(':');
      const d = new Date((data.date||'')+'T00:00');
      if(!isNaN(d)){ d.setHours(parseInt(t[0]||'17',10), parseInt(t[1]||'30',10), 0, 0); data.datetime = d; }

      const ics = buildICS(data);
      const blob = new Blob([ics], {type:'text/calendar;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      if(dlIcs){ dlIcs.href = url; dlIcs.download = 'Honestech_'+(data.date||'')+'_'+(data.time||'').replace(':','')+'.ics'; }

      if(googleCal) googleCal.href = buildGoogleCalURL(data);
      if(mailto) mailto.href = buildMailto(data);

      // Save small summary locally
      const key = 'honestech_appointments';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push({ createdAt:new Date().toISOString(), ...data });
      localStorage.setItem(key, JSON.stringify(list));

      // Send via FormSubmit
      await postServerless({
        service:data.service, date:data.date, time:data.time, name:data.name, phone:data.phone, email:data.email, vehicle:data.vehicle, address:data.address, notes:data.notes||''
      });

      if(resultBox){ resultBox.hidden = false; resultBox.scrollIntoView({behavior:'smooth'}); }
    });
  }
})();
