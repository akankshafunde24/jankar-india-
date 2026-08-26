const app=document.getElementById('app');
const C={navy:'#0D2B5C',orange:'#FF6A00',green:'#138808'};
const sources=[
{id:'rti',domain:'rtionline.gov.in',org:'Department of Personnel & Training',level:'CENTRAL',url:'https://rtionline.gov.in/'},
{id:'india',domain:'india.gov.in',org:'National Portal of India',level:'CENTRAL',url:'https://www.india.gov.in/'},
{id:'data',domain:'data.gov.in',org:'Open Government Data Platform India',level:'CENTRAL',url:'https://www.data.gov.in/'},
{id:'rail',domain:'indianrailways.gov.in',org:'Ministry of Railways',level:'CENTRAL',url:'https://indianrailways.gov.in/'},
{id:'maha',domain:'maharashtra.gov.in',org:'Government of Maharashtra',level:'STATE',url:'https://www.maharashtra.gov.in/'}];
const rail=[{year:'2021-22',value:75.48},{year:'2022-23',value:81.23},{year:'2023-24',value:95.14},{year:'2024-25',value:99.01},{year:'2025-26',value:132.90}];
let s={page:'landing',authed:false,user:null,userLoc:'',subjectLoc:'',query:'',result:null,draft:'',authority:'',jurisdiction:'',submission:null,response:null};
const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function brand(){return `<div class="brand"><img src="${LOGO_DATA}"><div><b>JANKAR <span>INDIA</span></b><small>जानकारी आपका अधिकार</small></div></div>`}
function shell(body,active=''){let nav=s.authed?['Home','Ask Jankar','File RTI','Track RTI','Explore Data','RTI Guide'].map(x=>`<button class="${x===active?'active':''}" onclick="go('${x}')">${x}</button>`).join(''):`<button onclick="go('RTI Guide')">RTI Guide</button><button onclick="login()">Login</button>`;return `<header>${brand()}<nav>${nav}</nav></header>${body}<footer><b>Jankar India</b><span>Government sources only • Privacy-first • Demo data labelled</span></footer>`}
function go(x){let m={'Home':'dash','Ask Jankar':'ask','File RTI':'manual','Track RTI':'track','Explore Data':'data','RTI Guide':'guide'};if(!s.authed&&x!=='RTI Guide')return login();s.page=m[x];render()}
function login(){s.page='login';render()}
function classify(q,loc=''){q=(q+' '+loc).toLowerCase();if(/railway|income tax|passport|central university/.test(q))return['CENTRAL',q.includes('rail')?'Ministry of Railways':q.includes('passport')?'Ministry of External Affairs':q.includes('income tax')?'Income Tax Department':'Ministry of Education','The subject appears to be handled by a Central Government authority.'];if(/municipal corporation|municipality|panchayat|ward office|local body/.test(q))return['LOCAL','Relevant Local Public Authority','The request concerns a local-body function.'];if(/maharashtra|state road|\bpune\b|nashik|kolhapur/.test(q))return['STATE','Relevant Maharashtra / State Public Authority','The question appears connected to a State or local authority.'];return['UNKNOWN','Authority not confidently determined','More information is needed to determine the authority.']}
