let url = window.location.hostname == "localhost" ? 'http://localhost:3001/' : 'https://' + window.location.hostname + '/';
const params = new URLSearchParams(window.location.search);
let id = params.get('id');
let auth = localStorage.getItem('token');
const currentUrl = window.location.href;
var data;
let navbarNav = document.getElementById("navbarNav");
function getheaders () {
  return {
    "Content-Type":"application/json",
    "x-access-token": localStorage.getItem('token')
  }
}

if (auth) {
  nav.innerHTML +=
    `
  <div class="container-fluid">
    <a class="navbar-brand" href="/">CodeSaver</a>
      <div class="collapse navbar-collapse" style="float: right;" id="navbarNav">
        <ul class="navbar-nav" id="nav-items" style="margin-left: auto;">
          <li class="nav-item" style="margin-left: auto;">
            <a href="/new/" class="btn btn-primary justify-content-end" style="margin-left: auto;">Add New</a>
          </li>
        </ul>
      </div>
  </div>

  `;
} else {
  nav.innerHTML +=
    `
    <div class="container-fluid">
      <a class="navbar-brand" href="/">CodeSaver</a>
      <div class="collapse navbar-collapse" style="float: right;" id="navbarNav">
        <ul class="navbar-nav" id="nav-items" style="margin-left: auto;">
          <li class="nav-item" style="margin-left: auto;">
            <a href="/login/?oldPage=${currentUrl}" class="btn btn-light justify-content-end" style="margin-left: auto;margin-right: 5px;">Login</a>
          </li>
        </ul>
      </div>
  </div>
  
  `;
}
getData();

function getIndexById(Id) {
  for (let a = 0; a < data.length; a++) {
    if (data[a].id == Id) {
      return a;
    }
  }
}

function copyToClipboard() {
  var text = document.getElementById("code");

  text.select();
  text.setSelectionRange(0, 999999);
  console.log(navigator.userAgentData);
  navigator.clipboard.writeText(text.value);
  openToast("Copied to clipboard", id);
}

function getData() {
  fetch(url + 'codes/' + id)
    .then(res => res.json())
    .then(json => data = json)
    .then(() => this.makeCard())
}

function openToast(message, id, color) {
  const cardHeading = document.getElementById('Title').value;
  const subHeading = document.getElementById('cardHeading');
  const bodyOfToast = document.getElementById('toast-body');
  const header = document.getElementById('header');
  header.style.backgroundColor = color;
  bodyOfToast.innerHTML = message;
  subHeading.innerHTML = cardHeading;
  const toastLiveExample = document.getElementById('liveToast');
  const toast = new bootstrap.Toast(toastLiveExample);
  toast.show();
}

function makeCard() {
  var mainBody = document.getElementById("main-body");
  var card = `
    <div>
      <div class="card" id="card">
        <div class="card-header d-flex justify-content-between">
          <div class="align-left">
            <label class="form-label">Title: </label>
            <input class="form-control" id="Title" disabled value="${data.title}">
          </div>
          <div class="align-right ">
            <label class="form-label">Author: </label>
            <input class="form-control" id="Author" disabled value="${data.author}">
          </div>
        </div>
        <div class="card-body">
          <textarea id="code" disabled class="card-text code-text">${data.code}</textarea>
          <div class="align-right">
            <a class="btn btn-primary" onclick="copyToClipboard()">Copy</a>
          </div>            
        </div>
      </div>
    </div>
  `;

  mainBody.innerHTML += card;
  var e = document.getElementById("Language");
  e.value = data.language;

}        