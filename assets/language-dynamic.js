/* Localize presentation text only; existing account and catalogue behavior is unchanged. */
(() => {
  'use strict';
  const lang = document.documentElement.lang;
  if (!['en','ar'].includes(lang)) return;
  const words = {
    'Şifreler eşleşmiyor.':['Passwords do not match.','كلمتا المرور غير متطابقتين.'],
    'GÖNDERİLİYOR…':['SUBMITTING…','جارٍ الإرسال…'],
    'HESAP OLUŞTUR':['CREATE ACCOUNT','إنشاء حساب'],
    'E-posta doğrulandı':['Email verified','تم التحقّق من البريد الإلكتروني'],
    'Bağlantı geçersiz':['Invalid link','الرابط غير صالح'],
    'Hesabın etkinleştirildi. Artık iWsMMO istemcisinden giriş yapabilirsin.':['Your account is active. You can now sign in through the iWsMMO client.','تم تفعيل حسابك. يمكنك الآن تسجيل الدخول من خلال عميل iWsMMO.'],
    'Doğrulama bağlantısının süresi dolmuş veya bağlantı daha önce kullanılmış olabilir.':['The verification link may have expired or already been used.','قد تكون صلاحية رابط التحقّق انتهت أو سبق استخدامه.'],
    'Sunucuya ulaşılamadı.':['The server could not be reached. Please try again.','تعذّر الاتصال بالخادم. يرجى المحاولة مجددًا.']
  };
  const index = lang === 'en' ? 0 : 1;
  const known = new Set(Object.values(words).map(pair=>pair[index]));
  const failure = lang === 'en' ? 'Registration could not be completed. Check your details and try again.' : 'تعذّر إكمال التسجيل. تحقّق من بياناتك وحاول مجددًا.';
  const success = lang === 'en' ? 'Your account has been created. Complete email verification to activate it.' : 'تم إنشاء حسابك. أكمل التحقّق من البريد الإلكتروني لتفعيله.';
  known.add(failure); known.add(success);
  function update() {
    document.querySelectorAll('#result-count,#register-form button[type="submit"],#register-form .form-status,[data-verify-title],[data-verify-copy]').forEach(node=>{
      const value=node.textContent.trim(); if(!value) return; let result=words[value]?.[index];
      if(node.id==='result-count'){const n=value.match(/\d+/g); if(n?.length===3) result=lang==='en'?`${n[0]} / ${n[1]} system areas · ${n[2]} feature and setting details`:`${n[0]} / ${n[1]} من مجالات الأنظمة · ${n[2]} من تفاصيل المزايا والإعدادات`;}
      if(node.classList.contains('form-status')&&!result&&!known.has(value)) result=node.classList.contains('success')?success:failure;
      if(result&&node.textContent!==result) node.textContent=result;
    });
  }
  update(); new MutationObserver(update).observe(document.body,{subtree:true,childList:true,characterData:true});
})();
