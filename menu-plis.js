/* Menu en accordéon : les rubriques jaunes se déplient au toucher */
(function(){
  var css=document.createElement('style');
  css.textContent=
    '.menu .sous .plis{display:none;flex-basis:100%;flex-wrap:wrap;justify-content:center;align-items:baseline;gap:.3rem .9rem;margin:.2rem 0 .3rem}'+
    '.menu .sous .plis.ouvert{display:flex;animation:plis .35s ease}'+
    '@keyframes plis{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}'+
    '.menu .sous .rub-lien,.menu .sous button.rub{font-weight:400!important}'+
    '.menu a.accueil{font-family:var(--sans);font-size:.8rem!important;letter-spacing:.32em;text-transform:uppercase;opacity:.75;margin-bottom:.4rem}'+
    '.menu a.accueil::before{content:"\\2190  "}'+
    '.menu .sous button.rub{background:none;border:0;padding:0;font-family:inherit;cursor:pointer;display:block;width:100%;text-align:center;padding:.3rem 0!important;margin-top:.2rem!important}'+
    '.menu .sous button.rub::after{content:" ▾";font-size:.8em;display:inline-block;transition:transform .3s}'+
    '.menu .sous button.rub[aria-expanded="true"]::after{transform:rotate(180deg)}';
  document.head.appendChild(css);
  document.querySelectorAll('.menu .sous').forEach(function(sous){
    var enfants=Array.prototype.slice.call(sous.children),cur=null;
    enfants.forEach(function(el){
      var estRub=el.classList.contains('rub')||el.classList.contains('rub-lien');
      if(estRub){
        var suite=[],n=el.nextElementSibling;
        while(n&&!n.classList.contains('rub')&&!n.classList.contains('rub-lien')){suite.push(n);n=n.nextElementSibling;}
        if(!suite.length){cur=null;return;}
        var b=document.createElement('button');b.type='button';b.className='rub';b.innerHTML=el.innerHTML;b.setAttribute('aria-expanded','false');
        var plis=document.createElement('div');plis.className='plis';
        if(!sous.hasAttribute('data-sans-tout')&&el.tagName==='A'&&el.getAttribute('href')&&el.getAttribute('href')!=='#'){
          var tout=document.createElement('a');tout.className='ligne';tout.href=el.getAttribute('href');
          tout.innerHTML='<span lang="fr">Tout voir</span><span lang="en">View all</span>';plis.appendChild(tout);
        }
        el.replaceWith(b);b.after(plis);suite.forEach(function(s){plis.appendChild(s)});
        b.addEventListener('click',function(){
          var ouvrir=!plis.classList.contains('ouvert');
          document.querySelectorAll('.menu .plis.ouvert').forEach(function(p){p.classList.remove('ouvert');p.previousElementSibling.setAttribute('aria-expanded','false')});
          if(ouvrir){plis.classList.add('ouvert');b.setAttribute('aria-expanded','true')}
        });
      }
    });
  });
})();

/* Niveau 1 : les entrées blanches pulsent doucement ; un toucher révèle seulement leur section */
(function(){
  var css=document.createElement('style');
  css.textContent=
    '@keyframes lueur{0%,100%{opacity:.68;text-shadow:none}50%{opacity:1;text-shadow:0 0 16px rgba(255,255,255,.6)}}'+
    '.menu .groupe>.sous{display:none!important}'+
    '.menu .groupe>a.lien-direct{animation:lueur 4.5s ease-in-out infinite}'+
    '.menu .groupe>.titre-plis{animation:lueur 4.5s ease-in-out infinite;cursor:pointer}'+
    '.menu .groupe.ouvert>.titre-plis{animation:none;opacity:1}'+
    '.menu .groupe.ouvert>.sous{display:flex!important;animation:plis .5s ease}'+
    '.menu.revele{justify-content:flex-start!important;overflow-y:auto!important;padding-top:4.5rem!important;padding-bottom:3rem!important}';
  document.head.appendChild(css);
  var m=document.getElementById('menu');
  document.querySelectorAll('.menu .groupe').forEach(function(g){
    var t0=g.firstElementChild; if(!t0||!g.querySelector('.sous'))return;
    var t=t0.cloneNode(true); t0.replaceWith(t);
    t.classList.add('titre-plis'); t.setAttribute('role','button'); t.setAttribute('aria-expanded','false');
    t.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      var ouvrir=!g.classList.contains('ouvert');
      document.querySelectorAll('.menu .groupe.ouvert').forEach(function(x){x.classList.remove('ouvert');x.firstElementChild.setAttribute('aria-expanded','false')});
      if(ouvrir){g.classList.add('ouvert');t.setAttribute('aria-expanded','true')}
      if(m)m.classList.toggle('revele',ouvrir);
    });
  });
})();

/* Vagues du menu : légère ondulation à l'ouverture de chaque page */
(function(){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var paths=document.querySelectorAll('svg.vagues path');if(!paths.length)return;
  var orig=[],lignes=[4,11,18],D=2600,t0=null;
  paths.forEach(function(p){orig.push(p.getAttribute('d'))});
  function trace(ph,k){
    var d='';
    lignes.forEach(function(y0,i){
      var dec=ph-i*.8*Math.sin(Math.PI*k);
      for(var x=2;x<=30.01;x+=.5){
        var y=y0-1.5*Math.sin(2*Math.PI*(x-2)/14+dec);
        d+=(x===2?'M':'L')+x.toFixed(1)+' '+y.toFixed(2)+' ';
      }
    });
    return d;
  }
  function pas(t){
    if(t0===null)t0=t;
    var k=Math.min((t-t0)/D,1),e=1-Math.pow(1-k,3);
    var ph=-4*Math.PI*e; /* deux ondulations qui ralentissent */
    var d=trace(ph,k);
    paths.forEach(function(p){p.setAttribute('d',d)});
    if(k<1)requestAnimationFrame(pas);
    else paths.forEach(function(p,i){p.setAttribute('d',orig[i])});
  }
  requestAnimationFrame(pas);
})();

/* Retour à l'accueil : petit logo en haut à gauche sur les pages sans logo */
(function(){
  if(document.querySelector('.logo-page,.ouverture'))return;
  var css=document.createElement('style');
  css.textContent='.retour-accueil{position:fixed;top:.85rem;left:1rem;z-index:15;display:block;line-height:0;padding:.35rem .5rem;border-radius:999px;background:rgba(255,255,255,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}'+
    '.retour-accueil img{width:58px;height:auto}';
  document.head.appendChild(css);
  var a=document.createElement('a');a.className='retour-accueil';a.href='index.html';a.setAttribute('aria-label','Accueil');
  a.innerHTML='<img src="images/logo-mini.webp" alt="Eetee">';
  document.body.appendChild(a);
})();
