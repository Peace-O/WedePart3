document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const ageVerified = localStorage.getItem('kanaverseAgeVerified') === 'true';
  const lastBlockedPage = localStorage.getItem('kanaverseLastBlockedPage');

  const ageNotice = document.getElementById('age-notice');
  if (ageNotice) {
    const continueLink = ageNotice.querySelector('a[data-continue="true"]');
    const exitLink = ageNotice.querySelector('a[data-exit="true"]');

    if (continueLink) {
      continueLink.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.setItem('kanaverseAgeVerified', 'true');

        const target = lastBlockedPage || 'index.html';
        localStorage.removeItem('kanaverseLastBlockedPage');
        window.location.href = target;
      });
    }

    if (exitLink) {
      exitLink.addEventListener('click', () => {
        localStorage.setItem('kanaverseAgeVerified', 'false');
        localStorage.removeItem('kanaverseLastBlockedPage');
      });
    }

    if (!ageVerified) {
      ageNotice.style.display = 'block';
    } else {
      ageNotice.style.display = 'none';
    }
  }

  const gatedPages = ['products.html', 'enquiry.html'];
  if (!ageVerified && gatedPages.includes(currentPage)) {
    localStorage.setItem('kanaverseLastBlockedPage', currentPage);
    window.location.href = 'index.html';
    return;
  }

  if (ageVerified && currentPage === 'index.html' && lastBlockedPage && gatedPages.includes(lastBlockedPage)) {
    window.location.href = lastBlockedPage;
    localStorage.removeItem('kanaverseLastBlockedPage');
    return;
  }

  const applicationForm = document.querySelector('#application-form form');
  if (applicationForm) {
    applicationForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const phone = document.getElementById('phone')?.value.trim() || '';
      const dob = document.getElementById('dob')?.value || '';
      const confirm = document.getElementById('confirm')?.checked || false;
      const interest = document.getElementById('interest')?.value || '';

      if (name.length < 2) {
        showFormMessage(applicationForm, 'Please enter your full name.', true);
        return;
      }

      if (!email || !isValidEmail(email)) {
        showFormMessage(applicationForm, 'Please enter a valid email address.', true);
        return;
      }

      if (phone.length < 9) {
        showFormMessage(applicationForm, 'Please enter a valid phone number.', true);
        return;
      }

      if (!dob || !isOver21(dob)) {
        showFormMessage(applicationForm, 'You must be 21 or older to apply for membership.', true);
        return;
      }

      if (!confirm) {
        showFormMessage(applicationForm, 'Please confirm that you are 21 or older.', true);
        return;
      }

      if (!interest) {
        showFormMessage(applicationForm, 'Please select your area of interest.', true);
        return;
      }

      showFormMessage(applicationForm, 'Your membership application has been submitted successfully. Our team will review it within 3–5 working days.', false);
      applicationForm.reset();
    });
  }

  const contactForm = document.querySelector('#contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('c-name')?.value.trim() || '';
      const email = document.getElementById('c-email')?.value.trim() || '';
      const subject = document.getElementById('c-subject')?.value || '';
      const message = document.getElementById('c-message')?.value.trim() || '';

      if (name.length < 2) {
        showFormMessage(contactForm, 'Please enter your name.', true);
        return;
      }

      if (!email || !isValidEmail(email)) {
        showFormMessage(contactForm, 'Please enter a valid email address.', true);
        return;
      }

      if (!subject) {
        showFormMessage(contactForm, 'Please choose a message subject.', true);
        return;
      }

      if (message.length < 10) {
        showFormMessage(contactForm, 'Please enter a more detailed message.', true);
        return;
      }

      showFormMessage(contactForm, 'Thanks for your message. Our team will get back to you soon.', false);
      contactForm.reset();
    });
  }
});

function showFormMessage(form, message, isError) {
  const existingMessage = form.querySelector('.form-status');
  if (existingMessage) {
    existingMessage.remove();
  }

  const status = document.createElement('p');
  status.className = `form-status ${isError ? 'error' : 'success'}`;
  status.textContent = message;
  form.appendChild(status);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isOver21(dateString) {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 21;
}

