// Spreadsheet-approved refinements only. Loaded after patch.js.
// Scope: exact shared logo/brand, BPL, RTI attachment and First Appeal behavior only.

brand=function(){return `<div class="brand jankar-brand" onclick="s.page='landing';render()"><img src="${LOGO_DATA}" alt="Jankar India logo"><span class="jankar-brand-copy"><span class="jankar-brand-name"><strong>JANKAR</strong><strong>INDIA</strong></span><span class="jankar-brand-hindi">जानकारी आपका अधिकार</span><span class="jankar-brand-tagline"><b>ASK</b><i></i><b>KNOW</b><i></i><b>EMPOWER</b></span></span></div>`;};

if(typeof s.rtiAttachmentError==='undefined')s.rtiAttachmentError='';

verifyBpl=function(){
  const card=(document.getElementById('bplCard')?.value||'').trim().toUpperCase();
  s.bplCard=card;
  if(VALID_BPL_CARDS.has(card)){
    s.bplVerified=true;
    s.bplError='';
  }else{
    s.bplVerified=false;
    s.bplError='Invalid BPL details. Please enter a valid BPL card number.';
  }
  render();
};

handleRtiAttachment=function(input){
  const f=input.files&&input.files[0];
  if(!f)return;
  const pdf=f.type==='application/pdf'||f.name.toLowerCase().endsWith('.pdf');
  if(!pdf||f.size>1024*1024){
    input.value='';
    s.rtiAttachment=null;
    s.rtiAttachmentError='Only PDF files up to 1MB are allowed.';
    render();
    return;
  }
  s.rtiAttachment={name:f.name,size:f.size,type:'application/pdf'};
  s.rtiAttachmentError='';
  render();
};

removeRtiAttachment=function(){
  s.rtiAttachment=null;
  s.rtiAttachmentError='';
  render();
};

review=function(){
  const isBpl=s.bplChoice==='yes';
  const bplReady=isBpl&&s.bplVerified;
  const canSubmit=isBpl?bplReady:s.paymentDone;

  const bpl=`<div class="filing-addon"><h3>BPL Fee Waiver</h3><p class="addon-help">Applicants holding a valid BPL card can use the fee-waiver flow.</p><label>Do you hold a valid BPL card?</label><div class="inline-options"><label><input type="radio" name="bplChoice" value="no" ${!isBpl?'checked':''} onchange="setBplChoice(this.value)"> No</label><label><input type="radio" name="bplChoice" value="yes" ${isBpl?'checked':''} onchange="setBplChoice(this.value)"> Yes</label></div>${isBpl?`<div class="bpl-verify-row"><div><label>BPL Card Number</label><input id="bplCard" value="${e(s.bplCard)}" placeholder="e.g. BPL-MH-2026-001"></div><button type="button" class="outline" onclick="verifyBpl()">Verify</button></div>${s.bplVerified?'<div class="notice success">✓ Fee waived — BPL applicant (as per RTI Act)</div>':''}${s.bplError?`<div class="notice danger">${e(s.bplError)}</div>`:''}`:''}</div>`;

  const attachment=`<div class="filing-addon"><h3>Attach Supporting Documents <span class="optional-label">Optional</span></h3><p class="addon-help">PDF only • Maximum 1 MB</p>${s.rtiAttachment?`<div class="file-chip"><div><b>${e(s.rtiAttachment.name)}</b><small>PDF • ${formatFileSize(s.rtiAttachment.size)} • Ready</small></div><button type="button" class="ghost" onclick="removeRtiAttachment()">Remove</button></div>`:`<label class="upload-box"><span>Choose supporting PDF</span><small>This attachment is optional.</small><input type="file" accept=".pdf,application/pdf" onchange="handleRtiAttachment(this)"></label>`}${s.rtiAttachmentError?`<div class="notice danger">${e(s.rtiAttachmentError)}</div>`:''}</div>`;

  const payment=bplReady?`<h3>RTI Filing Fee</h3><div class="fee-breakdown"><div><span>Original Fee</span><b>₹10.00</b></div><div><span>BPL Waiver</span><b>-₹10.00</b></div><div class="fee-total"><span>Final Amount</span><b>₹0.00</b></div></div><div class="notice success">Fee waived — BPL applicant (as per RTI Act). No payment is required.</div>`:`<h3>RTI Filing Fee (Demo)</h3><div class="fee">₹10.00</div><label>Choose Payment Method (Demo)</label><div class="pay-options"><label><input type="radio" name="pay" checked> UPI (Demo)</label><label><input type="radio" name="pay"> Card (Demo)</label><label><input type="radio" name="pay"> Net Banking (Demo)</label></div><button onclick="demoPay()">Proceed to Demo Payment →</button><div id="paystate">${s.paymentDone?'<div class="notice success">✓ Demo payment successful. You may now approve and submit the demo RTI.</div>':''}</div>`;

  return shell(`<main class="content wide"><div class="page-head"><h1>File RTI</h1></div><section class="filing-grid"><div class="document-panel"><div class="stepper"><span class="done">✓ Details</span><span class="done">✓ Draft</span><span class="active">3 Review</span><span>4 Fee / Waiver</span><span>5 Submit</span></div><div class="notice saffron-box">AI-assisted draft — please review before submission.</div><div class="rti-document"><pre id="draftText">${e(s.draft)}</pre></div></div><aside class="payment-card">${bpl}${attachment}<div class="payment-divider"></div><h2>${bplReady?'Fee Waiver':'Demo Payment Gateway'}</h2><div class="notice info">Hackathon demo only. No real payment will be processed.</div>${payment}<button id="submitBtn" class="success-btn" ${canSubmit?'':'disabled'} onclick="submitDemo()">Approve & Submit Demo RTI</button></aside></section></main>`);
};

const APPEAL_PROFILE={
  name:'Tasmayee',
  address:'Pune, Maharashtra',
  phone:'+91 98765 43210',
  email:'tasmayee@example.com'
};

openAppeal=function(){
  s.page='appeal';
  render();
};

findAppealRti=function(){
  const n=(document.getElementById('appealRtiNumber')?.value||'').trim();
  if(!n){alert('Enter the original RTI application number.');return;}
  const r=SAMPLE_RTIS.find(x=>x.id.toLowerCase()===n.toLowerCase());
  if(r){
    s.appealLookupStatus='found';
    s.appealData={
      rtiNumber:r.id,
      applicant:APPEAL_PROFILE.name,
      address:APPEAL_PROFILE.address,
      phone:APPEAL_PROFILE.phone,
      email:APPEAL_PROFILE.email,
      filed:r.filed,
      department:r.authority,
      pio:`PIO/CPIO, ${r.authority}`
    };
  }else{
    s.appealLookupStatus='missing';
    s.appealData={
      rtiNumber:n,
      applicant:s.authed?APPEAL_PROFILE.name:'',
      address:s.authed?APPEAL_PROFILE.address:'',
      phone:s.authed?APPEAL_PROFILE.phone:'',
      email:s.authed?APPEAL_PROFILE.email:'',
      filed:'',
      department:'',
      pio:''
    };
  }
  render();
};

toggleAppealReply=function(v){
  const date=document.getElementById('replyDateBlock');
  const note=document.getElementById('replyStatusNote');
  if(date)date.style.display=v==='unsatisfactory'?'block':'none';
  if(note)note.innerHTML=v==='no_reply'?'<div class="notice saffron-box">No reply received within 30 days — this may be treated as deemed refusal for the purpose of a First Appeal under Section 19(1).</div>':'';
};

submitFirstAppeal=function(){
  const get=id=>(document.getElementById(id)?.value||'').trim();
  const reply=document.querySelector('input[name="replyStatus"]:checked')?.value;
  const grounds=[...document.querySelectorAll('input[name="appealGround"]:checked')];
  if(!s.appealData?.rtiNumber)return alert('Please enter and look up the original RTI application number.');
  if(!get('appealApplicant')||!get('appealAddress')||!get('appealPhone')||!get('appealEmail')||!get('appealFiled')||!get('appealDepartment')||!get('appealPio'))return alert('Please complete the required RTI and applicant details.');
  if(!reply)return alert('Please select what happened with your RTI.');
  if(reply==='unsatisfactory'&&!get('appealReplyDate'))return alert('Please provide the date on which the reply was received.');
  if(!grounds.length)return alert('Please select at least one ground for appeal.');
  if(grounds.some(x=>x.value==='other')&&!get('appealOtherGround'))return alert('Please explain the other ground for appeal.');
  if(!get('appealRelief'))return alert('Please describe the relief you are seeking.');
  if(!document.getElementById('appealDeclaration')?.checked)return alert('Please confirm the declaration before submitting.');
  s.appealRef=`FAA/2026/${String(Date.now()%1000000).padStart(6,'0')}`;
  s.appealSubmitted=true;
  render();
};

firstAppeal=function(){
  if(s.appealSubmitted)return shell(`<main class="content wide"><section class="appeal-success-card"><div class="checkdot">✓</div><h1>First Appeal recorded in demo</h1><p>Your prototype First Appeal reference is <b>${e(s.appealRef)}</b>.</p><div class="notice info">No real government submission or payment has occurred. This page demonstrates the citizen journey only.</div><button onclick="s.appealStarted=false;s.appealSubmitted=false;s.appealLookupStatus='';s.appealData=null;s.page='appeal';render()">Start another First Appeal</button></section></main>`,'First Appeal');

  const intro=`<section class="appeal-intro"><div><span class="eyebrow">Citizen appeal support</span><h1>Not satisfied with the reply to your RTI?</h1><p>Under Section 19(1) of the RTI Act, 2005, an applicant who receives no reply within 30 days, or receives an incomplete or unsatisfactory reply, can file a First Appeal to the First Appellate Authority (FAA).</p></div><button onclick="startFirstAppeal()">File First Appeal →</button></section>`;
  if(!s.appealStarted)return shell(`<main class="content wide">${intro}</main>`,'First Appeal');

  const d=s.appealData;
  const msg=s.appealLookupStatus==='found'?'<div class="notice success">✓ Matching RTI found. Details have been filled from your Jankar RTI record and remain editable.</div>':s.appealLookupStatus==='missing'?'<div class="notice saffron-box">No matching RTI found — please fill details manually.</div>':'';

  const fields=d?`<div class="appeal-section"><h2>Applicant & RTI Details</h2><div class="two-col"><div><label>Applicant Name *</label><input id="appealApplicant" value="${e(d.applicant)}"></div><div><label>Address *</label><input id="appealAddress" value="${e(d.address)}"></div><div><label>Phone *</label><input id="appealPhone" value="${e(d.phone)}"></div><div><label>Email *</label><input id="appealEmail" value="${e(d.email)}"></div><div><label>RTI Filed Date *</label><input id="appealFiled" value="${e(d.filed)}" placeholder="DD/MM/YYYY"></div><div><label>Department / Public Authority *</label><input id="appealDepartment" value="${e(d.department)}"></div></div><label>CPIO / PIO Name or Office *</label><input id="appealPio" value="${e(d.pio)}"></div><div class="appeal-section"><h2>Status of PIO's Reply</h2><div class="inline-options appeal-options"><label><input type="radio" name="replyStatus" value="no_reply" onchange="toggleAppealReply(this.value)"> No reply received</label><label><input type="radio" name="replyStatus" value="unsatisfactory" onchange="toggleAppealReply(this.value)"> Reply received, but unsatisfactory</label></div><div id="replyStatusNote"></div><div id="replyDateBlock" style="display:none"><label>Date reply received *</label><input id="appealReplyDate" type="date"></div></div><div class="appeal-section"><h2>Grounds for First Appeal</h2><p class="addon-help">Select all that apply.</p><div class="grounds-grid"><label><input type="checkbox" name="appealGround" value="no_reply"> No reply within 30 days</label><label><input type="checkbox" name="appealGround" value="incomplete"> Incomplete or incorrect information</label><label><input type="checkbox" name="appealGround" value="exemption"> Wrong exemption cited (Sec 8/9/11/24)</label><label><input type="checkbox" name="appealGround" value="fee"> Excessive fee charged</label><label><input type="checkbox" name="appealGround" value="other" onchange="toggleOtherGround(this)"> Other</label></div><div id="otherGroundBlock" style="display:none"><label>Please explain</label><textarea id="appealOtherGround" placeholder="Explain the other reason for appeal"></textarea></div></div><div class="appeal-section"><h2>Relief Sought</h2><label>What would you like the First Appellate Authority to do? *</label><textarea id="appealRelief" placeholder="For example: Direct the PIO to provide complete information for the unanswered points..."></textarea></div><div class="appeal-section"><h2>Supporting Documents <span class="optional-label">Optional</span></h2>${s.appealLookupStatus==='found'?'<div class="existing-file">✓ Original RTI application is already available in your Jankar record.</div>':appealAttachmentField('original','Original RTI Application')}${appealAttachmentField('reply','PIO Reply')}${appealAttachmentField('receipt','RTI Submission / Fee Receipt')}</div><div class="appeal-section declaration-section"><label class="declaration-label"><input id="appealDeclaration" type="checkbox" onchange="toggleAppealSubmit(this)"> I declare that the above information is true and this matter is not already pending elsewhere.</label><button id="submitAppealBtn" class="success-btn" disabled onclick="submitFirstAppeal()">Submit First Appeal Demo</button></div>`:'';

  return shell(`<main class="content wide">${intro}<section class="appeal-form-card"><div class="page-head"><h1>First Appeal Details</h1><p>Start with your original RTI application number.</p></div><div class="lookup-row"><div><label>Original RTI Application Number *</label><input id="appealRtiNumber" value="${e(d?.rtiNumber||'')}" placeholder="e.g. JNK/2026/001284"></div><button class="outline" onclick="findAppealRti()">Find RTI</button></div>${msg}${fields}</section></main>`,'First Appeal');
};

// Re-render once so the overrides above are active immediately.
render();