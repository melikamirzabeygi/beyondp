(function(){
  var nav=document.getElementById('nav');
  var home=document.body.classList.contains('home');
  function onScroll(){if(home)nav.classList.toggle('solid',window.scrollY>window.innerHeight*0.6)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // mobile menu
  var mb=document.getElementById('menubtn'),ml=document.getElementById('menu');
  if(mb&&ml){
    mb.addEventListener('click',function(){var o=ml.classList.toggle('open');mb.setAttribute('aria-expanded',o?'true':'false');mb.textContent=o?'Close':'Menu';if(o)nav.classList.add('solid');else onScroll()});
    ml.addEventListener('click',function(e){if(e.target.tagName==='A'){ml.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.textContent='Menu'}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ml.classList.contains('open')){ml.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.textContent='Menu';mb.focus()}});
  }

  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hero video
  var v=document.getElementById('bgv'),ctl=document.getElementById('vidctl');
  if(v&&ctl){
    var srcs=v.querySelectorAll('source');
    srcs[srcs.length-1].addEventListener('error',function(){v.style.display='none';ctl.style.display='none'});
    if(reduce){try{v.pause()}catch(e){};ctl.textContent='▶';ctl.setAttribute('aria-label','Play background video')}
    ctl.addEventListener('click',function(){
      if(v.paused){v.play().catch(function(){});ctl.textContent='❚❚';ctl.setAttribute('aria-label','Pause background video')}
      else{v.pause();ctl.textContent='▶';ctl.setAttribute('aria-label','Play background video')}
    });
  }

  // type moment
  var mom=document.getElementById('mom');
  if(mom){
    var spans=mom.querySelectorAll('span');
    if('IntersectionObserver' in window && !reduce){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){spans.forEach(function(s,i){setTimeout(function(){s.classList.add('on')},i*450)});io.disconnect()}})},{threshold:.5});
      io.observe(mom);
    } else spans.forEach(function(s){s.classList.add('on')});
  }

  // inquiry form (FormSubmit). Success is shown only when the service confirms delivery.
  var f=document.getElementById('f');
  if(f){
    var TO='melikamirzabeygi@gmail.com';
    var sel=document.getElementById('s');
    var q=new URLSearchParams(location.search).get('service');
    if(q&&sel){for(var i=0;i<sel.options.length;i++){if(sel.options[i].value===q){sel.selectedIndex=i}}}
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var o=document.getElementById('o'),btn=document.getElementById('sendbtn');
      var req=f.querySelectorAll('[required]');
      for(var k=0;k<req.length;k++){
        if(!req[k].value.trim()||!req[k].checkValidity()){
          req[k].focus();o.style.display='block';
          o.innerHTML='<span class="err">Please complete the field “'+(req[k].getAttribute('data-label')||'required')+'”.</span>';return;
        }
      }
      var val=function(id){var el=document.getElementById(id);return el?el.value.trim():''};
      var data={name:val('n'),email:val('em'),affiliation:val('aff')||'—',research_field:val('rf'),service:val('s'),research_stage:val('st'),deadline:val('d')||'flexible',budget:val('bud')||'—',project:val('b'),
        _subject:'New quote request – BeyondP ('+val('s')+')',_template:'table',_captcha:'false',_replyto:val('em')};
      if(document.getElementById('hp').value){return}
      btn.disabled=true;btn.textContent='Sending…';
      fetch('https://formsubmit.co/ajax/'+TO,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json()}).then(function(j){
        if(j&&(j.success===true||j.success==='true')){
          o.style.display='block';
          o.textContent='Thank you, '+data.name+'. Your request has been delivered. You will receive a written reply at '+data.email+' within 48 hours on working days.';
          f.reset();btn.textContent='Sent ✓';
        } else throw new Error('fail');
      }).catch(function(){
        var body='Name: '+data.name+'\nEmail: '+data.email+'\nAffiliation: '+data.affiliation+'\nResearch field: '+data.research_field+'\nService: '+data.service+'\nStage: '+data.research_stage+'\nDeadline: '+data.deadline+'\nBudget: '+data.budget+'\n\nProject:\n'+data.project;
        var href='mailto:'+TO+'?subject='+encodeURIComponent(data._subject)+'&body='+encodeURIComponent(body);
        o.style.display='block';
        o.innerHTML='Your request could not be delivered right now, so it has <b>not</b> been sent. <a href="'+href+'">Send it by email instead</a> or message us on <a href="https://t.me/melika_research_bot" target="_blank" rel="noopener">Telegram</a>.';
        btn.disabled=false;btn.innerHTML='Submit your project <span class="arr">→</span>';
      });
    });
  }
})();
