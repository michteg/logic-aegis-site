/* Logic Aegis — comportements communs à toutes les pages (refonte 2026-10). */
(function(){
'use strict';
const doc=document.documentElement;
doc.classList.add('js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const EN=doc.lang==='en',t=(fr,en)=>EN?en:fr,base=EN?'/en':'';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

/* Adresse du service qui reçoit le formulaire (Formspree, fonction serverless…).
   Vide : le formulaire prépare un email complet et propose de le copier. */
const FORM_ENDPOINT='';

/* ---------- Langue ---------- */
$$('[data-lang]').forEach(a=>a.addEventListener('click',()=>{try{localStorage.setItem('la-lang',a.dataset.lang)}catch(e){}}));

/* ---------- Anciennes ancres de la page unique ---------- */
const legacy={signature:'/signature/','offres-signature':'/signature/#offres',plateformes:'/plateformes/',realisations:'/realisations/',temoignages:'/realisations/#recommandations',apropos:'/a-propos/',methode:'/expertises/#methode',expertises:'/expertises/',secteurs:'/expertises/#secteurs',souverainete:'/#souverainete',contact:'/contact/'};
if(doc.dataset.page==='accueil'){const h=location.hash.slice(1);if(legacy[h]&&legacy[h]!=='/#'+h)location.replace(base+legacy[h])}

/* ---------- Menu mobile ---------- */
const menu=$('.menu'),nav=$('#navigation');
if(menu&&nav){
 const set=o=>{nav.classList.toggle('open',o);menu.setAttribute('aria-expanded',String(o));menu.setAttribute('aria-label',o?t('Fermer le menu','Close menu'):t('Ouvrir le menu','Open menu'));$('use',menu).setAttribute('href',o?'#i-x':'#i-menu')};
 menu.addEventListener('click',()=>set(!nav.classList.contains('open')));
 $$('a',nav).forEach(a=>a.addEventListener('click',()=>set(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){set(false);menu.focus()}});
 matchMedia('(min-width: 961px)').addEventListener('change',e=>{if(e.matches)set(false)});
}

/* ---------- Apparitions ----------
   Seuls les blocs encore sous l'écran au chargement sont préparés ; ils apparaissent
   juste avant d'entrer dans l'écran. Arrivée par une ancre : tout est visible tout de suite. */
const blocks=$$('[data-reveal]');
if(!reduced.matches&&!location.hash&&document.visibilityState==='visible'&&'IntersectionObserver' in window){
 const fold=innerHeight*.92;
 blocks.forEach(el=>{if(el.getBoundingClientRect().top>fold)el.classList.add('pre')});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px 12% 0px'});
 $$('.pre').forEach(el=>{
  const group=el.parentElement&&el.parentElement.closest('[data-stagger]');
  if(group){const i=$$(':scope > [data-reveal]',el.parentElement).indexOf(el);el.style.setProperty('--d',Math.min(i,5)*45+'ms')}
  io.observe(el)});
 addEventListener('hashchange',()=>$$('.pre').forEach(el=>el.classList.add('in')));
}

/* ---------- Globes ---------- */
if(window.LAGlobe){
 const G=window.LAGlobe,heroCanvas=$('#globe'),miniCanvas=$('#mini');
 const globes=[];
 if(heroCanvas)globes.push(G.makeGlobe(heroCanvas,{start:-.3,speed:.09,tilt:.18,rw:.40,rh:.38,cx:.49,dot:1,orbit:true,arcs:G.offices.slice(1),lift:.18,projects:false}));
 if(miniCanvas)globes.push(G.makeGlobe(miniCanvas,{start:-.45,speed:.06,tilt:.1,rw:.44,rh:.44,cx:.5,dot:1.15,orbit:false,arcs:G.projects,lift:.22,projects:true}));
 const toggle=$('#motion'),orb=$('.orb');
 const sync=()=>{if(!toggle||!globes[0])return;const p=globes[0].st.paused;toggle.querySelector('span').textContent=p?t('Animer le globe','Animate the globe'):t('Mettre le globe en pause','Pause the globe');$('use',toggle).setAttribute('href',p?'#i-play':'#i-pause');toggle.setAttribute('aria-pressed',String(p));orb&&orb.classList.toggle('paused',p)};
 if(toggle)toggle.addEventListener('click',()=>{const p=!globes[0].st.paused;globes.forEach(g=>g.st.paused=p);sync()});
 reduced.addEventListener('change',e=>{globes.forEach(g=>g.st.paused=e.matches);sync()});
 sync();
}

/* ---------- Démonstration de signature ---------- */
const sig=$('#sigdemo');
if(sig){
 if('IntersectionObserver' in window)new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){sig.classList.add('play');o.disconnect()}},{threshold:.45}).observe(sig);else sig.classList.add('play');
 const rb=$('#replay');rb&&rb.addEventListener('click',()=>{sig.classList.remove('play');void sig.offsetWidth;sig.classList.add('play')});
}

/* ---------- Maquettes animées : seulement quand elles sont visibles ---------- */
$$('.pscreen').forEach(s=>{if(reduced.matches)return;new IntersectionObserver(es=>s.classList.toggle('live',es[0].isIntersecting),{threshold:.2}).observe(s)});

/* ---------- Sous-navigation des plateformes ---------- */
const sub=$$('.subnav a');
if(sub.length){
 const secs=sub.map(a=>$(a.getAttribute('href')));
 const spy=()=>{let cur=0;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=i});sub.forEach((a,i)=>a.setAttribute('aria-current',String(i===cur)))};
 addEventListener('scroll',spy,{passive:true});spy();
}

/* ---------- Filtres des réalisations ---------- */
const fb=$$('[data-filter]');
fb.forEach(b=>b.addEventListener('click',()=>{
 fb.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 const f=b.dataset.filter;let n=0;
 $$('.case').forEach(c=>{const show=f==='all'||c.dataset.cat.split(' ').includes(f);c.hidden=!show;if(show){n++;c.classList.add('in')}});
 const live=$('#cases-count');if(live)live.textContent=n+(EN?(n>1?' projects shown':' project shown'):(n>1?' réalisations affichées':' réalisation affichée'));
}));

/* ---------- Formulaire de contact ---------- */
const form=$('#leadform');
if(form){
 const need=$('#f-need'),params=new URLSearchParams(location.search),pre=params.get('besoin');
 if(pre&&need&&[...need.options].some(o=>o.value===pre))need.value=pre;
 const status=$('#form-status'),done=$('#form-done'),btn=$('button[type=submit]',form);
 const rules={name:v=>v.trim().length>1||t('Indiquez votre nom et votre prénom.','Enter your full name.'),org:v=>v.trim().length>1||t('Indiquez le nom de votre organisation.','Enter the name of your organisation.'),email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())||t('Saisissez une adresse email valide, par exemple nom@organisation.gov.rw.','Enter a valid email address, for example name@organisation.gov.rw.'),message:v=>v.trim().length>9||t('Décrivez votre besoin en quelques mots (10 caractères minimum).','Describe your need in a few words (at least 10 characters).')};
 const check=el=>{const r=rules[el.name];if(!r)return true;const res=r(el.value);const f=el.closest('.field');const ok=res===true;f.classList.toggle('invalid',!ok);el.setAttribute('aria-invalid',String(!ok));if(!ok)$('.err span',f).textContent=res;return ok};
 $$('input,textarea',form).forEach(el=>{el.addEventListener('blur',()=>{if(el.value)check(el)});el.addEventListener('input',()=>{if(el.closest('.field')?.classList.contains('invalid'))check(el)})});
 const showStatus=(msg)=>{status.className='form-status error show';$('span',status).textContent=msg};
 const compose=d=>EN?`Name: ${d.name}\nOrganisation: ${d.org}\nEmail: ${d.email}\nCountry: ${d.country||'not specified'}\nNeed: ${d.need}\n\n${d.message}`:`Nom : ${d.name}\nOrganisation : ${d.org}\nEmail : ${d.email}\nPays : ${d.country||'non précisé'}\nBesoin : ${d.need}\n\n${d.message}`;
 const subject=d=>t('Demande de cadrage — ','Scoping request — ')+d.need;
 const finish=(d,sent)=>{
  form.hidden=true;done.classList.add('show');
  $('#done-title').textContent=sent?t('Demande envoyée.','Request sent.'):t('Votre demande est prête.','Your request is ready.');
  $('#done-text').textContent=sent?t('Merci. Un expert de Logic Aegis vous recontacte à l’adresse '+d.email+' pour un premier échange de cadrage.','Thank you. A Logic Aegis expert will contact you at '+d.email+' for an initial scoping discussion.'):t('Envoyez-la depuis votre messagerie à info@logicaegis.com : copiez le texte ci-dessous ou ouvrez directement un email prérempli.','Send it from your email app to info@logicaegis.com: copy the text below or open a pre-filled email directly.');
  const body=compose(d);$('#done-body').textContent=body;$('#done-body').hidden=sent;$('#done-actions').hidden=sent;
  $('#done-mail').href='mailto:info@logicaegis.com?subject='+encodeURIComponent(subject(d))+'&body='+encodeURIComponent(body);
  $('#done-title').focus();
 };
 const copy=$('#done-copy');
 copy&&copy.addEventListener('click',async()=>{const t=$('#done-body').textContent;let ok=false;try{await navigator.clipboard.writeText(t);ok=true}catch(e){const r=document.createRange();r.selectNodeContents($('#done-body'));const s=getSelection();s.removeAllRanges();s.addRange(r);ok=document.execCommand&&document.execCommand('copy')}$('span',copy).textContent=ok?t('Texte copié','Text copied'):t('Sélectionnez le texte puis copiez-le','Select the text, then copy it')});
 $('#done-again')&&$('#done-again').addEventListener('click',()=>{done.classList.remove('show');form.hidden=false;form.reset();$('#f-name').focus()});
 form.addEventListener('submit',async e=>{
  e.preventDefault();status.className='form-status';
  if(form.website&&form.website.value)return;
  const fields=$$('input:not(.hp input),textarea',form).filter(el=>rules[el.name]);
  const bad=fields.filter(el=>!check(el));
  if(bad.length){bad[0].focus();showStatus(bad.length>1?bad.length+t(' champs sont à compléter avant l’envoi.',' fields need completing before sending.'):t('Un champ est à compléter avant l’envoi.','One field needs completing before sending.'));return}
  const d=Object.fromEntries(new FormData(form));delete d.website;
  if(!FORM_ENDPOINT){finish(d,false);return}
  form.classList.add('sending');btn.disabled=true;$('.label',btn).textContent=t('Envoi en cours…','Sending…');
  try{
   const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({...d,_subject:subject(d)})});
   if(!r.ok)throw new Error(r.status);
   finish(d,true);
  }catch(err){
   showStatus(t('L’envoi n’a pas abouti. Vérifiez votre connexion puis réessayez, ou écrivez-nous à info@logicaegis.com.','Your request could not be sent. Check your connection and try again, or email us at info@logicaegis.com.'));
  }finally{form.classList.remove('sending');btn.disabled=false;$('.label',btn).textContent=t('Envoyer ma demande','Send my request')}
 });
}
})();
