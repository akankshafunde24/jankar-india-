// Branding-only presentation patch.
// Keeps all existing application flows and page logic unchanged.

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

brand=function(){
  return `<div class="brand jankar-brand" onclick="s.page='landing';render()">
    <img src="assets/jankar-logo.svg" alt="Jankar India logo">
    <span class="jankar-brand-name"><strong>JANKAR</strong><strong>INDIA</strong></span>
  </div>`;
};

const jankarBrandStyle=document.createElement('style');
jankarBrandStyle.textContent=`
  .jankar-brand{display:flex!important;align-items:center!important;gap:12px!important;white-space:nowrap!important}
  .jankar-brand img{width:68px!important;height:68px!important;object-fit:contain!important;flex:0 0 68px!important}
  .jankar-brand-name{display:flex!important;align-items:baseline!important;gap:7px!important;font-size:25px!important;font-weight:900!important;letter-spacing:-0.7px!important;line-height:1!important}
  .jankar-brand-name strong:first-child{color:#082d63!important}
  .jankar-brand-name strong:last-child{color:#0c9a3d!important}
  @media(max-width:760px){
    .jankar-brand{gap:7px!important}
    .jankar-brand img{width:48px!important;height:48px!important;flex-basis:48px!important}
    .jankar-brand-name{font-size:18px!important;gap:4px!important}
  }
`;
document.head.appendChild(jankarBrandStyle);

render();
