// Small post-load hardening patches for the static zero-cost demo.
// Keep public-information figures aligned to the cited Government of India budget statements.
RAIL_DEMO[1]={year:'2022-23',value:159169.22,label:'Actual capital outlay — commercial lines'};

const _manual=manual;
manual=function(){
  if(!s.authed){s.afterLogin='manual';return loginPage();}
  return _manual();
};
const _track=track;
track=function(){
  if(!s.authed){s.afterLogin='track';return loginPage();}
  return _track();
};
