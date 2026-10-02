(() => {
  'use strict';

  const workspace = document.querySelector('.workspace');
  const state = document.getElementById('state');
  const percent = document.getElementById('percent');
  const watch = document.querySelector('[data-watch]');
  let autoWatch = false;
  let approvalTimer = null;

  function syncPhase(){
    if(!workspace || !state) return;
    const label = state.textContent.trim().toLowerCase();
    let phase = 'idle';
    if(label.includes('approval')) phase = 'approval';
    else if(label.includes('report ready')) phase = 'result';
    else if(label.includes('running')) phase = 'running';
    else if(label.includes('paused')) phase = 'paused';
    workspace.dataset.phase = phase;

    if(autoWatch && phase === 'approval'){
      clearTimeout(approvalTimer);
      approvalTimer = setTimeout(() => {
        const approve = document.getElementById('approve');
        if(approve) approve.click();
      }, 850);
    }

    if(phase === 'result') autoWatch = false;
  }

  const observer = new MutationObserver(syncPhase);
  if(state) observer.observe(state,{childList:true,subtree:true,characterData:true});
  if(percent) observer.observe(percent,{childList:true,subtree:true,characterData:true});

  watch?.addEventListener('click',() => {
    autoWatch = true;
    document.body.classList.add('relay-cinematic-run');
  });

  document.querySelectorAll('[data-start],#reset,[data-case]').forEach(el => {
    el.addEventListener('click',() => {
      if(!el.matches('[data-watch]')) autoWatch = false;
    });
  });

  syncPhase();
})();