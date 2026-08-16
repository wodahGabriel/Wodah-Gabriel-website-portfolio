(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('.contact-submit');
  var originalText = submitBtn.textContent;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          statusEl.textContent = "Thanks — your message is on its way. I'll reply within 24 hours.";
          statusEl.className = 'form-status form-status-success';
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      })
      .catch(function () {
        statusEl.textContent = 'Something went wrong. Please email hello@wodahgabriel.com directly.';
        statusEl.className = 'form-status form-status-error';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });
})();
