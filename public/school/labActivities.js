let url = window.location.hostname == "localhost" ? 'http://localhost:3001/' : 'https://' + window.location.hostname + '/';
const params = new URLSearchParams(window.location.search);
const filter = params.get('filter');
const auth = localStorage.getItem('token');
// navigator.clipboard.readText();
var data;
var activitiesByChapter = [];
let noActivitiesByChapter = 0;
const currentUrl = window.location.href;

function filterLink(chapterNo) {
  if (auth == "true") {
    if (!chapterNo) {
      window.location.replace(url + 'lab-activities/' + "?auth=true");
    } else {
      window.location.replace(url + 'lab-activities/?filter=' + chapterNo + "&auth=true");

    }
  } else {
    if (!chapterNo) {
      window.location.replace(url + 'lab-activities/');
    } else {
      window.location.replace(url + 'lab-activities/?filter=' + chapterNo);

    }

  }
}

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
            <a href="/new/?type=activities" class="btn btn-primary justify-content-end" style="margin-left: auto;">Add New</a>
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
getData();

function copyToClipboard(id) {
  var index = getIndexById(id);
  var text = data[index].code;
  navigator.clipboard.writeText(text);
  openToast("Copied to clipboard", id);

}

function getIndexById(Id) {

  for (let a = 0; a < data.length; a++) {

    if (data[a].id == Id) {

      return a;

    }
  }
}
function getData() {
  fetch(url + 'activities/', {
    headers: getheaders()
  })
    .then(res => res.json())
    .then(json => data = json)
    .then(() => this.makeCards());

}

function openToast(message, id) {
  let index = getIndexById(id);
  cardHeading = data[index].activityNo;
  const subHeading = document.getElementById('cardHeading');
  const bodyOfToast = document.getElementById('toast-body');
  bodyOfToast.innerHTML = message;
  subHeading.innerHTML = cardHeading;
  const toastBlueprint = document.getElementById('liveToast');
  const toast = new bootstrap.Toast(toastBlueprint);
  toast.show();

}
function populateHeader() {
  var smallHeader = document.getElementById('total-items');
  var noOfCards = data.length;
  console.log(data.length);
  smallHeader.innerHTML += noOfCards;

}

function filterByChapter(chapterNo) {
  for (let index = 0; index < data.length; index++) {
    if (data[index].chapter != chapterNo) {
      data.splice(index, 1);
      filterByChapter(chapterNo);
    }
  }
}

function deleteCard(id) {
  fetch(url + 'delete/?cardId=' + id, {
    headers: getheaders(),
    method: 'DELETE'
  });
  card = document.getElementById('cardId' + id);
  card.style.display = 'none';
  openToast("Deleted card ", id, "red");
  getData();
}

function makeCards() {
  const mainBody = document.getElementById("main-body");

  rowCount = 0;
  populateHeader();
  if (filter) {
    filterByChapter(filter);
  }
  if (data.length == 0) {
    document.getElementById('main-body').innerHTML +=
      `
      <h1 class="">stop messing with the links 🔪</h1>
    `
  }
  // if (sortBy) {
  //   data.sort(GetSortOrder(sortBy));
  //   document.getElementById(sortBy).style.color = '#0d6efd';
  // }
  // console.log("sortBy: " + sortBy);

  data.sort((firstItem, secondItem) => firstItem.activityNo - secondItem.activityNo);
  data.sort((firstItem, secondItem) => firstItem.chapter - secondItem.chapter);
  if (auth) {

    for (let i = 0; i < data.length;) {

      // console.log(`row no ${rowCount} started`);
      var row = `<div class="row" style="padding: 10px;">`;

      for (let col = 0; col <= 3 && i < data.length; col++) {

        var card = `
          <div id="cardId${data[i].id}" class="col-sm-3">
            <div class="card" id="card${data[i].id}">
              <div id="card-heading-${data[i].id}" class="card-header">
                ${data[i].author}
              </div>
              
              <div class="card-body">
                <h5 class="card-title">chapter: ${data[i].chapter}</h5>
                <textarea id="code${data[i].id}" class="card-text code-text">Activity No: ${data[i].activityNo}</textarea>
                <a class="btn btn-primary" onclick="copyToClipboard(${data[i].id})">copy</a>
                <a class="btn btn-secondary" href="${url}/view?id=${data[i].id}+&type=activities">View</a>
                <a class="btn btn-success" href="${url}/edit?id=${data[i].id}+&type=activities">Edit</a>
                <a class="btn btn-danger" onclick="deleteCard(${data[i].id})">Delete</a>
              </div>
            </div>
          </div>
          `;
        // console.log(`card made with id = ${data[i].id} and i = ${i}`);
        row += card;
        i++;
      }
      row += `</div>`;
      // console.log(`row no ${rowCount} ended`);
      rowCount++;
      mainBody.innerHTML += row;
    }
  } else {
    for (let i = 0; i < data.length;) {

      // console.log(`row no ${rowCount} started`);
      var row = `<div class="row" style="padding: 10px;">`;

      for (let col = 0; col <= 3 && i < data.length; col++) {

        var card = `
          <div id="cardId${data[i].id}" class="col-sm-3">
            <div class="card" id="card${data[i].id}">
              <div id="card-heading-${data[i].id}" class="card-header">
                ${data[i].author}
              </div>
              
              <div class="card-body">
                <h5 class="card-title">chapter: ${data[i].chapter}</h5>
                <textarea id="code${data[i].id}" class="card-text code-text">Activity No: ${data[i].activityNo}</textarea>
                <a class="btn btn-primary" onclick="copyToClipboard(${data[i].id})">copy</a>
                <a class="btn btn-secondary" href="${url}/view?id=${data[i].id}+&type=activities">View</a>
              </div>
            </div>
          </div>
      `;
        // console.log(`card made with id = ${data[i].id} and i = ${i}`);
        row += card;
        i++;
      }
      row += `</div>`;
      // console.log(`row no ${rowCount} ended`);
      rowCount++;
      mainBody.innerHTML += row;
    }
  }
  document.getElementById('loading').style.display = "none";
}