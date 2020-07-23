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
  numberFormat = Intl.NumberFormat('pt-BR');
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
    return (
      user.firstName.toLowerCase().includes(filter) ||
      user.lastName.toLowerCase().includes(filter)
    );
  });

  filteredUsers.sort((a, b) => {
    return a.firstName.localeCompare(b.firstName);
  });
  renderUserList();
  renderSummary();
}

function renderUserList() {
  const divUsers = document.querySelector('.users-render');
  divUsers.innerHTML = `
    <div class='row'>
      <h2 class="subtitle">
        <span class="number-users">${
          filteredUsers.length
        }</span> usuário(s) encontrado(s)
      </h2>
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

function renderSummary() {
  let medAge = 0;
  const divStatistics = document.querySelector('.statistics-render');
  let sexMasc = filteredUsers.reduce((accumulator, current) => {
    current.gender === 'male' ? accumulator++ : accumulator;
    return accumulator;
  }, 0);
  let sexFem = filteredUsers.reduce((accumulator, current) => {
    current.gender === 'female' ? accumulator++ : accumulator;
    return accumulator;
  }, 0);
  let sumAge = filteredUsers.reduce((accumulator, current) => {
    return (accumulator += current.age);
  }, 0);
  filteredUsers.length !== 0
    ? (medAge = sumAge / filteredUsers.length)
    : (medAge = 0);

  divStatistics.innerHTML = `
    <h2 class="subtitle">Estatísticas</h2>
    <ul class="statistics">
      <li class="statistics-item">
        Sexo masculino:
        <span class="statistics-item-num number-masc">${sexMasc}</span>
      </li>
      <li class="statistics-item">
        Sexo feminino:
        <span class="statistics-item-num number-fem">${sexFem}</span>
      </li>
      <li class="statistics-item">
        Soma das idades:
        <span class="statistics-item-num number-sumAge">${formatNumber(
          sumAge
        )}</span>
      </li>
      <li class="statistics-item">
        Média das idades:
        <span class="statistics-item-num number-medAge">
        ${formatNumber(medAge.toFixed(2))}</span>
      </li>
    </ul>
  `;
}

function formatNumber(number) {
  return numberFormat.format(number);
}
