// Approved targeted refinements only: nav order, editable RTI draft,
// "I need more information" -> RTI drafting, and optional live retrieval integration.

// 1) Navigation order only: Ask Jankar | My RTIs | First Appeal | Know About RTI
nav=function(active=''){
  return `<nav>
    <button class="${active==='Ask Jankar'?'active':''}" onclick="s.page='ask';render()">Ask Jankar</button>
    <button class="${active==='My RTIs'?'active':''}" onclick="openMyRtis()">My RTIs</button>
    <button class="${active==='First Appeal'?'active':''}" onclick="openAppeal()">First Appeal</button>
    <button class="${active==='Know About RTI'?'active':''}" onclick="s.page='guide';render()">Know About RTI</button>
  </nav>`;
};

// 2) If public information is available but the citizen needs deeper records,
// move directly into RTI drafting instead of opening the follow-up conversation.
needMore=function(){
  if(!s.result)return alert('Search for the information first.');
  const r=s.result.route||{};
  if(r.jurisdiction==='UNKNOWN')return alert('Jankar needs a clearer subject before preparing the RTI.');
  s.authority=r.authority||'Relevant Public Authority';
  s.jurisdiction=r.jurisdiction||'UNKNOWN';
  const publicContext=s.result.info?.answer||'';
  s.draft=`Request for Information under the Right to Information Act, 2005\n\nTo,\nThe Public Information Officer\n${s.authority}\n\nSubject: Request for additional official records relating to ${s.query}\n\nRespected Sir/Madam,\n\nI seek information/records under the Right to Information Act, 2005 in relation to the following subject:\n\n${s.query}\n\nPublic information already located:\n${publicContext}\n\nI require the following additional records/information that are not sufficiently available in the public information reviewed:\n\n1. Please provide the detailed official records, statements, sanction orders, work/project records or other documents relevant to the above subject.\n2. Please provide the information for the relevant requested financial/time period.\n3. Where expenditure or project data is involved, please provide the available project-wise/work-wise or authority-maintained breakup, including sanctioned amount, expenditure incurred, status and related record references, where held.\n4. Where records are maintained electronically, kindly provide them in electronic form where permissible.\n\nApplicant Details\nName: Tasmayee\nMobile: +91 98765 43210\nSubject Location: ${s.subjectLoc||'As applicable'}\n\nDate: 27 August 2026`;
  requireLogin('review');
};

// Keep draft edits in application state so payment/BPL interactions do not discard them.
function saveRtiDraftEdit(value){s.draft=value;}

// 3) Same existing review/payment/BPL/attachment layout, but the RTI draft is editable.
review=function(){
  const isBpl=s.bplChoice==='yes';
  const bplReady=isBpl&&s.bplVerified;
  const canSubmit=isBpl?bplReady:s.paymentDone;

  const bpl=`<div class="filing-addon"><h3>BPL Fee Waiver</h3><p class="addon-help">Applicants holding a valid BPL card can use the fee-waiver flow.</p><label>Do you hold a valid BPL card?</label><div class="inline-options"><label><input type="radio" name="bplChoice" value="no" ${!isBpl?'checked':''} onchange="setBplChoice(this.value)"> No</label><label><input type="radio" name="bplChoice" value="yes" ${isBpl?'checked':''} onchange="setBplChoice(this.value)"> Yes</label></div>${isBpl?`<div class="bpl-verify-row"><div><label>BPL Card Number</label><input id="bplCard" value="${e(s.bplCard)}" placeholder="e.g. BPL-MH-2026-001"></div><button type="button" class="outline" onclick="verifyBpl()">Verify</button></div>${s.bplVerified?'<div class="notice success">✓ Fee waived — BPL applicant (as per RTI Act)</div>':''}${s.bplError?`<div class="notice danger">${e(s.bplError)}</div>`:''}`:''}</div>`;

  const attachment=`<div class="filing-addon"><h3>Attach Supporting Documents <span class="optional-label">Optional</span></h3><p class="addon-help">PDF only • Maximum 1 MB</p>${s.rtiAttachment?`<div class="file-chip"><div><b>${e(s.rtiAttachment.name)}</b><small>PDF • ${formatFileSize(s.rtiAttachment.size)} • Ready</small></div><button type="button" class="ghost" onclick="removeRtiAttachment()">Remove</button></div>`:`<label class="upload-box"><span>Choose supporting PDF</span><small>This attachment is optional.</small><input type="file" accept=".pdf,application/pdf" onchange="handleRtiAttachment(this)"></label>`}${s.rtiAttachmentError?`<div class="notice danger">${e(s.rtiAttachmentError)}</div>`:''}</div>`;

  const payment=bplReady?`<h3>RTI Filing Fee</h3><div class="fee-breakdown"><div><span>Original Fee</span><b>₹10.00</b></div><div><span>BPL Waiver</span><b>-₹10.00</b></div><div class="fee-total"><span>Final Amount</span><b>₹0.00</b></div></div><div class="notice success">Fee waived — BPL applicant (as per RTI Act). No payment is required.</div>`:`<h3>RTI Filing Fee (Demo)</h3><div class="fee">₹10.00</div><label>Choose Payment Method (Demo)</label><div class="pay-options"><label><input type="radio" name="pay" checked> UPI (Demo)</label><label><input type="radio" name="pay"> Card (Demo)</label><label><input type="radio" name="pay"> Net Banking (Demo)</label></div><button onclick="demoPay()">Proceed to Demo Payment →</button><div id="paystate">${s.paymentDone?'<div class="notice success">✓ Demo payment successful. You may now approve and submit the demo RTI.</div>':''}</div>`;

  return shell(`<main class="content wide"><div class="page-head"><h1>File RTI</h1></div><section class="filing-grid"><div class="document-panel"><div class="stepper"><span class="done">✓ Details</span><span class="done">✓ Draft</span><span class="active">3 Review</span><span>4 Fee / Waiver</span><span>5 Submit</span></div><div class="notice saffron-box">AI-assisted draft — review and edit any detail before submission.</div><div class="rti-document"><label for="draftText"><b>Review and edit your RTI</b></label><textarea id="draftText" class="rti-draft-editor" oninput="saveRtiDraftEdit(this.value)">${e(s.draft)}</textarea></div></div><aside class="payment-card">${bpl}${attachment}<div class="payment-divider"></div><h2>${bplReady?'Fee Waiver':'Demo Payment Gateway'}</h2><div class="notice info">Hackathon demo only. No real payment will be processed.</div>${payment}<button id="submitBtn" class="success-btn" ${canSubmit?'':'disabled'} onclick="submitDemo()">Approve & Submit Demo RTI</button></aside></section></main>`);
};

// 4) Optional live-government retrieval adapter.
// A static RawGitHack page cannot securely crawl arbitrary government sites itself.
// When a Jankar backend is configured, Ask Jankar uses it. If unavailable, the
// existing safe government-only prototype result remains as the fallback.
const _prototypeSearchGov=searchGov;
window.JANKAR_API_URL=window.JANKAR_API_URL||'';

function normalizeLiveSource(x){
  return {
    title:x.title||'Official Government Source',
    org:x.organization||x.org||'Government of India / State Government',
    domain:x.domain||'',
    url:x.url||'#',
    level:x.government_level||x.level||''
  };
}

searchGov=async function(){
  const q=(document.getElementById('aq')?.value||s.query||'').trim();
  if(q.length<5)return alert('Please enter a clearer question.');
  s.query=q;
  const detected=extractSubjectLocation(q);
  s.subjectLoc=document.getElementById('sloc')?.value.trim()||detected;

  if(!window.JANKAR_API_URL){
    return _prototypeSearchGov();
  }

  try{
    const res=await fetch(`${window.JANKAR_API_URL.replace(/\/$/,'')}/api/ask-jankar`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({question:s.query,subject_location:s.subjectLoc||null})
    });
    if(!res.ok)throw new Error(`Live retrieval failed (${res.status})`);
    const data=await res.json();
    if(!data||!data.answer)throw new Error('No grounded answer returned');

    s.subjectLoc=data.subject_location||s.subjectLoc||'';
    s.result={
      route:{
        jurisdiction:data.jurisdiction||'UNKNOWN',
        authority:data.authority||'Relevant Public Authority',
        reason:data.routing_reason||'Selected from the government sources retrieved for this question.',
        confidence:data.confidence||'Medium',
        routeUrl:data.rti_portal_url||'',
        routeLabel:data.rti_portal_label||'Official RTI route'
      },
      info:{
        found:Boolean(data.found),
        headline:'What we found',
        answer:data.answer,
        points:Array.isArray(data.key_points)?data.key_points:[],
        data:Array.isArray(data.structured_data)?data.structured_data:null,
        sources:(data.sources||[]).map(normalizeLiveSource)
      }
    };
    render();
  }catch(err){
    console.warn('Jankar live retrieval unavailable; using safe prototype fallback.',err);
    _prototypeSearchGov();
  }
};

render();
