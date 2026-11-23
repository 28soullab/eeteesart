/* Menu en accordéon : les rubriques jaunes se déplient au toucher */
(function(){
  var css=document.createElement('style');
  css.textContent=
    '.menu .sous .plis{display:none;flex-basis:100%;flex-wrap:wrap;justify-content:center;align-items:baseline;gap:.3rem .9rem;margin:.2rem 0 .3rem}'+
    '.menu .sous .plis.ouvert{display:flex;animation:plis .35s ease}'+
    '@keyframes plis{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}'+
    '.menu .sous .rub-lien,.menu .sous button.rub{font-weight:400!important}'+
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
