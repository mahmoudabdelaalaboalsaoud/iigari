// رابط مشاركة وحدة: يعرض معاينة (صورة + عنوان) في فيسبوك وواتساب ثم يحوّل الزائر للمعرض
const SB='https://ovhyefrscxqniaeeomiq.supabase.co';
const KEY='sb_publishable_IZOI-f85WV6ScLaOfykMmA_Z05hGHdM';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports=async(req,res)=>{
  const id=String((req.query&&req.query.u)||'').replace(/[^0-9a-fA-F-]/g,'');
  const origin='https://'+(req.headers.host||'iigari.vercel.app');
  let title='إيجاري — عقارات للإيجار',desc='تصفّح العقارات المتاحة للإيجار وسجّل طلبك',img=origin+'/icon-512.png';
  if(id){
    try{
      const r=await fetch(`${SB}/rest/v1/units?id=eq.${id}&is_listed=eq.true&select=unit_number,rent_price,listing_price,area_sqm,properties(name,address,governorate,city,district,images)`,{headers:{apikey:KEY,Authorization:'Bearer '+KEY}});
      const u=(await r.json())[0];
      if(u){
        const p=u.properties||{},price=u.listing_price||u.rent_price;
        title=(p.name||'عقار للإيجار')+(u.unit_number?' — وحدة '+u.unit_number:'');
        desc=[[p.governorate,p.city,p.district].filter(Boolean).join(' — '),u.area_sqm?u.area_sqm+' م²':'',price?Number(price).toLocaleString('en-US')+' جنيه شهريًا':''].filter(Boolean).join(' • ')||desc;
        if(p.images&&p.images[0]) img=p.images[0];
      }
    }catch(e){}
  }
  const dest=origin+'/listings.html'+(id?'?u='+id:'');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600');
  res.end(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>${esc(title)}</title>
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:image" content="${esc(img)}"><meta property="og:url" content="${esc(origin+'/api/share?u='+id)}"><meta property="og:locale" content="ar_AR">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:image" content="${esc(img)}">
<meta http-equiv="refresh" content="0;url=${esc(dest)}"></head><body><script>location.replace(${JSON.stringify(dest)})</script><a href="${esc(dest)}">فتح العقار</a></body></html>`);
};
