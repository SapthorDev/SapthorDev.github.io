(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const examples = {
    market: {id:'024', title:'Research 10 competitors and build a positioning brief', context:'B2B productivity tools · North America · public sources only', scope:'Compare positioning, pricing and audience across 10 productivity tools. Build a concise brief with traceable evidence.', plan:['Review 10 product and pricing pages','Map audience, value proposition and feature overlap','Draft three positioning opportunities with evidence'], sources:[['Notion / product','https://www.notion.com/product'],['Asana / pricing','https://asana.com/pricing'],['Linear / features','https://linear.app/features']], counts:[0,0,12,20,20], insight:'A clearer opportunity: sell the handoff, not another workspace.', summary:'The sample landscape clusters around collaboration and task tracking. A stronger position emphasizes completing cross-tool work with visible checkpoints.', findings:['10 competitors mapped across 4 categories','3 positioning opportunities identified','Recommendation: lead with visible execution'], report:'Positioning brief', action:'Share the positioning brief with the strategy team?'},
    content: {id:'025', title:'Turn a launch brief into a two-week content plan', context:'Product launch · LinkedIn, newsletter & blog · supplied brand voice', scope:'Adapt one editorial brief into a coordinated plan for three channels. Keep every asset in draft until a human reviews it.', plan:['Read the brief and confirm tone constraints','Map three themes to channel-specific formats','Draft a two-week calendar and review checklist'], sources:[['Editorial brief / sample',null],['Brand voice guide / sample',null],['Channel performance / sample',null]], counts:[0,0,3,3,3], insight:'One launch story. Three ways to make it useful.', summary:'Use the blog to explain the problem, the newsletter to connect it to customer needs and LinkedIn to start a focused conversation.', findings:['9 draft assets across 3 channels','2 weeks of coordinated publishing slots','All copy remains unpublished'], report:'Launch content plan', action:'Share the draft calendar with the editorial team?'},
    intel: {id:'026', title:'Review competitor changes and prioritize the signals', context:'5 tracked competitors · weekly snapshot · public pages only', scope:'Compare sample weekly snapshots for five competitors. Separate meaningful changes from cosmetic updates and cite each finding.', plan:['Compare pricing, product and changelog snapshots','Score six changes by customer and market impact','Prepare a prioritized watchlist with source notes'], sources:[['Linear / changelog','https://linear.app/changelog'],['Notion / releases','https://www.notion.com/releases'],['Asana / product','https://asana.com/product']], counts:[0,0,8,15,15], insight:'Six changes. Two worth a conversation.', summary:'Prioritize the sample packaging change and new enterprise feature. Keep minor interface updates on the watchlist until stronger evidence appears.', findings:['5 competitors compared','6 signals grouped by impact','2 high-priority items flagged for review'], report:'Weekly intelligence brief', action:'Share the watchlist with the product team?'}
  };
  const steps = ['Understand','Plan','Execute','Review','Result'];
  const railNames = ['Request','Plan','Browser','Analysis','Report'];
  const railText = ['Define the outcome, audience and boundaries. Relay confirms what success looks like before it starts.','A scoped sequence of actions, with permissions and review points established before execution.','Read public pages and collect a source trail. Every finding has a place to return to.','Compare the evidence, surface patterns and separate observations from recommendations.','Receive a concise deliverable, linked evidence and a record of the decisions made along the way.'];
  let current = 'market', stage = -1, running = false, timer = null, decision = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function announce(message) { $('announcement').textContent = message; }
  function selectRail(index) {
    document.querySelectorAll('[data-rail]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.rail) === index)));
    $('rail-label').textContent = `0${index + 1} / ${railNames[index].toUpperCase()}`;
    $('rail-copy').textContent = railText[index];
  }
  function render() {
    const data = examples[current];
    const percent = stage < 0 ? 0 : [8,24,67,88,100][stage];
    $('task-id').textContent = `TASK / RLY-${data.id}`;
    $('task-title').textContent = data.title;
    $('context').textContent = data.context;
    $('percent').textContent = `${percent}%`;
    $('fill').style.width = `${percent}%`;
    document.querySelector('[role=progressbar]').setAttribute('aria-valuenow', String(percent));
    $('progress-label').textContent = stage < 0 ? 'A clear goal. A visible plan.' : ['Confirming the outcome','Building a scoped plan','Collecting and comparing evidence','Waiting for your decision','Deliverable ready'][stage];
    $('state').textContent = stage < 0 ? 'Ready to run' : stage === 3 ? '1 approval pending' : stage === 4 ? 'Report ready' : running ? 'Running' : 'Paused';
    document.querySelectorAll('.stages li').forEach((item, index) => {
      item.classList.toggle('active',index === stage);
      item.classList.toggle('done',index < stage);
      if (index === stage) item.setAttribute('aria-current','step'); else item.removeAttribute('aria-current');
    });
    // All template content below is authored local demo data, never user input.
    const panel = $('panel');
    if (stage < 0) panel.innerHTML = `<h3>A brief, not another pile of tabs.</h3><p>${data.scope}</p><ul><li>Public or supplied sample sources only</li><li>Review before sharing anything</li></ul>`;
    else if (stage === 0) panel.innerHTML = `<h3>01 / Outcome understood</h3><p>${data.scope}</p><ul><li>Deliverable: ${data.report}</li><li>Boundary: no publishing, purchases or account access</li></ul>`;
    else if (stage === 1) panel.innerHTML = `<h3>02 / Here’s the plan</h3><ul>${data.plan.map(item => `<li>${item}</li>`).join('')}</ul>`;
    else if (stage === 2) panel.innerHTML = `<h3>03 / Connecting the evidence</h3><p>${data.counts[2]} sources reviewed. Comparing findings against the task scope and preparing a draft.</p><ul><li>Sources attached to the evidence trail</li><li>Observations separated from recommendations</li></ul>`;
    else if (stage === 3) panel.innerHTML = `<h3>04 / Your call before the handoff</h3><p>${data.action} This is a simulated approval. No message or file will be sent.</p><div class="approval-actions"><button class="primary" id="approve">Approve demo share ↗</button><button id="private">Keep private</button></div>`;
    else panel.innerHTML = `<p class="result-label">${data.report.toUpperCase()} / READY</p><h3>${data.insight}</h3><p>${data.summary}</p><ul>${data.findings.map(item => `<li>${item}</li>`).join('')}</ul><p class="decision-note">${decision === 'approved' ? 'Demo share approved · no external action performed.' : 'Kept private · result stays in this workspace.'}</p>`;
    $('count').textContent = `${stage < 0 ? 0 : data.counts[stage]} sources reviewed · sample data`;
    $('sources').replaceChildren();
    if (stage >= 2) data.sources.forEach(([label,url]) => {
      const item = document.createElement(url ? 'a' : 'p');
      item.textContent = label + (url ? ' ↗' : '');
      if (url) { item.href = url; item.target = '_blank'; item.rel = 'noopener noreferrer'; }
      $('sources').append(item);
    });
    else { const item = document.createElement('p'); item.textContent = 'Evidence appears as the task runs.'; $('sources').append(item); }
    const events = ['Task scope confirmed','Plan and permissions set',`${data.counts[2]} sources compared`,'Draft ready · approval requested',decision === 'approved' ? 'Demo share approved · report ready' : 'Private report ready'];
    $('activity').replaceChildren();
    if (stage < 0) { const item = document.createElement('li'); item.textContent = 'Waiting for your request'; $('activity').append(item); }
    else events.slice(0,stage + 1).forEach((event,index) => {
      const item = document.createElement('li'); item.textContent = event;
      const sub = document.createElement('small'); sub.textContent = index === 4 ? 'Decision recorded' : `Step 0${index + 1} · ${index === 3 ? 'Human checkpoint' : 'Demo activity'}`;
      item.append(sub); $('activity').append(item);
    });
    $('run').disabled = stage === 3;
    $('run').textContent = stage === 4 ? 'Run again ↗' : running ? 'Pause task Ⅱ' : stage >= 0 ? 'Resume task ↗' : 'Run sample task ↗';
    $('run-note').textContent = stage === 3 ? 'Your decision is required' : stage === 4 ? 'Completed · illustrative result' : running ? 'Running in this browser only' : 'About 9 seconds + your review';
    document.querySelectorAll('[data-case]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.case === current)));
    selectRail(Math.max(0,stage));
    panel.querySelector('#approve')?.addEventListener('click', () => finish('approved'));
    panel.querySelector('#private')?.addEventListener('click', () => finish('private'));
  }
  function schedule() {
    clearTimeout(timer);
    if (!running || stage >= 3) return;
    timer = setTimeout(() => { stage++; if (stage === 3) running = false; render(); announce(`${steps[stage]}. ${stage === 3 ? 'Choose approve demo share or keep private to complete the task.' : $('progress-label').textContent}`); schedule(); },3000);
  }
  function reset() { clearTimeout(timer); timer = null; stage = -1; running = false; decision = null; render(); }
  function run() {
    if (stage === 3) return;
    if (stage === 4) reset();
    running = !running;
    if (stage < 0) stage = 0;
    render(); announce(running ? `${steps[stage]}. Task running.` : 'Task paused.'); schedule();
  }
  function finish(choice) { decision = choice; stage = 4; running = false; clearTimeout(timer); render(); announce(`Result ready. ${choice === 'approved' ? 'Demo share approved.' : 'Result kept private.'}`); $('run').focus({preventScroll:true}); }
  function showWorkspace() { $('workspace').scrollIntoView({behavior:reducedMotion.matches ? 'instant' : 'smooth',block:'start'}); }
  $('run').addEventListener('click',run);
  $('reset').addEventListener('click',() => { reset(); announce('Demo reset. Ready to run.'); });
  document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click',() => { current = button.dataset.case; reset(); announce(`${examples[current].title}. Ready to run.`); if (button.closest('.use-grid')) { showWorkspace(); $('run').focus({preventScroll:true}); } }));
  document.querySelectorAll('[data-rail]').forEach(button => button.addEventListener('click',() => selectRail(Number(button.dataset.rail))));
  document.querySelectorAll('[data-start]').forEach(button => button.addEventListener('click',() => { reset(); showWorkspace(); $('run').focus({preventScroll:true}); }));
  document.querySelectorAll('[data-watch]').forEach(button => button.addEventListener('click',() => { reset(); showWorkspace(); run(); $('run').focus({preventScroll:true}); }));
  render();
})();
