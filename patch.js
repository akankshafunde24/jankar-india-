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
