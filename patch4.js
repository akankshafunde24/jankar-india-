// Approved ASK JANKAR fixes only: logo reliability, consent-based location,
// all-State/UT RTI routing, the 3,000-character limit and clean new-query state.

const RTI_CHARACTER_LIMIT=3000;
const DOPT_STATE_DIRECTORY='https://rti.dopt.gov.in/rtistatelink.html';
const RTI_PORTALS={
  'Andhra Pradesh':{url:DOPT_STATE_DIRECTORY,online:false},
  'Arunachal Pradesh':{url:'https://rti.arunachal.gov.in/',online:true},
  'Assam':{url:DOPT_STATE_DIRECTORY,online:false},
  'Bihar':{url:'https://jaankari.bihar.gov.in/',online:true},
  'Chhattisgarh':{url:'https://rtionline.cg.gov.in/',online:true},
  'Goa':{url:'https://rtionline.goa.gov.in/',online:true},
  'Gujarat':{url:'https://onlinerti.gujarat.gov.in/',online:true},
  'Haryana':{url:'https://rtiharyana.gov.in/',online:true},
  'Himachal Pradesh':{url:'https://onlinerti.hp.gov.in/',online:true},
  'Jharkhand':{url:DOPT_STATE_DIRECTORY,online:false},
  'Karnataka':{url:'https://rtionline.karnataka.gov.in/',online:true},
  'Kerala':{url:'https://rtiportal.kerala.gov.in/',online:true},
  'Madhya Pradesh':{url:'https://services.mp.gov.in/eservice/',online:true},
  'Maharashtra':{url:'https://rtionline.maharashtra.gov.in/',online:true},
  'Manipur':{url:DOPT_STATE_DIRECTORY,online:false},
  'Meghalaya':{url:'https://megrti.gov.in/',online:true},
  'Mizoram':{url:'https://rti.mizoram.gov.in/login',online:true},
  'Nagaland':{url:DOPT_STATE_DIRECTORY,online:false},
  'Odisha':{url:'https://rtiodisha.gov.in/',online:true},
  'Punjab':{url:'https://rti.punjab.gov.in/',online:true},
  'Rajasthan':{url:'https://rti.rajasthan.gov.in/',online:true},
  'Sikkim':{url:DOPT_STATE_DIRECTORY,online:false},
  'Tamil Nadu':{url:'https://rtionline.tn.gov.in/',online:true},
  'Telangana':{url:'https://rti.telangana.gov.in/',online:true},
  'Tripura':{url:'https://rtionline.tripura.gov.in/',online:true},
  'Uttar Pradesh':{url:'https://rtionline.up.gov.in/',online:true},
  'Uttarakhand':{url:'https://rtionline.uk.gov.in/',online:true},
  'West Bengal':{url:DOPT_STATE_DIRECTORY,online:false},
  'Andaman and Nicobar Islands':{url:'https://rtionline.gov.in/',online:true},
  'Chandigarh':{url:'https://rtionline.gov.in/',online:true},
  'Dadra and Nagar Haveli and Daman and Diu':{url:DOPT_STATE_DIRECTORY,online:false},
  'Delhi':{url:'http://rtionline.delhi.gov.in/',online:true},
  'Jammu and Kashmir':{url:'https://rtionline.jk.gov.in/',online:true},
  'Ladakh':{url:'https://rtionline.ladakh.gov.in/index.php',online:true},
  'Lakshadweep':{url:DOPT_STATE_DIRECTORY,online:false},
  'Puducherry':{url:'https://rtionline.gov.in/',online:true}
};

const LOCATION_ALIASES={
  'andhra pradesh':'Andhra Pradesh','ap':'Andhra Pradesh','vijayawada':'Andhra Pradesh','visakhapatnam':'Andhra Pradesh','tirupati':'Andhra Pradesh','amaravati':'Andhra Pradesh',
  'arunachal pradesh':'Arunachal Pradesh','itanagar':'Arunachal Pradesh','assam':'Assam','guwahati':'Assam','dispur':'Assam',
  'bihar':'Bihar','patna':'Bihar','gaya':'Bihar','chhattisgarh':'Chhattisgarh','raipur':'Chhattisgarh','bilaspur':'Chhattisgarh',
  'goa':'Goa','panaji':'Goa','gujarat':'Gujarat','ahmedabad':'Gujarat','surat':'Gujarat','vadodara':'Gujarat','gandhinagar':'Gujarat',
  'haryana':'Haryana','gurugram':'Haryana','gurgaon':'Haryana','faridabad':'Haryana','himachal pradesh':'Himachal Pradesh','shimla':'Himachal Pradesh','manali':'Himachal Pradesh','dharamshala':'Himachal Pradesh',
  'jharkhand':'Jharkhand','ranchi':'Jharkhand','jamshedpur':'Jharkhand','karnataka':'Karnataka','bangalore':'Karnataka','bengaluru':'Karnataka','mysuru':'Karnataka','mysore':'Karnataka','mangaluru':'Karnataka',
  'kerala':'Kerala','kochi':'Kerala','thiruvananthapuram':'Kerala','trivandrum':'Kerala','kozhikode':'Kerala',
  'madhya pradesh':'Madhya Pradesh','mp':'Madhya Pradesh','bhopal':'Madhya Pradesh','indore':'Madhya Pradesh','jabalpur':'Madhya Pradesh',
  'maharashtra':'Maharashtra','mumbai':'Maharashtra','pune':'Maharashtra','nagpur':'Maharashtra','nashik':'Maharashtra','thane':'Maharashtra','aurangabad':'Maharashtra',
  'manipur':'Manipur','imphal':'Manipur','meghalaya':'Meghalaya','shillong':'Meghalaya','mizoram':'Mizoram','aizawl':'Mizoram','nagaland':'Nagaland','kohima':'Nagaland','dimapur':'Nagaland',
  'odisha':'Odisha','orissa':'Odisha','bhubaneswar':'Odisha','cuttack':'Odisha','punjab':'Punjab','amritsar':'Punjab','ludhiana':'Punjab','jalandhar':'Punjab',
  'rajasthan':'Rajasthan','jaipur':'Rajasthan','jodhpur':'Rajasthan','udaipur':'Rajasthan','kota':'Rajasthan','sikkim':'Sikkim','gangtok':'Sikkim',
  'tamil nadu':'Tamil Nadu','tn':'Tamil Nadu','chennai':'Tamil Nadu','coimbatore':'Tamil Nadu','madurai':'Tamil Nadu',
  'telangana':'Telangana','hyderabad':'Telangana','warangal':'Telangana','tripura':'Tripura','agartala':'Tripura',
  'uttar pradesh':'Uttar Pradesh','up':'Uttar Pradesh','lucknow':'Uttar Pradesh','noida':'Uttar Pradesh','agra':'Uttar Pradesh','varanasi':'Uttar Pradesh','kanpur':'Uttar Pradesh','prayagraj':'Uttar Pradesh',
  'uttarakhand':'Uttarakhand','dehradun':'Uttarakhand','haridwar':'Uttarakhand','west bengal':'West Bengal','kolkata':'West Bengal','howrah':'West Bengal','darjeeling':'West Bengal',
  'andaman and nicobar islands':'Andaman and Nicobar Islands','port blair':'Andaman and Nicobar Islands','chandigarh':'Chandigarh',
  'dadra and nagar haveli and daman and diu':'Dadra and Nagar Haveli and Daman and Diu','daman':'Dadra and Nagar Haveli and Daman and Diu','silvassa':'Dadra and Nagar Haveli and Daman and Diu',
  'delhi':'Delhi','new delhi':'Delhi','ncr':'Delhi','jammu and kashmir':'Jammu and Kashmir','j&k':'Jammu and Kashmir','srinagar':'Jammu and Kashmir','jammu':'Jammu and Kashmir',
  'ladakh':'Ladakh','leh':'Ladakh','lakshadweep':'Lakshadweep','kavaratti':'Lakshadweep','puducherry':'Puducherry','pondicherry':'Puducherry'
};

const LOCATION_POINTS=[
  ['Andhra Pradesh',16.51,80.52],['Arunachal Pradesh',27.08,93.62],['Assam',26.14,91.79],['Bihar',25.59,85.14],['Chhattisgarh',21.25,81.63],['Goa',15.49,73.83],['Gujarat',23.22,72.64],['Haryana',30.73,76.78],['Himachal Pradesh',31.10,77.17],['Jharkhand',23.34,85.31],['Karnataka',12.97,77.59],['Kerala',8.52,76.94],['Madhya Pradesh',23.26,77.41],['Maharashtra',19.08,72.88],['Manipur',24.82,93.94],['Meghalaya',25.58,91.89],['Mizoram',23.73,92.72],['Nagaland',25.67,94.11],['Odisha',20.30,85.82],['Punjab',30.73,76.78],['Rajasthan',26.91,75.79],['Sikkim',27.34,88.61],['Tamil Nadu',13.08,80.27],['Telangana',17.39,78.49],['Tripura',23.83,91.28],['Uttar Pradesh',26.85,80.95],['Uttarakhand',30.32,78.03],['West Bengal',22.57,88.36],['Andaman and Nicobar Islands',11.62,92.73],['Chandigarh',30.73,76.78],['Dadra and Nagar Haveli and Daman and Diu',20.40,72.83],['Delhi',28.61,77.21],['Jammu and Kashmir',34.08,74.80],['Ladakh',34.15,77.58],['Lakshadweep',10.57,72.64],['Puducherry',11.94,79.81]
];

if(typeof s.locationConsent==='undefined')s.locationConsent='not-asked';
if(typeof s.userLocation==='undefined')s.userLocation='';
if(typeof s.locationMessage==='undefined')s.locationMessage='';

function escapedPattern(x){return x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function detectQueryLocation(q){
  const t=String(q||'').toLowerCase().replace(/[^a-z0-9& ]/g,' ');
  return Object.keys(LOCATION_ALIASES).sort((a,b)=>b.length-a.length).find(k=>new RegExp(`(^|\\s)${escapedPattern(k)}(?=\\s|$)`).test(t))||'';
}
function detectedState(q){const key=detectQueryLocation(q);return key?LOCATION_ALIASES[key]:'';}
extractSubjectLocation=function(q){const key=detectQueryLocation(q);return key?`${key.replace(/\b\w/g,m=>m.toUpperCase())}, ${LOCATION_ALIASES[key]}`:'';};

function portalForState(state){return RTI_PORTALS[state]||null;}
function portalSource(state){
  const p=portalForState(state);
  if(!p)return null;
  return {title:p.online?`${state} RTI Online`:`Official RTI portal directory — ${state}`,org:p.online?`Government of ${state}`:'Department of Personnel & Training',domain:new URL(p.url).hostname,url:p.url,level:'STATE'};
}

const _baseRouteQuery=routeQuery;
routeQuery=function(q,loc=''){
  const central=_baseRouteQuery(q,'');
  if(central.jurisdiction==='CENTRAL')return central;
  const state=detectedState(`${q} ${loc}`);
  if(state){
    const p=portalForState(state);
    return {jurisdiction:'STATE',authority:`Relevant Government of ${state} Public Authority`,reason:`The query or selected subject location points to ${state}. Confirm the exact department before filing.`,confidence:'High',routeUrl:p?.url||DOPT_STATE_DIRECTORY,routeLabel:p?.online?`${state} RTI Online`:`Official RTI portal directory — ${state}`};
  }
  return _baseRouteQuery(q,loc);
};

const _basePublicInfo=publicInfo;
publicInfo=function(q,route){
  const info=_basePublicInfo(q,route);
  const state=detectedState(`${q} ${s.subjectLoc||''}`);
  if(route.jurisdiction==='STATE'&&state&&!info.found){
    const source=portalSource(state);
    if(source)info.sources=[source];
  }
  return info;
};

function resetAskDependentState(){
  s.subjectLoc='';s.result=null;s.draft='';s.authority='';s.jurisdiction='';s.chat=[];s.paymentDone=false;s.submission=null;
}
function startNewAsk(){resetAskDependentState();s.query='';s.page='ask';render();}
function prepareNewQuery(value){
  resetAskDependentState();s.query=value;
  const loc=document.getElementById('sloc');if(loc)loc.value='';
  const slot=document.getElementById('askResultSlot');if(slot)slot.innerHTML='';
}

nav=function(active=''){
  return `<nav><button class="${active==='Ask Jankar'?'active':''}" onclick="startNewAsk()">Ask Jankar</button><button class="${active==='My RTIs'?'active':''}" onclick="openMyRtis()">My RTIs</button><button class="${active==='First Appeal'?'active':''}" onclick="openAppeal()">First Appeal</button><button class="${active==='Know About RTI'?'active':''}" onclick="s.page='guide';render()">Know About RTI</button></nav>`;
};

function locationStatusMarkup(){
  const cls=s.locationConsent==='granted'?'success-text':s.locationConsent==='denied'||s.locationConsent==='error'?'error-text':'';
  const msg=s.locationMessage||'Location is optional and will be requested only after you choose “Use my location”.';
  return `<span id="locationStatus" class="location-status ${cls}">${e(msg)}</span>`;
}

function nearestState(latitude,longitude){
  let best=null;
  for(const p of LOCATION_POINTS){const d=(latitude-p[1])**2+(longitude-p[2])**2;if(!best||d<best.d)best={state:p[0],d};}
  return best?.state||'';
}
function requestUserLocation(){
  if(!navigator.geolocation){s.locationConsent='error';s.locationMessage='Location is not supported by this browser. Enter the subject location manually.';render();return;}
  s.locationConsent='requesting';s.locationMessage='Waiting for your browser location permission…';render();
  navigator.geolocation.getCurrentPosition(pos=>{
    s.locationConsent='granted';s.userLocation=nearestState(pos.coords.latitude,pos.coords.longitude);s.subjectLoc=s.userLocation;s.locationMessage=`Location permission granted. Approximate state: ${s.userLocation}. You can edit the RTI subject location.`;
    render();
  },err=>{
    s.locationConsent=err.code===1?'denied':'error';s.userLocation='';s.locationMessage=err.code===1?'Location permission was not granted. You can enter the subject location manually.':'Location could not be detected. Enter the subject location manually.';render();
  },{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
}
function declineUserLocation(){s.locationConsent='denied';s.userLocation='';s.locationMessage='Location not used. Query detection and manual entry remain available.';render();}

function askResultMarkup(){
  if(!s.result)return '';
  const r=s.result,info=r.info;
  return `<section class="answer-card"><div class="answer-main"><div class="answer-title"><span class="checkdot">✓</span><div><h2>${e(info.headline)}</h2><small>Powered by verified government sources</small></div></div><div class="qa-block"><b>Q: ${e(s.query)}</b><p>${e(info.answer)}</p>${info.points.map(p=>`<p class="bullet">• ${e(p)}</p>`).join('')}</div>${sourceCards(info.sources)}<div class="answer-actions">${info.data?`<button onclick="s.page='visual';render()">▥ Visualise this data</button><button class="outline" onclick="printAnswer()">▣ Download PDF</button><button class="outline" onclick="needMore()">I need more information</button>`:`<button onclick="makeDraft()">Prepare RTI Draft</button>${r.route.routeUrl?`<a class="button outline" target="_blank" rel="noopener" href="${e(r.route.routeUrl)}">${e(r.route.routeLabel||'Official RTI route')} ↗</a>`:''}`}</div></div><aside class="authority-card"><div class="authority-icon">🏛️</div><h2>${r.route.jurisdiction==='CENTRAL'?'Central Government':r.route.jurisdiction==='STATE'?'State Government':r.route.jurisdiction==='LOCAL'?'Local Authority':'Authority review'}</h2><p><b>Authority:</b> ${e(r.route.authority)}</p><hr><p><b>Jurisdiction:</b> ${e(r.route.jurisdiction)}</p><p><b>Subject location:</b> ${e(s.subjectLoc||'Not specified')}</p><p><b>Confidence:</b> ${e(r.route.confidence)}</p><p class="reason"><b>Why this authority?</b><br>${e(r.route.reason)}</p></aside></section><section class="followup-card"><div class="followup-head"><div><h2>Continue the conversation with Jankar</h2><p>Ask follow-up questions to get more specific information.</p></div><span class="status-live">● Conversation ready</span></div><div class="followup-layout"><div class="suggestions"><b>Try these follow-ups</b><button onclick="openConversation('How has the expenditure changed over the last five years?')">How has the expenditure changed over the last 5 years? ›</button><button onclick="openConversation('What are the major heads under which this expenditure is incurred?')">What are the major expenditure heads? ›</button><button onclick="openConversation('Show the expenditure breakup by major heads.')">Show expenditure breakup by major heads. ›</button></div><div class="conversation-preview"><p>Continue in a dedicated conversation with Jankar. Your original question and verified context will carry forward.</p><button onclick="openConversation('')">Open conversation →</button></div></div></section>`;
}

ask=function(){
  return shell(`<main class="content wide"><div class="page-head"><h1>Ask Jankar</h1><p>Search verified government information first.</p></div><section class="ask-input-card"><label>Your question</label><textarea id="aq" oninput="prepareNewQuery(this.value)">${e(s.query)}</textarea><div class="ask-location-panel"><p>With your permission, Jankar can use an approximate device location to help identify the likely State route. The RTI subject location may be different and always remains editable.</p><div class="location-actions"><button type="button" class="outline small" onclick="requestUserLocation()">Use my location</button><button type="button" class="ghost" onclick="declineUserLocation()">Not now</button>${locationStatusMarkup()}</div></div><div class="two-col"><div><label>RTI subject location</label><input id="sloc" value="${e(s.subjectLoc)}" oninput="s.subjectLoc=this.value" placeholder="Detected from query or entered by you"></div><div class="align-end"><button onclick="searchGov()">Search government sources</button></div></div></section><div id="askResultSlot" class="ask-result-slot">${askResultMarkup()}</div></main>`,'Ask Jankar');
};

heroAsk=function(){
  const q=document.getElementById('hq').value.trim();if(q.length<5)return alert('Please enter a question.');
  resetAskDependentState();s.query=q;s.page='ask';render();setTimeout(searchGov,20);
};

const _liveSearchGov=searchGov;
searchGov=async function(){
  const q=(document.getElementById('aq')?.value||s.query||'').trim();if(q.length<5)return alert('Please enter a clearer question.');
  s.query=q;
  const manual=(document.getElementById('sloc')?.value||'').trim();
  s.subjectLoc=extractSubjectLocation(q)||manual||(s.locationConsent==='granted'?s.userLocation:'');
  const locationInput=document.getElementById('sloc');if(locationInput)locationInput.value=s.subjectLoc;
  return _liveSearchGov();
};

function draftLength(text=s.draft){return Array.from(String(text||'')).length;}
function characterLimitMarkup(){
  const count=draftLength(),remaining=RTI_CHARACTER_LIMIT-count,cls=count>RTI_CHARACTER_LIMIT?'over':count>=2700?'near':'';
  const amount=Math.abs(remaining),unit=amount===1?'character':'characters';
  const status=remaining>=0?`${amount} ${unit} remaining`:`${amount} ${unit} over the limit`;
  const suggestions=count>RTI_CHARACTER_LIMIT?`<ul class="char-suggestions"><li>Remove background narrative and repeated context.</li><li>Request existing records in short, numbered points.</li><li>Mention the date range and authority only once.</li></ul><button type="button" class="outline small" onclick="applyConciseDraft()">Create concise draft</button>`:'';
  return `<div id="charLimitBox" class="char-limit-box ${cls}"><div class="char-limit-row"><b id="charCount">${count.toLocaleString('en-IN')} / ${RTI_CHARACTER_LIMIT.toLocaleString('en-IN')} characters</b><span id="charRemaining">${status}</span></div>${suggestions}</div>`;
}
function updateCharacterLimitUI(){
  const fresh=characterLimitMarkup(),old=document.getElementById('charLimitBox');if(old)old.outerHTML=fresh;
  const submit=document.getElementById('submitBtn');if(submit&&draftLength()>RTI_CHARACTER_LIMIT)submit.disabled=true;
}
saveRtiDraftEdit=function(value){s.draft=value;updateCharacterLimitUI();};
function applyConciseDraft(){
  const request=String(s.query||'the requested subject').replace(/\s+/g,' ').trim().slice(0,1600);
  s.draft=`Request for Information under the Right to Information Act, 2005\n\nTo,\nThe Public Information Officer\n${s.authority||'Relevant Public Authority'}\n\nSubject: Request for official records\n\nPlease provide the following information/records relating to: ${request}\n\n1. Copies of the relevant official records, orders, statements or reports held by the authority.\n2. The applicable date-wise, year-wise or project-wise details for the period mentioned in the request.\n3. Copies in electronic form where the records are maintained electronically and disclosure is permissible.\n\nIf any part is held by another public authority, kindly transfer that part under the applicable provisions of the RTI Act, 2005.\n\nSubject Location: ${s.subjectLoc||'As applicable'}`;
  render();
}

const _reviewBeforeLimit=review;
review=function(){
  let html=_reviewBeforeLimit();
  html=html.replace('</textarea>',`</textarea>${characterLimitMarkup()}`);
  if(draftLength()>RTI_CHARACTER_LIMIT)html=html.replace(/(<button id="submitBtn"[^>]*)(>)/,(_,a,b)=>`${a.replace(/\sdisabled/g,'')} disabled${b}`);
  return html;
};
const _submitDemoBeforeLimit=submitDemo;
submitDemo=function(){if(draftLength()>RTI_CHARACTER_LIMIT)return alert(`Your RTI is ${draftLength()-RTI_CHARACTER_LIMIT} characters over the 3,000-character limit. Please shorten it before submitting.`);return _submitDemoBeforeLimit();};
const _demoPayBeforeLimit=demoPay;
demoPay=function(){_demoPayBeforeLimit();updateCharacterLimitUI();};

render();
