/* Menu en accordéon : le texte jaune mène à la page, la flèche déplie les sous-entrées */
(function(){
  var css=document.createElement('style');
  css.textContent=
    '.menu .sous .plis{display:none;flex-basis:100%;flex-wrap:wrap;justify-content:center;align-items:baseline;gap:.3rem .9rem;margin:.2rem 0 .3rem}'+
    '.menu .sous .plis.ouvert{display:flex;animation:plis .35s ease}'+
    '@keyframes plis{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}'+
    '.menu .sous .rub-ligne{flex-basis:100%;display:flex;justify-content:center;align-items:center;gap:.15rem;margin-top:.2rem}'+
    '.menu .sous button.rub{background:none;border:0;font-family:inherit;cursor:pointer;display:block;width:100%;text-align:center;padding:.3rem 0!important;margin-top:.2rem!important}'+
    '.menu .sous button.rub::after,.menu .sous button.fleche::after{content:"▾";font-size:.8em;display:inline-block;transition:transform .3s;margin-left:.3em}'+
    '.menu .sous button.fleche{background:none;border:0;cursor:pointer;padding:.3rem .4rem;margin:0}'+'.menu .sous .rub-ligne>a{width:auto!important;display:inline-block!important;flex:0 0 auto;margin:0!important}'+'.menu .sous button.fleche::after{margin-left:0}'+
    '.menu .sous button[aria-expanded="true"]::after{transform:rotate(180deg)}';
  document.head.appendChild(css);
  function bascule(b,plis){
    var ouvrir=!plis.classList.contains('ouvert');
    document.querySelectorAll('.menu .plis.ouvert').forEach(function(p){p.classList.remove('ouvert');p._b.setAttribute('aria-expanded','false')});
    if(ouvrir){plis.classList.add('ouvert');b.setAttribute('aria-expanded','true')}
  }
  document.querySelectorAll('.menu .sous').forEach(function(sous){
    Array.prototype.slice.call(sous.children).forEach(function(el){
      if(!(el.classList.contains('rub')||el.classList.contains('rub-lien')))return;
      var suite=[],n=el.nextElementSibling;
      while(n&&!n.classList.contains('rub')&&!n.classList.contains('rub-lien')){suite.push(n);n=n.nextElementSibling;}
      if(!suite.length)return;
      var plis=document.createElement('div');plis.className='plis';
      var lien=el.tagName==='A'&&el.getAttribute('href')&&el.getAttribute('href')!=='#';
      var b=document.createElement('button');b.type='button';b.setAttribute('aria-expanded','false');
      if(lien){
        var ligne=document.createElement('div');ligne.className='rub-ligne';
        b.className='fleche';b.setAttribute('aria-label','Déplier');
        el.replaceWith(ligne);ligne.appendChild(el);ligne.appendChild(b);ligne.after(plis);var cs=getComputedStyle(el);b.style.color=cs.color;b.style.fontSize=cs.fontSize;
      }else{
        b.className='rub';b.innerHTML=el.innerHTML;el.replaceWith(b);b.after(plis);
      }
      plis._b=b;
      suite.forEach(function(s){plis.appendChild(s)});
      b.addEventListener('click',function(){bascule(b,plis)});
    });
  });
})();
