// المساعد الآلي لإيجاري — يرد على الأسئلة الشائعة بمطابقة الكلمات المفتاحية (بدون تكلفة)
(function(){
'use strict';
const N=s=>String(s||'').toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^\u0621-\u064Aa-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S=()=>window.SITE||{};
const ctx=()=>{try{return Object.assign({page:'gallery',loggedIn:false,role:'visitor',plan:'free'},(window.assistantCtx&&window.assistantCtx())||{});}catch(e){return{page:'gallery',loggedIn:false,role:'visitor',plan:'free'};}};
const WA=()=>S().wa_number||'201015726786';
const support=(t)=>({t:'💬 تواصل مع الدعم على واتساب',wa:t||'السلام عليكم، محتاج مساعدة في إيجاري'});
const PLANS_TXT='• مجانية: عقار واحد\n• باقة 3 عقارات: 300 جنيه / شهر\n• باقة 5 عقارات: 500 جنيه / شهر\n• باقة أكثر من 5 عقارات: 700 جنيه / شهر';

// ───── قاعدة المعرفة ─────
const KB=[
{id:'hi',t:'تحية',k:['السلام عليكم','سلام عليكم','ازيك','اهلا','مرحبا','هاي','صباح الخير','مساء الخير','hello','hi'],a:'أهلاً بيك! 🌹 اسألني عن أي حاجة في إيجاري، أو اختار من الاقتراحات تحت.'},
{id:'thx',t:'شكر',k:['شكرا','متشكر','تسلم','جزاك الله','ميرسي','thanks','بارك الله'],a:'العفو! 🌹 لو احتجت أي حاجة تانية أنا موجود.'},
{id:'who',t:'مين انت',k:['انت مين','مين انت','انت ايه','انت بشر','انت روبوت','انت بوت','ذكاء اصطناعي','مساعد'],a:'أنا المساعد الآلي لإيجاري 🤖 بجاوب على الأسئلة الشائعة وبرشدك لاستخدام التطبيق. لو سؤالك محتاج حد من الفريق، بوصّلك بالدعم على واتساب.',act:[support()]},
{id:'about',t:'ما هو إيجاري',k:['ايه هو ايجاري','ايجاري ايه','ايجاري يعني','ما هو ايجاري','المنصه دي','فايده التطبيق','بيعمل ايه','بتعمل ايه','عن التطبيق','شرح التطبيق'],a:'إيجاري منصة لإدارة العقارات والإيجارات 🏠\n• **للمالك:** عقاراتك ووحداتك والعقود والتحصيل بالأشهر وطلبات العملاء.\n• **للباحث عن سكن:** معرض عقارات متاحة للإيجار بالفلاتر والخريطة، وتتواصل مع صاحب العقار.\nأول عقار **مجاني**.',act:[{t:'🏠 افتح المعرض',href:'listings.html'}]},
{id:'reg',t:'إنشاء حساب',k:['اسجل','تسجيل حساب','اعمل حساب','انشاء حساب','حساب جديد','ازاي ادخل','ازاي اسجل','عايز اسجل','اعمل اكونت','اكونت'],a:'للتسجيل: اضغط «حساب جديد»، واختار هل أنت 🏢 **مالك عقار** ولا 🔎 **باحث عن عقار**، واكتب الاسم ورقم الموبايل والإيميل وكلمة مرور (8 أحرف على الأقل). أو كمّل بحساب جوجل.\n• المالك بالإيميل بيستنى موافقة الإدارة، وبجوجل بيدخل فورًا.\n• الباحث عن عقار حسابه بيتفعّل فورًا.',act:[{t:'🔐 صفحة التسجيل',href:'iigari.html'}]},
{id:'login',t:'مشكلة في الدخول',k:['مش عارف ادخل','مش قادر ادخل','بيانات غير صحيحه','كلمه المرور غلط','نسيت كلمه','نسيت الباسورد','نسيت الباسوورد','نسيت باسورد','نسيت الرقم السري','استرجاع الحساب','مش بيدخل','مشكله في الدخول'],a:'لو بيانات الدخول غلط: اتأكد من الإيميل وكلمة المرور. ولو سجلت بجوجل ادخل بزرار «متابعة بـ Google».\nلو نسيت كلمة المرور حاليًا كلّم الدعم وهنساعدك في استرجاع حسابك.',act:[support('السلام عليكم، مش قادر أدخل على حسابي في إيجاري')]},
{id:'pending',t:'انتظار الموافقة',k:['انتظار الموافقه','منتظر موافقه','موافقه المسؤول','حسابي معلق','مش مفعل','لسه مش مفعل','حسابي pending','حسابي اتفعل','اتفعل حسابي','متى يتفعل'],a:'«انتظار الموافقة» معناها إن الإدارة بتراجع حسابك كمالك (ده بيحصل للتسجيل بالإيميل)، والتفعيل بيتم في أقرب وقت. التسجيل بجوجل بيدخل فورًا.\nلو اتأخر كلّم الدعم واذكر إيميلك.',act:[support('السلام عليكم، حسابي في إيجاري منتظر الموافقة')]},
{id:'addprop',t:'إضافة عقار',k:['اضيف عقار','اضافه عقار','عقار جديد','اضافه عقار جديد','اضيف عماره','اضيف فيلا','اضيف شقه','اسجل عقار','انشاء عقار','ضيف عقار','اضيف عقاري'],a:'لإضافة عقار: من «عقاراتي» اضغط **+ إضافة عقار**، واكتب الاسم والنوع والعنوان، واختار المحافظة والمدينة والحي، وحدّد الموقع على الخريطة، وأضف صور (حتى 6)، ثم **حفظ**.\n• بيت/شقة/محل/أرض/مكتب/مخزن: بتتعمل لها وحدة تلقائيًا.\n• عمارة/فيلا: اضغط «عرض الوحدات» وأضف الوحدات.',act:[{t:'➕ إضافة عقار الآن',fn:'openAddBuilding',app:1}]},
{id:'addunit',t:'إضافة وحدة',k:['اضيف وحده','اضافه وحده','وحده جديده','عرض الوحدات','ضيف وحده','اضيف شقه جوه العماره','وحدات العماره','اسجل وحده','اضافه وحدات','اضيف وحدات','وحدات جديده'],a:'الوحدات بتتضاف من كارت العقار ← «عرض الوحدات» ← إضافة وحدة: رقم الوحدة والطابق والمساحة والإيجار، والحالة (فارغة / مؤجرة). ولو مؤجرة بتكتب بيانات المستأجر والعقد.',act:[{t:'🏢 عقاراتي',nav:'buildings',app:1}]},
{id:'units0',t:'ليه الفيلا مفيهاش وحدات',k:['الفيلا مفيهاش وحدات','لازم اضيف وحدات','ليه وحدات','وحده الفيلا','الوحدات صفر','الوحدات 0','مفيش وحدات','ليه لازم وحده'],a:'التأجير والعقود والدفعات والعرض في المعرض كلها بتتم على **الوحدات**. أنواع بيت/شقة/محل/أرض/مكتب/مخزن بتتعمل لها وحدة تلقائيًا، أما العمارة والفيلا فاضغط «عرض الوحدات» وأضف وحدة (مثلاً «الفيلا كاملة»).'},
{id:'listit',t:'عرض وحدتي في المعرض',k:['اعرض وحدتي','اعرض عقاري','عرض في المعرض','اظهر في المعرض','انشر عقاري','اعلن','اعلان','اعرضها للايجار','يظهر في المعرض','ازاي يظهر عقاري','اعرض الوحده','وحدتي مش ظاهره','عقاري مش ظاهر','مش ظاهر في المعرض','اعرض شقتي','انزل اعلان'],a:'عشان وحدتك تظهر في المعرض العام: افتح الوحدة (تعديل) ← خانة «عرض في صفحة الإيجارات العامة؟» ← **نعم**، ولازم الحالة تكون **فارغة**.\nوعشان تظهر بشكل أفضل: أضف صور للعقار وحدد موقعه على الخريطة.\nلو وحدتك مش ظاهرة: اتأكد إن حالتها فارغة وإن العرض «نعم».'},
{id:'photos',t:'صور العقار',k:['اضيف صور','ارفع صور','رفع الصور','صوره العقار','الصور مش بتترفع','صوره الغلاف','صور العقار','صوره للعقار','غلاف'],a:'من «تعديل بيانات العقار والموقع» ← قسم 📷 **صور العقار** ← «+ إضافة صور» (حتى 6 صور). اضغط على أي صورة لتبقى **الغلاف**، و✕ لحذفها. الصور بتتصغّر تلقائيًا قبل الرفع.\nلو الرفع فشل: اتأكد إن حسابك مفعّل وإن النت شغال.'},
{id:'map',t:'تحديد الموقع',k:['الخريطه','حدد الموقع','تحديد الموقع','لوكيشن','الموقع على الخريطه','موقع العقار','دبوس','اضيف الموقع','حدد موقع'],a:'من «تعديل بيانات العقار والموقع»: اختار المحافظة والمدينة والحي (أو اكتبهم يدويًا من «أخرى»)، وبعدين اضغط على الخريطة أو اسحب الدبوس، أو استخدم «📍 موقعي الحالي». وبعد الحفظ بيظهر العقار للباحثين على الخريطة.'},
{id:'editprop',t:'تعديل أو حذف عقار',k:['اعدل عقار','تعديل عقار','احذف عقار','حذف عقار','مسح عقار','غير اسم العقار','اعدل بيانات العقار','امسح عقار','تعديل بيانات العقار'],a:'من «عقاراتي» اضغط **📍 تعديل بيانات العقار والموقع** على الكارت لتعديل الاسم والعنوان والمكان والصور.\nللحذف: زرار 🗑️ على الكارت، وبيحذف الوحدات والعقود والمدفوعات التابعة له ولا يمكن التراجع.',act:[{t:'🏢 عقاراتي',nav:'buildings',app:1}]},
{id:'contracts',t:'العقود',k:['العقود','اعمل عقد','تاجير وحده','اجر وحده','مستاجر جديد','ضيف مستاجر','بيانات المستاجر','انهاء العقد','انهي العقد','تعديل العقد','تجديد العقد','عقد ايجار','اجر شقتي'],a:'العقد بيتكوّن لما تأجّر وحدة: افتح الوحدة ← الحالة «مؤجرة» ← اكتب اسم المستأجر وتليفونه والرقم القومي وتاريخ بداية ونهاية العقد والإيجار المتفق عليه.\nمن صفحة «العقود» تشوف المدة المتبقية، وتعدّل ✏️ أو تنهي العقد (بيفرّغ الوحدة).',act:[{t:'📄 العقود',nav:'contracts',app:1}]},
{id:'pay',t:'تسجيل دفعة',k:['اسجل دفعه','تسجيل دفعه','التحصيل','حصلت ايجار','قبضت','اسجل ايجار','سداد','المتبقي','دفعه جديده','استلمت الايجار','تسجيل ايجار','دفعه ايجار','سجل دفعه'],a:'من «التحصيل» ← **+ تسجيل دفعة**: اختار الوحدة المؤجرة، والشهر اللي الدفعة عنه (بيتقترح أقدم شهر لسه ما اتسدّش)، والمبلغ والتاريخ.\nقبل الحفظ بيظهر تنبيه بـ **المتبقي** من إيجار الشهر أو **الزيادة**. وتقدر تعدّل ✏️ أو تحذف 🗑️ أي دفعة.',act:[{t:'💳 التحصيل',nav:'payments',app:1}]},
{id:'paylist',t:'الوحدة مش ظاهرة في التحصيل',k:['الوحده مش بتظهر في الدفع','مش لاقي الوحده في التحصيل','اختر وحده مؤجره','قائمه الوحدات فاضيه','مفيش وحدات للدفع','مش لاقي الوحده'],a:'قائمة التحصيل بتعرض الوحدات **المؤجرة** فقط. اتأكد إن حالة الوحدة «مؤجرة» وفيها بيانات المستأجر.'},
{id:'leads',t:'العملاء المهتمين',k:['العملاء المهتمين','طلبات الايجار','الطلبات','عملاء','استفسارات','وصلني طلب','حد بعت طلب','المهتمين','ازاي اشوف الطلبات','طلبات العملاء'],a:'طلبات المهتمين بوحداتك بتظهر في «العملاء»: الاسم والتليفون والإيميل والوحدة. اضغط 💬 **واتساب** (برسالة جاهزة) أو 📞 اتصال، وغيّر الحالة (جديد ← تم التواصل ← مغلق). وبتشوف دايرة حمراء بعدد الطلبات الجديدة.',act:[{t:'📨 العملاء',nav:'leads',app:1}]},
{id:'dash',t:'لوحة التحكم',k:['الاشغال','نسبه الاشغال','المتاخرات','ايرادات الشهر','لوحه التحكم','الاحصائيات','ايرادات'],a:'لوحة التحكم بتعرض إجمالي العقارات والوحدات، ونسبة الإشغال، وإيرادات الشهر، والمتأخرات، وحالة الوحدات.',act:[{t:'📊 لوحة التحكم',nav:'dash',app:1}]},
{id:'plans',t:'الباقات والأسعار',k:['الباقات','باقات','الاسعار','سعر الاشتراك','اشتراك','كام الاشتراك','تكلفه','مجاني','المجانيه','رسوم','بكام','اسعار الباقات','الاشتراكات','الباقه'],a:(c)=>`باقات إيجاري:\n${PLANS_TXT}\n\n${c.loggedIn&&c.plan?`باقتك الحالية: **${({free:'مجانية',p3:'باقة 3 عقارات',p5:'باقة 5 عقارات',pro:'باقة أكثر من 5 عقارات'})[c.plan]||'مجانية'}**.\n`:''}الوحدات داخل كل عقار غير محدودة.`,act:[{t:'📦 باقتي',fn:'openPlans',app:1}]},
{id:'upgrade',t:'الترقية والدفع',k:['ارقي','ترقيه','رقي باقتي','اجدد','تجديد الاشتراك','ادفع ازاي','طرق الدفع','فودافون كاش','انستاباي','تحويل','ادفع','الدفع','فعل الباقه','اتفعل الاشتراك','اشترك في باقه'],a:(c)=>{const s=S();return`للاشتراك أو الترقية:\n1) افتح «باقتي» واختار الباقة.\n2) اضغط «اطلب الاشتراك عبر واتساب» (رسالة جاهزة بالباقة).\n3) حوّل المبلغ ${s.vf_number?`على فودافون كاش **${esc(s.vf_number)}**`:'على فودافون كاش'}${s.instapay_link?' أو إنستاباي (الرابط في «باقتي»)':' أو إنستاباي'}.\n4) ابعت سكرين شوت التحويل وهنفعّل باقتك.`;},act:[{t:'📦 باقتي',fn:'openPlans',app:1},support('السلام عليكم، عايز أشترك في باقة في إيجاري')]},
{id:'limit',t:'وصلت للحد الأقصى',k:['وصلت للحد','الحد الاقصى','مش قادر اضيف عقار','مش بيسمح اضيف','باقتي خلصت','لا استطيع اضافه','مش راضي يضيف عقار','ارفع باقتي','+مش قادر اضيف','+مش بيضيف','+ما اقدرش اضيف','+مش راضي اضيف'],a:'ده معناه إن باقتك الحالية وصلت لأقصى عدد عقارات. افتح «باقتي» واختار باقة أكبر وكلّمنا على واتساب لتفعيلها.',act:[{t:'📦 باقتي',fn:'openPlans',app:1}]},
{id:'search',t:'البحث عن عقار',k:['ادور على عقار','ابحث عن','دور على شقه','عايز شقه','عايز اجر','اجار شقه','ازاي ادور','فلتر','فلاتر','ابحث','بحث','ادور علي','عايز استاجر','شقه للايجار','محل للايجار','فيلا للايجار'],a:'في المعرض: استخدم مربع البحث، وأزرار 📍 **المكان** (محافظة ← مدينة ← حي) و💰 **السعر** و🏠 **النوع**. وفيه 📍 «القريب مني» بيرتب بالأقرب، و🗺️ «الخريطة» تشوف العقارات عليها.',act:[{t:'🏠 افتح المعرض',href:'listings.html'}]},
{id:'near',t:'القريب مني',k:['القريب مني','قريب مني','جنبي','حولي','عقارات قريبه','اقرب','قريبه مني'],a:'اضغط «📍 القريب مني» واسمح للمتصفح بتحديد موقعك، وهيرتب العقارات من الأقرب ويعرض المسافة، وتقدر تحدد نطاق (5 / 10 / 25 / 50 كم).\nلو ما اشتغلش: اتأكد إن الـ GPS شغال وإنك سمحت للموقع للمتصفح.'},
{id:'contact',t:'التواصل مع صاحب العقار',k:['اتواصل مع صاحب العقار','اكلم صاحب','اتواصل','اطلب الايجار','سجل طلبك','احجز','عايز اتواصل','رقم صاحب العقار','رقم المالك','تليفون صاحب','اقدم طلب','اقدم على','ازاي اطلب','عايز احجز','كلم صاحب العقار'],a:'افتح العقار واضغط **«📋 سجل طلبك»**. لازم يكون عندك حساب (بيتعمل في ثواني ومعاه رقمك)، وبتكتب ملاحظاتك ويوصل الطلب لصاحب العقار وهيتواصل معاك على رقمك.\nمش بنعرض رقم المالك علنًا لحمايته.'},
{id:'noreply',t:'محدش رد',k:['مش رد','محدش رد','اتاخر الرد','مفيش رد','صاحب العقار مردش','الطلب اتبعت','لسه محدش كلمني','مردش'],a:'طلبك وصل لصاحب العقار وهيتواصل معاك على رقمك. لو اتأخر الرد ممكن تبعت طلب لعقار تاني مشابه، أو كلمنا على واتساب ونساعدك.',act:[support('السلام عليكم، بعتّ طلب إيجار ولسه محدش تواصل معايا')]},
{id:'reqfail',t:'الطلب مش بيتبعت',k:['الطلب مش بيتبعت','مش قادر ابعت طلب','خطا في الطلب','الطلب فشل','لم يعد متاح','لقد ارسلت طلبا','مش بيبعت الطلب'],a:'تأكد إن: اسمك مكتوب، ورقم هاتفك صحيح (10 أرقام على الأقل)، والنت شغال.\n• «أرسلت طلبًا من قبل»: يبقى طلبك السابق وصل بالفعل.\n• «لم يعد متاحًا»: صاحب العقار أخفاه أو اتأجّر.'},
{id:'share',t:'مشاركة عقار',k:['اشارك','مشاركه','شير','ابعت العقار','رابط العقار','لينك العقار','انشر على الفيس','شارك العقار','لينك'],a:'افتح تفاصيل العقار واضغط **«🔗 مشاركة»**: بيفتح قائمة المشاركة (واتساب، فيسبوك…) أو بينسخ الرابط. الرابط بيظهر ببطاقة فيها صورة العقار والاسم والمكان والسعر.'},
{id:'install',t:'تثبيت التطبيق',k:['اثبت التطبيق','تثبيت التطبيق','نزل التطبيق','تحميل التطبيق','تطبيق على الموبايل','اضيف على الشاشه','الشاشه الرئيسيه','ازاي انزل','اندرويد','ايفون','apk','ثبت'],a:'تثبيت إيجاري على موبايلك:\n• **أندرويد (كروم):** اضغط «تثبيت الآن» في النافذة اللي بتظهر، أو القائمة ⋮ ← «إضافة إلى الشاشة الرئيسية».\n• **آيفون (سفاري):** زرار المشاركة ⬆️ ← «إضافة إلى الشاشة الرئيسية».\nبعدها بتفتحه من أيقونة زي أي تطبيق.',act:[{t:'📲 ثبّت الآن',fn:'installApp'}]},
{id:'logout',t:'تسجيل الخروج',k:['تسجيل الخروج','اخرج','لوج اوت','logout','اطلع من الحساب','اخرج من الحساب','+اسجل خروج','+سجل خروج','+تسجيل خروج','+خروج من الحساب'],a:(c)=>c.page==='app'?'اضغط على صورتك أعلى الصفحة ← «تسجيل الخروج».':'اضغط «👤 خروج» أعلى صفحة المعرض.'},
{id:'dark',t:'الوضع الليلي',k:['الوضع الليلي','دارك','وضع داكن','ثيم','الوضع المظلم','الوضع الليلى'],a:'اضغط أيقونة 🌙 أعلى التطبيق لتبديل الوضع الليلي.'},
{id:'privacy',t:'الخصوصية وحذف الحساب',k:['احذف حسابي','مسح حسابي','حذف حسابي','بياناتي','خصوصيه','امان','البيانات امنه','حمايه البيانات','احذف بياناتي'],a:'بياناتك محمية: كل مالك بيشوف بياناته فقط، وبيانات المستأجرين ما بتظهرش للعامة. لطلب حذف حسابك أو بياناتك كلّم الدعم على واتساب.',act:[support('السلام عليكم، عايز أحذف حسابي وبياناتي من إيجاري')]},
{id:'support',t:'التواصل مع الدعم',k:['الدعم','دعم فني','كلم حد','اكلم حد','خدمه العملاء','واتساب','عندي مشكله','بلاغ','شكوى','تواصل معاكم','رقمكم','اتصل بيكم','مساعده بشريه','موظف','مشكله'],a:'تقدر تتواصل مع الدعم مباشرة على واتساب 👇',act:[support()]}
];

// ───── المطابقة ─────
let custom=[];
function prep(e){e.nk=(e.k||[]).map(x=>{const st=String(x).charAt(0)==='+';const kw=N(st?String(x).slice(1):x);return kw?{kw,st}:null;}).filter(Boolean);return e;}
KB.forEach(prep);
function weight(kw,st){return st?5:kw.indexOf(' ')>-1?3:(kw.length>=5?2:1);}
function scoreEntry(q,e){
  let s=0;
  for(const {kw,st} of e.nk){
    const hit=kw.length<=3?q.indexOf(' '+kw+' ')>-1:q.indexOf(kw)>-1;
    if(hit) s+=weight(kw,st);
    if(q.trim()===kw) s+=3;
  }
  return s;
}
function match(question){
  const q=' '+N(question)+' ';
  const all=custom.concat(KB);
  const sc=all.map(e=>({e,s:scoreEntry(q,e)+(e.custom&&scoreEntry(q,e)>0?2:0)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
  if(!sc.length||sc[0].s<2) return null;
  return{best:sc[0].e,score:sc[0].s,alt:sc.slice(1,3).filter(x=>x.s>=2&&x.s>=sc[0].s-1).map(x=>x.e)};
}
window.__assist={match,N,KB,setCustom(list){custom=list.map(prep);}};

// ───── الواجهة ─────
let panel,msgsEl,inp,chipsEl,btn,hist=[],busy=false;
function fmt(t){
  let h=esc(t).replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
  return h.replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
}
function chipsFor(c){
  if(c.page==='app'&&c.loggedIn) return[['إزاي أضيف عقار؟'],['إزاي أسجل دفعة؟'],['الباقات والأسعار'],['إزاي أعرض وحدتي في المعرض؟'],['إزاي أتابع طلبات العملاء؟']];
  if(c.page==='app') return[['إزاي أعمل حساب؟'],['مش عارف أدخل'],['الباقات والأسعار'],['إيه هو إيجاري؟']];
  return[['إزاي أدور على عقار؟'],['إزاي أتواصل مع صاحب العقار؟'],['إزاي أثبت التطبيق؟'],['إزاي أعمل حساب؟'],['إيه هو إيجاري؟']];
}
function css(){
  if(document.getElementById('asst-css')) return;
  const st=document.createElement('style');st.id='asst-css';
  st.textContent=`#asst-btn{position:fixed;left:14px;bottom:var(--asst-b,18px);z-index:7000;width:56px;height:56px;border-radius:50%;border:0;padding:0;background:linear-gradient(135deg,#4f46e5,#7c3aed);box-shadow:0 8px 24px rgba(79,70,229,.5);cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;opacity:0;transform:scale(.6);transition:opacity .35s,transform .35s cubic-bezier(.2,.9,.3,1.3)}
#asst-btn.show{opacity:1;transform:none}
#asst-btn:active{transform:scale(.92)}
#asst-btn svg{width:31px;height:31px;position:relative}
#asst-btn:before{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid rgba(124,58,237,.6);animation:aspl 2.6s ease-out infinite;pointer-events:none}
@keyframes aspl{0%{transform:scale(1);opacity:.85}100%{transform:scale(1.65);opacity:0}}
#asst-btn .dot{position:absolute;top:1px;right:1px;width:13px;height:13px;border-radius:50%;background:#22c55e;border:2.5px solid #fff}
#asst-tip{position:fixed;left:80px;bottom:calc(var(--asst-b,18px) + 8px);z-index:7000;background:#fff;color:#1a202c;border-radius:16px 16px 16px 4px;padding:9px 14px;font-size:13px;font-weight:700;box-shadow:0 6px 22px rgba(15,23,42,.22);direction:rtl;font-family:inherit;max-width:190px;line-height:1.6;animation:astip .4s ease-out}
@keyframes astip{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
#asst{position:fixed;inset:0;z-index:9500;display:none;align-items:flex-end;justify-content:flex-start;background:rgba(15,23,42,.45);direction:rtl;font-family:inherit}
#asst.open{display:flex}
#asst .card{width:100%;max-width:420px;height:min(82vh,600px);background:var(--bg2,#fff);color:var(--text,#1a202c);border-radius:20px 20px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -8px 40px rgba(0,0,0,.3)}
@media(min-width:600px){#asst{background:transparent;pointer-events:none;padding:16px}#asst .card{pointer-events:auto;border-radius:18px;box-shadow:0 10px 50px rgba(0,0,0,.35)}}
#asst .hd{display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff}
#asst .hd img{width:38px;height:38px;border-radius:10px;background:#fff;object-fit:contain}
#asst .hd .t{flex:1;line-height:1.3}#asst .hd .t b{font-size:15px}#asst .hd .t small{display:block;font-size:11px;opacity:.85}
#asst .hd button{border:0;background:rgba(255,255,255,.2);color:#fff;border-radius:50%;width:32px;height:32px;font-size:16px;cursor:pointer}
#asst .ms{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;-webkit-overflow-scrolling:touch}
#asst .b{max-width:86%;padding:9px 12px;border-radius:14px;font-size:14px;line-height:1.8;word-wrap:break-word}
#asst .b.bot{background:rgba(79,70,229,.09);align-self:flex-start;border-top-right-radius:4px}
#asst .b.usr{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;align-self:flex-end;border-top-left-radius:4px}
#asst .b a{color:inherit;text-decoration:underline}
#asst .acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#asst .acts button,#asst .acts a{border:1.5px solid #4f46e5;color:#4f46e5;background:#fff;border-radius:14px;padding:5px 11px;font-size:12.5px;font-weight:700;cursor:pointer;text-decoration:none;font-family:inherit}
#asst .acts .wa{border-color:#25d366;color:#16a34a}
#asst .fb{margin-top:6px;font-size:12px;opacity:.7}#asst .fb button{border:0;background:transparent;cursor:pointer;font-size:14px}
#asst .typing{display:flex;gap:4px;padding:12px}#asst .typing i{width:7px;height:7px;border-radius:50%;background:#7c3aed;opacity:.4;animation:asb 1s infinite}
#asst .typing i:nth-child(2){animation-delay:.15s}#asst .typing i:nth-child(3){animation-delay:.3s}
@keyframes asb{0%,100%{transform:translateY(0);opacity:.3}50%{transform:translateY(-4px);opacity:1}}
#asst .chips{display:flex;gap:6px;overflow-x:auto;padding:6px 12px;scrollbar-width:none;white-space:nowrap}
#asst .chips::-webkit-scrollbar{display:none}
#asst .chips button{flex:0 0 auto;border:1.5px solid rgba(79,70,229,.35);background:rgba(79,70,229,.06);color:#4f46e5;border-radius:16px;padding:6px 12px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit}
#asst .in{display:flex;gap:8px;padding:8px 12px calc(10px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(0,0,0,.08)}
#asst .in input{flex:1;border:1.5px solid rgba(0,0,0,.15);border-radius:20px;padding:10px 14px;font-size:16px;font-family:inherit;background:transparent;color:inherit;min-width:0}
#asst .in button{border:0;border-radius:50%;width:42px;height:42px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;font-size:18px;cursor:pointer;flex-shrink:0}`;
  document.head.appendChild(st);
}
function save(){try{sessionStorage.setItem('asst_h',JSON.stringify(hist.slice(-30)));}catch(e){}}
function bubble(m,animate){
  const d=document.createElement('div');d.className='b '+(m.w==='u'?'usr':'bot');
  if(m.w==='u') d.textContent=m.t; else{
    d.innerHTML=fmt(m.t);
    if(m.act&&m.act.length){
      const a=document.createElement('div');a.className='acts';
      m.act.forEach(x=>{
        const el=document.createElement(x.href||x.wa?'a':'button');el.textContent=x.t;
        if(x.wa){el.href='https://wa.me/'+WA()+'?text='+encodeURIComponent(x.wa+(m.q?'\n\n(سؤالي: '+m.q+')':''));el.target='_blank';el.rel='noopener';el.className='wa';}
        else if(x.href){el.href=x.href;}
        else if(x.ask){el.onclick=()=>ask(x.ask);}
        else el.onclick=()=>runAct(x);
        a.appendChild(el);
      });
      d.appendChild(a);
    }
    if(m.fb){const f=document.createElement('div');f.className='fb';f.innerHTML='هل كانت الإجابة مفيدة؟ <button>👍</button><button>👎</button>';
      const b=f.querySelectorAll('button');
      b[0].onclick=()=>{f.textContent='شكرًا لتقييمك 🌹';};
      b[1].onclick=()=>{f.textContent='آسف! جرّب تسأل بصيغة تانية أو كلّم الدعم 🙏';log(m.q,false);};
      d.appendChild(f);}
  }
  msgsEl.appendChild(d);msgsEl.scrollTop=msgsEl.scrollHeight;
}
function runAct(x){
  const c=ctx();
  if(x.nav){
    if(window.goPage&&c.page==='app'&&c.loggedIn){window.goPage(x.nav,document.getElementById('ni-'+x.nav)||null);if(window.setBN)window.setBN(x.nav);close();}
    else{location.href='iigari.html';}
    return;
  }
  if(x.fn){
    const f=window[x.fn];
    if(typeof f==='function'){close();try{f();}catch(e){}}
    else if(x.fn==='installApp'){push({w:'b',t:'التثبيت متاح من متصفح الموبايل (كروم أو سفاري) بالخطوات اللي فوق.'});}
    else location.href='iigari.html';
  }
}
function log(q,answered){
  try{const db=window.ASSIST_DB;if(!db||!q)return;db.from('assistant_log').insert({question:String(q).slice(0,300),page:ctx().page,answered:!!answered}).then(()=>{},()=>{});}catch(e){}
}
function push(m){hist.push(m);save();bubble(m);}
function showChips(){
  const c=ctx();chipsEl.innerHTML='';
  chipsFor(c).forEach(x=>{const b=document.createElement('button');b.textContent=x[0];b.onclick=()=>ask(x[0]);chipsEl.appendChild(b);});
}
function typing(on){
  let t=document.getElementById('asst-typing');
  if(on&&!t){t=document.createElement('div');t.id='asst-typing';t.className='b bot typing';t.innerHTML='<i></i><i></i><i></i>';msgsEl.appendChild(t);msgsEl.scrollTop=msgsEl.scrollHeight;}
  if(!on&&t) t.remove();
}
function answer(q){
  const c=ctx(),r=match(q);
  if(!r){
    log(q,false);
    return{w:'b',q,t:'مش متأكد إني فهمت سؤالك 🤔 جرّب تكتبه بصيغة تانية (مثلاً: «إزاي أضيف عقار؟»)، أو اختار من الاقتراحات، أو كلّم الدعم وهيساعدوك.',act:[support('السلام عليكم، عندي سؤال في إيجاري: '+q)]};
  }
  const e=r.best,a=typeof e.a==='function'?e.a(c):e.a;
  const loggedApp=c.page==='app'&&c.loggedIn;
  let act=(e.act||[]).filter(x=>!x.app||loggedApp);
  if(!act.length&&(e.act||[]).some(x=>x.app)) act=[{t:'🔐 سجّل دخولك أولًا',href:'iigari.html'}];
  r.alt.forEach(x=>act.push({t:'❓ '+x.t,ask:x.t}));
  return{w:'b',q,t:a,act,fb:e.id!=='hi'&&e.id!=='thx'};
}
function ask(q){
  q=String(q||'').trim();if(!q||busy)return;
  push({w:'u',t:q});inp.value='';busy=true;typing(true);
  const m=answer(q);
  setTimeout(()=>{typing(false);
    hist.push(m);save();bubble(m);
    busy=false;},Math.min(1100,450+q.length*8));
}
function greet(){
  const c=ctx();
  const who=c.page==='app'&&c.loggedIn?'أهلاً بيك في إيجاري! 👋 أنا المساعد الآلي، بجاوب على الأسئلة الشائعة وبرشدك خطوة بخطوة.':'أهلاً بيك في إيجاري! 👋 أنا المساعد الآلي، بجاوب على أسئلتك وبرشدك لاستخدام الموقع. اسألني أو اختار من الاقتراحات تحت.';
  return{w:'b',t:who};
}
function open(){
  if(!panel) build();
  panel.classList.add('open');
  const h=panel.querySelector('.hd img');const s=S();h.src=s.logo_url||'icon-192.png';
  if(!msgsEl.children.length){
    if(!hist.length) hist.push(greet());
    hist.forEach(m=>bubble(Object.assign({},m,{fb:false})));
  }
  showChips();setTimeout(()=>{try{inp.focus({preventScroll:true});}catch(e){}},250);
}
function close(){if(panel)panel.classList.remove('open');}
function build(){
  css();
  try{hist=JSON.parse(sessionStorage.getItem('asst_h')||'[]');}catch(e){hist=[];}
  panel=document.createElement('div');panel.id='asst';
  panel.innerHTML=`<div class="card" role="dialog" aria-label="المساعد الآلي"><div class="hd"><img alt=""><div class="t"><b>المساعد الآلي</b><small>بيرد على الأسئلة الشائعة 24 ساعة</small></div><button aria-label="إغلاق">✕</button></div><div class="ms"></div><div class="chips"></div><div class="in"><input type="text" placeholder="اكتب سؤالك هنا..." maxlength="200" enterkeyhint="send"><button aria-label="إرسال">➤</button></div></div>`;
  document.body.appendChild(panel);
  msgsEl=panel.querySelector('.ms');inp=panel.querySelector('input');chipsEl=panel.querySelector('.chips');
  panel.querySelector('.hd button').onclick=close;
  panel.querySelector('.in button').onclick=()=>ask(inp.value);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();ask(inp.value);}});
  panel.addEventListener('click',e=>{if(e.target===panel)close();});
}
async function loadCustom(){
  try{const db=window.ASSIST_DB;if(!db)return;
    const{data}=await db.from('assistant_kb').select('keywords,answer');
    window.__assist.setCustom((data||[]).map(r=>({id:'c',t:'إجابة مخصصة',custom:1,k:String(r.keywords||'').split(/[,،\n]/).map(x=>x.trim()).filter(Boolean),a:r.answer})));
  }catch(e){}
}
window.assistantReload=loadCustom;
function init(){
  if(document.getElementById('asst-btn')) return;
  css();
  btn=document.createElement('button');btn.id='asst-btn';btn.setAttribute('aria-label','المساعد الآلي');
  btn.innerHTML='<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 5C9.4 5 4 9.4 4 14.9c0 2.9 1.5 5.5 3.9 7.3L7 27.5l5.1-2.5c1.2.3 2.5.5 3.9.5 6.6 0 12-4.4 12-9.9S22.6 5 16 5z" fill="#fff"/><circle cx="10.8" cy="15" r="1.7" fill="#6d4ae8"/><circle cx="16" cy="15" r="1.7" fill="#6d4ae8"/><circle cx="21.2" cy="15" r="1.7" fill="#6d4ae8"/><path d="M26 1.5l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#fde68a"/></svg><span class="dot"></span>';
  btn.onclick=()=>{const t=document.getElementById('asst-tip');if(t)t.remove();open();};
  document.body.appendChild(btn);
  const c=ctx();if(c.page==='app') document.documentElement.style.setProperty('--asst-b','86px');
  setTimeout(()=>btn.classList.add('show'),1300);
  let seen=false;try{seen=sessionStorage.getItem('asst_tip');}catch(e){}
  if(!seen){
    setTimeout(()=>{
      if(document.getElementById('asst')&&document.getElementById('asst').classList.contains('open')) return;
      const t=document.createElement('div');t.id='asst-tip';t.textContent='محتاج مساعدة؟ اسألني 👋';
      document.body.appendChild(t);try{sessionStorage.setItem('asst_tip','1');}catch(e){}
      setTimeout(()=>t.remove(),7000);
    },3200);
  }
  setTimeout(loadCustom,1200);
}
Object.assign(window.__assist,{open,ask,close});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
