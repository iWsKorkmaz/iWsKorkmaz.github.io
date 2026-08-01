const API_BASE = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:5080'
  : 'https://api.iwsgames.com';

document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });

const registerForm = document.querySelector('#register-form');
if (registerForm) {
  const password = registerForm.elements.password;
  const meter = document.querySelector('.password-meter i');
  password.addEventListener('input', () => {
    const value = password.value;
    let score = Math.min(4, [value.length >= 10, /[a-z]/.test(value), /[A-Z]/.test(value), /\d|[^A-Za-z]/.test(value)].filter(Boolean).length);
    meter.style.width = `${score * 25}%`;
    meter.dataset.score = String(score);
  });

  registerForm.addEventListener('submit', async event => {
    event.preventDefault();
    const status = registerForm.querySelector('.form-status');
    const submit = registerForm.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(registerForm));
    if (data.website) return;
    if (!registerForm.reportValidity()) return;
    if (data.password !== data.passwordConfirmation) {
      status.textContent = 'Şifreler eşleşmiyor.'; status.className = 'form-status error'; return;
    }
    submit.disabled = true; submit.textContent = 'GÖNDERİLİYOR…'; status.textContent = '';
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username: data.username.trim(), email: data.email.trim(), password: data.password, passwordConfirmation: data.passwordConfirmation })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || 'Kayıt işlemi tamamlanamadı.');
      registerForm.reset(); meter.style.width = '0'; status.textContent = result.message; status.className = 'form-status success';
    } catch (error) {
      status.textContent = error.message || 'Sunucuya ulaşılamadı.'; status.className = 'form-status error';
    } finally {
      submit.disabled = false; submit.textContent = 'HESAP OLUŞTUR';
    }
  });
}

const verifyTitle = document.querySelector('[data-verify-title]');
if (verifyTitle) {
  const ok = new URLSearchParams(location.search).get('status') === 'success';
  verifyTitle.textContent = ok ? 'E-posta doğrulandı' : 'Bağlantı geçersiz';
  document.querySelector('[data-verify-copy]').textContent = ok
    ? 'Hesabın etkinleştirildi. Artık iWsMMO istemcisinden giriş yapabilirsin.'
    : 'Doğrulama bağlantısının süresi dolmuş veya bağlantı daha önce kullanılmış olabilir.';
  document.querySelector('.verify-gem').classList.toggle('invalid', !ok);
}
