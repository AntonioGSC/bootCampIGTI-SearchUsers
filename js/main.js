window.addEventListener('load', start);

let inputName = document.getElementById('search');
let submitForm = document.getElementById('submit-form');
let globalUsers = [];
let filteredUsers = [];

function start() {
  fetchUsers();
  preventFormSubmit();
  activateInput();
  submitForm.disabled = true;
}

async function fetchUsers() {
  const resource = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const data = await resource.json();
  const dataArray = data.results;
  globalUsers = dataArray.map(({ name, picture, dob, gender }) => {
    return {
      firstName: name.first,
      lastName: name.last,
      picture: picture.large,
      age: dob.age,
      gender: gender,
    };
  });
  hideSpinner();
  console.log(globalUsers);
}

function preventFormSubmit() {
  let form = document.querySelector('form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    inputName.value.trim() !== ''
      ? render(inputName.value.toLowerCase())
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

function hideSpinner() {
  const spinner = document.getElementById('spinner');
  spinner.classList.add('hide');
}

function render(filter) {
  filteredUsers = globalUsers.filter((user) => {
    return user.firstName.includes(filter) || user.lastName.includes(filter);
  });
  renderUserList();
  renderSumary();
}

function renderUserList() {
  const divUsers = document.querySelector('.users-render');
  divUsers.innerHTML = `
    <div class='row'>
      ${filteredUsers
        .map(({ picture, firstName, lastName, age }) => {
          return `
          <div class='user-render'>
            <div class='flex-row div-users'>
              <img class='avatar' src='${picture}' alt='${firstName}'>
              <span>${firstName} ${lastName}, ${age} anos</span>
            </div>
          </div>
        `;
        })
        .join('')}
    </div>
  `;
}

function renderSumary() {}
