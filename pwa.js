// تسجيل الـ service worker + نافذة تثبيت التطبيق على الشاشة الرئيسية
(function(){
  if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
  const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const DKEY='pwa_dismissed',IKEY='pwa_installed';
  try{ if(standalone){localStorage.setItem(IKEY,'1');return;} if(localStorage.getItem(IKEY)) return; }catch(e){}
  const ua=navigator.userAgent;
  const isIOS=/iphone|ipad|ipod/i.test(ua)&&!window.MSStream;
  const iosSafari=isIOS&&!/crios|fxios|edgios/i.test(ua);
  let dp=null,shown=false;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function recentlyDismissed(){try{return Date.now()-(+localStorage.getItem(DKEY)||0)<7*864e5;}catch(e){return false;}}
  function schedule(){ if(recentlyDismissed()) return; setTimeout(show,4000); }
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;schedule();});
  window.addEventListener('appinstalled',()=>{try{localStorage.setItem(IKEY,'1');}catch(e){} hide();});
  if(iosSafari) window.addEventListener('load',schedule);

  function hide(){const el=document.getElementById('pwa-sheet');if(el){el.classList.remove('in');setTimeout(()=>el.remove(),300);}}
  function dismiss(){try{localStorage.setItem(DKEY,String(Date.now()));}catch(e){} hide();}
  async function install(){
    if(!dp) return;
    dp.prompt();
    const r=await dp.userChoice.catch(()=>({}));
    dp=null;
    if(r.outcome==='accepted'){try{localStorage.setItem(IKEY,'1');}catch(e){} hide();} else dismiss();
  }
  function show(){
    if(shown||document.getElementById('pwa-sheet')) return;
    if(!dp&&!iosSafari) return;
    shown=true;
    const S=window.SITE||{}, name=esc(S.site_name||'إيجاري'), logo=esc(S.logo_url||'icon-192.png');
    const st=document.createElement('style');
    st.textContent=`#pwa-sheet{position:fixed;inset:0;z-index:99999;display:flex;align-items:flex-end;justify-content:center;background:rgba(15,23,42,0);transition:background .3s;direction:rtl;font-family:inherit}
#pwa-sheet.in{background:rgba(15,23,42,.55)}
#pwa-card{width:100%;max-width:460px;background:var(--bg2,#fff);color:var(--text,#1a202c);border-radius:22px 22px 0 0;padding:22px 20px calc(20px + env(safe-area-inset-bottom,0px));transform:translateY(100%);transition:transform .35s cubic-bezier(.2,.8,.2,1);box-shadow:0 -10px 40px rgba(0,0,0,.25)}
#pwa-sheet.in #pwa-card{transform:none}
#pwa-card .pw-h{display:flex;align-items:center;gap:14px;margin-bottom:14px}
#pwa-card .pw-i{width:64px;height:64px;border-radius:16px;object-fit:contain;box-shadow:0 4px 14px rgba(79,70,229,.35);flex-shrink:0}
#pwa-card .pw-t{font-size:18px;font-weight:800;line-height:1.4}
#pwa-card .pw-s{font-size:13px;opacity:.7;margin-top:2px}
#pwa-card ul{list-style:none;margin:0 0 16px;padding:0;font-size:14px;line-height:2}
#pwa-card li:before{content:"✓";color:#16a34a;font-weight:800;margin-left:8px}
#pwa-card .pw-b{display:flex;gap:10px}
#pwa-card button{flex:1;border:0;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit}
#pwa-card .pw-y{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff}
#pwa-card .pw-n{background:transparent;color:inherit;opacity:.7;flex:0 0 38%}
#pwa-card .pw-ios{font-size:14px;line-height:2;background:rgba(79,70,229,.08);border-radius:12px;padding:10px 14px;margin-bottom:14px}`;
    const sh=document.createElement('div');sh.id='pwa-sheet';
    sh.innerHTML=`<div id="pwa-card" role="dialog" aria-label="تثبيت التطبيق">
<div class="pw-h"><img class="pw-i" src="${logo}" alt=""><div><div class="pw-t">ثبّت ${name} على شاشتك</div><div class="pw-s">افتحه بضغطة واحدة مثل أي تطبيق</div></div></div>
<ul><li>وصول أسرع من الشاشة الرئيسية</li><li>يفتح بملء الشاشة بدون شريط المتصفح</li><li>مجاني ولا يستهلك مساحة تُذكر</li></ul>
${iosSafari&&!dp?'<div class="pw-ios">1) اضغط زر المشاركة <b>⬆️</b> أسفل المتصفح<br>2) اختر <b>«إضافة إلى الشاشة الرئيسية»</b><br>3) اضغط <b>إضافة</b></div><div class="pw-b"><button class="pw-y" id="pw-ok">فهمت</button></div>':'<div class="pw-b"><button class="pw-y" id="pw-ok">تثبيت الآن</button><button class="pw-n" id="pw-no">ليس الآن</button></div>'}
</div>`;
    document.head.appendChild(st);document.body.appendChild(sh);
    requestAnimationFrame(()=>requestAnimationFrame(()=>sh.classList.add('in')));
    sh.addEventListener('click',e=>{if(e.target===sh)dismiss();});
    document.getElementById('pw-ok').onclick=()=>{ if(dp) install(); else dismiss(); };
    const no=document.getElementById('pw-no'); if(no) no.onclick=dismiss;
  }
  window.installApp=()=>{try{localStorage.removeItem(DKEY);}catch(e){} shown=false; show();};
})();
