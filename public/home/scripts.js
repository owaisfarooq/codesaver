let url = window.location.hostname == "localhost" ? 'http://localhost:3001/' : 'https://' + window.location.hostname + '/';
const currentUrl = window.location.href;
const params = new URLSearchParams(window.location.search);
const sortBy = params.get('sortBy');
const auth = localStorage.getItem('token');
// navigator.clipboard.readText();

function getheaders () {
  return {
    "Content-Type":"application/json",
    "x-access-token": localStorage.getItem('token')
  }
}



if (auth) {

  document.getElementById("nav").innerHTML += `
  <div class="container-fluid">
    <a class="navbar-brand" id="mainLink" href="/">CodeSaver</a>
    <div class="collapse navbar-collapse" style="float: right;" id="navbarNav">
        <ul class="navbar-nav" id="HeaderButtons" style="margin-left: auto;">
          <a class="navbar-brand" id="total-items">Total Items: </a>
          <li class="nav-item" style="margin-left: auto;">
            <a href="/new" class="btn btn-primary justify-content-end" style="margin-left: auto;">Add New</a>
          </li>
        </ul>
    </div>
  </div>
  `;

} else {

  document.getElementById("nav").innerHTML += `
  <div class="container-fluid">
    <a class="navbar-brand" id="mainLink" href="/">CodeSaver</a>
    <div class="collapse navbar-collapse" style="float: right;" id="navbarNav">
        <ul class="navbar-nav" id="HeaderButtons" style="margin-left: auto;">
          <a class="navbar-brand" id="total-items">Total Items: </a>
          <li class="nav-item" style="margin-left: auto;">
            <a href="/login/?oldPage=${currentUrl}" class="btn btn-light justify-content-end" style="margin-left: auto;margin-right: 5px;">login</a>
          </li>
        </ul>
    </div>
  </div>
  `;
}

var data;
getData();

function copyToClipboard(id) {
  var index = getIndexById(id);
  var text = data[index].code;

  navigator.clipboard.writeText(text);
  openToast("Copied to clipboard", id, "blue");
}

function deleteCard(id) {
  fetch(url + 'delete/?id=' + id, {
    headers: getheaders(),
    method: 'DELETE'
  }).then ( response => {
    if (response.status == 200 ) {
      card = document.getElementById('cardId' + id);
      card.style.display = 'none';
      openToast("Deleted card ", id, "green");
    } else if ( response.status == 401 ) {
      openToast("Only the author can delete their own card", id, "red");
    } else {
      openToast("An error occoured", id, "red");
    }
  }).catch ( error => {
    console.log(error);
  })
  getData();
}

function getIndexById(Id) {
  for (let a = 0; a < data.length; a++) {
    if (data[a].id == Id) {
      return a;
    }
  }
}

function getData() {
  fetch(url + 'codes/', {
    headers: getheaders()
  })
    .then(res => res.json())
    .then(json => data = json)
    .then(() => this.makeCards());
}

function openToast(message, id, color) {
  let index = getIndexById(id);
  cardHeading = data[index].title;
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

function populateHeader() {
  var smallHeader = document.getElementById('total-items');
  smallHeader.innerHTML = "Total Items: " + data.length;
  // smallHeader.innerHTML = Number(data.length);
}

function GetSortOrder(prop) {
  return function(a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  }
}

function makeCards() {
  populateHeader();
  const mainBody = document.getElementById("main-body");
  mainBody.innerHTML = '';
  rowCount = 0;
  if (sortBy) {
    data.sort(GetSortOrder(sortBy));
    document.getElementById(sortBy).style.color = '#0d6efd';
  }

  for (let i = 0; i < data.length; i = i) {

    // console.log(`row no ${rowCount} started`);
    var row = `<div class="row" style="padding: 10px;">`;

    for (let col = 0; col <= 3 && i < data.length; col++) {

      if ( auth ) {
        var card = `
          <div id="cardId${data[i].id}" class="col-sm-3">
            <div class="card" id="card${data[i].id}">
                <div id="card-heading-${data[i].id}" class="card-header">
                    ${data[i].language}
                </div>
                
                <div class="card-body">
                    <h5 class="card-title">${data[i].author}</h5>
                    <textarea id="code${data[i].id}" class="card-text code-text">${data[i].title}</textarea>
                    <a class="btn btn-primary" onclick="copyToClipboard(${data[i].id})">copy</a>
                    <a class="btn btn-secondary" href="${url}/view?id=${data[i].id}">View</a>
                    <a class="btn btn-success" href="${url}/edit?id=${data[i].id}">Edit</a>
                    <a class="btn btn-danger" onclick="deleteCard(${data[i].id})">Delete</a>
                </div>
            </div>
          </div>
        `;
      } else {
        var card = `
          <div id="cardId${data[i].id}" class="col-sm-3">
            <div class="card" id="card${data[i].id}">
                <div id="card-heading-${data[i].id}" class="card-header">
                    ${data[i].language}
                </div>
                
                <div class="card-body">
                    <h5 class="card-title">${data[i].author}</h5>
                    <textarea id="code${data[i].id}" class="card-text code-text">${data[i].title}</textarea>
                    <a class="btn btn-primary" onclick="copyToClipboard(${data[i].id})">copy</a>
                    <a class="btn btn-secondary" href="${url}/view?id=${data[i].id}" >View</a>
                </div>
            </div>
          </div>
        `;
      }
      // console.log(`card made with id = ${data[i].id} and i = ${i}`);
      row += card;
      i++;
    }
    row += `</div>`;
    // console.log(`row no ${rowCount} ended`);
    rowCount++;
    mainBody.innerHTML += row;
  }
  // document.getElementById('loading').style.display = "none";
}