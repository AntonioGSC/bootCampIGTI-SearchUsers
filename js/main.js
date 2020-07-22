window.addEventListener('load', start);

let inputName = document.getElementById('search');
let submitForm = document.getElementById('submit-form');

function start() {
  preventFormSubmit();
  activateInput();
  submitForm.disabled = true;
}

function preventFormSubmit() {
  let form = document.querySelector('form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    inputName.value.trim() !== ''
      ? render()
      : (inputName.focus(), (submitForm.disabled = true));
  });
}

function activateInput() {
  inputName.focus();
  inputName.addEventListener('keyup', (event) => {
    submitForm.disabled = false;
    event.target.value.trim() === ''
      ? (submitForm.disabled = true)
      : (submitForm.disabled = false);
  });
}

function render() {
  console.log('Renderizando');
  console.log(inputName.value);
}
