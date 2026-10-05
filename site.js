// إعدادات الموقع (الاسم / الشعار / السلوجان / الخاتمة) — مشتركة بين الصفحتين
function applySite(S){
  if(!S) return;
  window.SITE=S;
  const name=S.site_name||'إيجاري';
  document.querySelectorAll('.l-name,.tb-name,.logo-name').forEach(e=>e.textContent=name);
  document.querySelectorAll('.footer-logo').forEach(e=>e.textContent='● '+name);
  document.querySelectorAll('.l-sub,.footer-sub').forEach(e=>e.textContent=S.slogan||'');
  window._T0=window._T0||document.title;
  document.title=window._T0.replace('إيجاري',name);
  if(S.logo_url){
    document.querySelectorAll('.l-icon,.tb-icon,.logo-icon').forEach(e=>{
      e.style.background='transparent';e.textContent='';
      const im=document.createElement('img');im.src=S.logo_url;im.alt=name;
      im.style.cssText='width:100%;height:100%;object-fit:contain;border-radius:inherit';e.appendChild(im);
    });
    let ic=document.querySelector('link[rel="icon"]');
    if(!ic){ic=document.createElement('link');ic.rel='icon';document.head.appendChild(ic);}
    ic.href=S.logo_url;
  }
  document.querySelectorAll('.footer').forEach(f=>{
    let n=f.querySelector('.footer-note');
    if(!n){n=document.createElement('div');n.className='footer-note';n.style.cssText='margin-top:8px;font-size:12px;opacity:.8;line-height:1.7';f.appendChild(n);}
    n.textContent=S.footer_text||'';
  });
  try{localStorage.setItem('site_cfg',JSON.stringify(S));}catch(e){}
}
async function loadSite(client){
  const{data}=await client.from('site_settings').select('*').eq('id',1).maybeSingle();
  if(data) applySite(data);
}
document.addEventListener('DOMContentLoaded',()=>{
  try{const c=JSON.parse(localStorage.getItem('site_cfg')||'null');if(c)applySite(c);}catch(e){}
});
