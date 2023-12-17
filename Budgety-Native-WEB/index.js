const checkInputFields = () => {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const submitButton = document.querySelector('.form-button');

  if (
    passwordInput.value.trim() !== '' &&
    confirmPasswordInput.value.trim() !== ''
  ) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
};

const redirectToBudgety = () => {
  document.addEventListener('DOMContentLoaded', () => {
    console.log(window.location);
    const { search } = window.location;
    const token = search.substring(1);
    console.log('Done');
    window.location.href = `budgety:///reset-password/${token}`;
  });
};

const resetPassword = async (event) => {
  event.preventDefault();

  const confirmPassword = document
    .getElementById('confirm-password')
    .value.trim();
  const errorMessageContainer = document.getElementById('error-message');
  const password = document.getElementById('password').value.trim();
  const successMessageContainer = document.getElementById('success-message');

  errorMessageContainer.classList.remove('hidden');
  successMessageContainer.classList.add('hidden');
  successMessageContainer.textContent = '';

  if (password !== confirmPassword) {
    errorMessageContainer.textContent = 'Passwords do not match';
    return;
  }

  if (password.length < 8) {
    errorMessageContainer.textContent =
      'Password should have at least 8 characters';
    return;
  }

  if (!/[A-Z]/.test(password)) {
    errorMessageContainer.textContent =
      'Password should have at least 1 capital letter';
    return;
  }

  if (!/[0-9]/.test(password)) {
    errorMessageContainer.textContent =
      'Password should have at least 1 number';
    return;
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errorMessageContainer.textContent =
      'Password should have at least 1 special character';
    return;
  }

  errorMessageContainer.textContent = '';

  const url = 'http://192.168.50.93:8080/api/user/reset-password';

  const { search } = window.location;
  const token = search.substring(1);

  const options = {
    body: JSON.stringify({
      password: password,
      token,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data?.error) {
      errorMessageContainer.textContent = data.error;
      return;
    }

    if (data?.message === 'Password has been changed') {
      errorMessageContainer.classList.add('hidden');
      successMessageContainer.textContent =
        'The password has been changed, please go back to the app and log in with your new password';
      return;
    }
  } catch (error) {
    errorMessageContainer.textContent =
      'Something went wrong, please try again later';
  }
};

const togglePasswordVisibility = (e, inputId) => {
  const iconElement = e.target;
  const input = document.getElementById(inputId);

  iconElement.alt = iconElement.src.includes('open')
    ? 'Hide password'
    : 'Show password';
  iconElement.src = iconElement.src.includes('open')
    ? './assets/eye-close.svg'
    : './assets/eye-open.svg';

  input.type = input.type === 'password' ? 'text' : 'password';
};

const togglePasswordVisibilityKeyDown = (e, inputId) => {
  console.log(e);
  if (e.key !== 'Enter' && e.key !== ' ') return;
  togglePasswordVisibility(e, inputId);
};

const init = () => {
  redirectToBudgety();

  const confirmPasswordInput = document.getElementById('confirm-password');
  const passwordInput = document.getElementById('password');
  const submitButton = document.querySelector('.form-button');

  confirmPasswordInput.addEventListener('input', checkInputFields);
  passwordInput.addEventListener('input', checkInputFields);

  submitButton.disabled = true;
};

init();
