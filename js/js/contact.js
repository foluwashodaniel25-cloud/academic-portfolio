// =========================================================
// Contact form validation
// Demonstrates: form validation, event handling, DOM updates
// =========================================================

(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    message: document.getElementById('message')
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_DIGITS_RE = /^\d+$/;

  function setInvalid(fieldKey, invalid) {
    const wrapper = document.getElementById('field-' + fieldKey);
    if (!wrapper) return;
    wrapper.classList.toggle('invalid', invalid);
  }

  function validateName() {
    const ok = fields.name.value.trim().length > 0;
    setInvalid('name', !ok);
    return ok;
  }

  function validateEmail() {
    const value = fields.email.value.trim();
    const ok = value.length > 0 && EMAIL_RE.test(value);
    setInvalid('email', !ok);
    return ok;
  }

  function validatePhone() {
    const value = fields.phone.value.trim();
    const ok = value.length > 0 && PHONE_DIGITS_RE.test(value);
    setInvalid('phone', !ok);
    return ok;
  }

  function validateMessage() {
    const ok = fields.message.value.trim().length > 0;
    setInvalid('message', !ok);
    return ok;
  }

  // Live validation as the user types/leaves a field
  fields.name.addEventListener('blur', validateName);
  fields.email.addEventListener('blur', validateEmail);
  fields.phone.addEventListener('blur', validatePhone);
  fields.message.addEventListener('blur', validateMessage);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const validations = [
      validateName(),
      validateEmail(),
      validatePhone(),
      validateMessage()
    ];

    const allValid = validations.every(Boolean);

    status.classList.remove('show', 'success', 'fail');

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.classList.add('show', 'fail');
      return;
    }

    // Simulate a successful send (no backend attached to this static site)
    status.textContent = `Thanks, ${fields.name.value.trim()}! Your message has been received. I'll reply to ${fields.email.value.trim()} soon.`;
    status.classList.add('show', 'success');
    form.reset();
    Object.keys(fields).forEach(key => setInvalid(key, false));
  });
})();
    
