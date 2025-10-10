// Booking + FormSubmit (no account) + calendar/email fallbacks
(function(){
  const form = document.getElementById('bookingForm');
  const resultBox = document.getElementById('result');
  const dlIcs = document.getElementById('downloadIcs');
  const googleCal = document.getElementById('googleCal');
  const mailto = document.getElementById('mailto');
  const year = document.getElementById('year');
  const statusEl = document.getElementById('serverlessStatus');
  year.textContent = new Date().getFullYear();

  // === CONFIG ===
  // FormSubmit AJAX endpoint (sends emails to honestechservice@gmail.com)
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/honestechservice@gmail.com";
  const ENABLE_SERVERLESS = true;

  // Honeypot for bots
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'website';
  honeypot.autocomplete = 'off';
  honeypot.style.display = 'none';
  form.appendChild(honeypot);

  // Set min date = today
  const dateEl = document.getElementById('date');
  const today = new Date();
  today.setHours(0,0,0,0);
  dateEl.min = today.toISOString().slice(0,10);

  // Ensure time after 17:00
  const timeEl = document.getElementById('time');
  timeEl.value = "17:30";

  function err(el, msg){
    const small = el.parentElement.querySelector('.err');
    if(small){ small.textContent = msg || ''; }
  }

  function validate(){
    let ok = true;
    form.querySelectorAll('[required]').forEach(el=>{
      if(!el.value.trim()){
        err(el, 'Required');
        ok = false;
      } else {
        err(el, '');
      }
    });
    const email = document.getElementById('email');
    if(email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){
      err(email,'Enter a valid email');
      ok=false;
    }
    const t = timeEl.value;
    if(t){
      const [h,m] = t.split(':').map(Number);
      if(h < 17){
        err(timeEl,'Choose 5:00 PM or later');
        ok=false;
      } else {
        err(timeEl,'');
      }
    }
    return ok;
  }

  function pad(n){ return n.toString().padStart(2,'0'); }

  function buildICS(data){
    const start = new Date(data.datetime);
    const end = new Date(start.getTime() + 90*60000);
    function toICSDate(d){
      const yyyy = d.getUTCFullYear();
      const mm = pad(d.getUTCMonth()+1);
      const dd = pad(d.getUTCDate());
      const hh = pad(d.getUTCHours());
      const mi = pad(d.getUTCMinutes());
      const ss = pad(d.getUTCSeconds());
      return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
    }
    const uid = crypto.randomUUID ? crypto.randomUUID() : Date.now();

    const summary = `Honestech Mobile Mechanic — ${data.service}`;
    const descLines = [
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Vehicle: ${data.vehicle}`,
      `Address: ${data.address}`,
      `Notes: ${data.notes || ''}`,
      ``,
      `Labor: $100/hr`,
      `Customer supplies parts.`
    ];
    const description = descLines.join('\\n');

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Honestech//Booking//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${toICSDate(new Date())}`,
      `DTSTART:${toICSDate(start)}`,
      `DTEND:${toICSDate(end)}`,
      `SUMMARY:${summary}`,
      `LOCATION:${data.address}`,
      `DESCRIPTION:${description.replace(/\n/g,'\\n')}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\\r\\n');

    return ics;
  }

  function buildGoogleCalURL(data){
    const start = new Date(data.datetime);
    const end = new Date(start.getTime() + 90*60000);
    function fmt(d){
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth()+1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      const ss = pad(d.getSeconds());
      return `${yyyy}${mm}${dd}T${hh}${mi}${ss}`;
    }
    const text = `Honestech Mobile Mechanic — ${data.service}`;
    const details = `Name: ${data.name}%0A`+
                    `Phone: ${data.phone}%0A`+
                    `Email: ${data.email}%0A`+
                    `Vehicle: ${data.vehicle}%0A`+
                    `Address: ${data.address}%0A`+
                    `Notes: ${encodeURIComponent(data.notes || '')}%0A%0A`+
                    `Labor: $100/hr — customer supplies parts.`;
    const location = encodeURIComponent(data.address);
    return `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(text)}`+
           `&dates=${fmt(start)}/${fmt(end)}`+
           `&details=${details}`+
           `&location=${location}`;
  }

  function buildMailto(data){
    const subject = `Appointment Request — ${data.service} — ${data.name}`;
    const lines = [
      `Service: ${data.service}`,
      `Date: ${data.date} at ${data.time}`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Vehicle: ${data.vehicle}`,
      `Address: ${data.address}`,
      `Notes: ${data.notes || ''}`
    ];
    const body = encodeURIComponent(lines.join('\\n'));
    return `mailto:honestechservice@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  }

  async function postServerless(payload){
    if(!ENABLE_SERVERLESS){
      statusEl.textContent = "Tip: add an endpoint to enable direct submissions.";
      return { ok:false, skipped:true };
    }
    statusEl.textContent = "Submitting…";
    try{
      const r = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "New Honestech Booking",
          _captcha: "false",
          service: payload.service,
          date: payload.date,
          time: payload.time,
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          vehicle: payload.vehicle,
          address: payload.address,
          notes: payload.notes || ""
        })
      });
      if(r.ok){
        statusEl.textContent = "Submitted! Check your email for the request.";
        return { ok:true };
      } else {
        const t = await r.text();
        statusEl.textContent = "Submission error — email draft provided below.";
        console.error("Submit error", t);
        return { ok:false };
      }
    }catch(err){
      statusEl.textContent = "Network error — email draft provided below.";
      console.error(err);
      return { ok:false };
    }
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    // Basic validation
    let ok = true;
    if(!validate()) ok = false;
    if(!ok) return;

    const data = Object.fromEntries(new FormData(form).entries());
    const [h,m] = data.time.split(':').map(Number);
    const d = new Date(data.date + 'T00:00');
    d.setHours(h, m || 0, 0, 0);
    data.datetime = d;

    // Build ICS blob
    const ics = buildICS(data);
    const blob = new Blob([ics], {type:'text/calendar;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    dlIcs.href = url;
    dlIcs.download = `Honestech_${data.date}_${data.time.replace(':','')}.ics`;

    // Google Calendar link
    googleCal.href = buildGoogleCalURL(data);

    // Mailto backup
    mailto.href = buildMailto(data);

    // Persist locally
    const key = 'honestech_appointments';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...data,
    });
    localStorage.setItem(key, JSON.stringify(existing));

    // Serverless submission
    const payload = {
      service: data.service,
      date: data.date,
      time: data.time,
      name: data.name,
      phone: data.phone,
      email: data.email,
      vehicle: data.vehicle,
      address: data.address,
      notes: data.notes || ''
    };
    await postServerless(payload);

    resultBox.hidden = false;
    resultBox.scrollIntoView({behavior:'smooth'});
  });
})();