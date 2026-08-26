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
    <span class="jankar-brand-copy">
      <span class="jankar-brand-name"><strong>JANKAR</strong><strong>INDIA</strong></span>
      <span class="jankar-brand-hindi">जानकारी आपका अधिकार</span>
      <span class="jankar-brand-tagline"><b>ASK</b><i></i><b>KNOW</b><i></i><b>EMPOWER</b></span>
    </span>
  </div>`;
};

const jankarBrandStyle=document.createElement('style');
jankarBrandStyle.textContent=`
  .jankar-brand{display:flex!important;align-items:center!important;gap:12px!important;white-space:nowrap!important}
  .jankar-brand img{width:68px!important;height:68px!important;object-fit:contain!important;flex:0 0 68px!important}
  .jankar-brand-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:2px!important;line-height:1!important}
  .jankar-brand-name{display:flex!important;align-items:baseline!important;gap:7px!important;font-size:25px!important;font-weight:900!important;letter-spacing:-0.7px!important;line-height:1!important}
  .jankar-brand-name strong:first-child{color:#082d63!important}
  .jankar-brand-name strong:last-child{color:#0c9a3d!important}
  .jankar-brand-hindi{font-size:12px!important;font-weight:800!important;color:#082d63!important;letter-spacing:.1px!important;margin-top:3px!important}
  .jankar-brand-tagline{display:flex!important;align-items:center!important;gap:5px!important;font-size:8px!important;font-weight:800!important;letter-spacing:1.7px!important;color:#082d63!important;margin-top:3px!important}
  .jankar-brand-tagline i{width:4px!important;height:4px!important;border-radius:50%!important;background:#ff6b00!important;display:inline-block!important}
  .jankar-brand-tagline i:last-of-type{background:#0c9a3d!important}
  @media(max-width:760px){
    .jankar-brand{gap:7px!important}
    .jankar-brand img{width:48px!important;height:48px!important;flex-basis:48px!important}
    .jankar-brand-name{font-size:18px!important;gap:4px!important}
    .jankar-brand-hindi{font-size:9px!important}
    .jankar-brand-tagline{font-size:6px!important;gap:3px!important;letter-spacing:1px!important}
  }
`;
document.head.appendChild(jankarBrandStyle);

render();
