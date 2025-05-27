let url = window.location.hostname == "localhost" ? 'http://localhost:3001/' : 'https://' + window.location.hostname + '/';
const params = new URLSearchParams(window.location.search);
let id = params.get('id');
let auth = localStorage.getItem('token');
var data;
if (!auth) {
  window.location.replace(url + 'login/');
}
getData();
function getheaders () {
  return {
    "Content-Type":"application/json",
    "x-access-token": localStorage.getItem('token')
  }
}
document.addEventListener("keydown", function(e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
    e.preventDefault();
    saveCard();
  }
}, false);

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

var deleteData = function() {
  return new Promise(function(resolve, reject) {
    fetch(url + 'delete/?id=' + id, {
      headers: getheaders(),
      method: 'DELETE'
    })
    .then((response) => {
      if(!response.ok) {
        reject(response.status);
      } else {
        resolve("success");
      }
    });
  });
};
async function deleteCard() {
  await deleteData()
    .then(function (result) {
      if (result == "success") {
        openToast("Deleted card", id, "#198754");
        setTimeout(() => {
          window.location.replace("/");
        }, 3000);
      } else {
        openToast("Failed to delete card", "#dc3545");
      }
    })
  
}

function saveCard() {
  const titleToSend = document.getElementById('Title').value;
  const authorToSend = document.getElementById('Author').value;
  const LanguageToSend = document.getElementById('Language').value
  const codeToSend = document.getElementById('code').value;

  fetch(url + 'save/?id=' + id + '&new=false',
    {
      headers: getheaders (),
      method: "POST",
      body: JSON.stringify({
        id: Number(id),
        title: titleToSend,
        language: LanguageToSend,
        author: authorToSend,
        code: codeToSend
      })
    }
  )
  .then(() => {
    openToast("Saved card ", id);
  });
}


function getData() {
  fetch(url + 'codes/' + id, {
    headers: getheaders ()
  })
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
              <input class="form-control" id="Title" value="${data.title}">
            
            </div>
            <div class="col-sm-3" style="display: inline-block;">
              <label class="form-label">Language: </label>    
              <select id="Language" class="form-select form-control" aria-label="Default select example">
                  <option value="CPP">CPP</option>
                  <option value="C">C</option>
                  <option value="Python">Python</option>
                  <option value="other">other</option>
              </select>
            </div>
            <div class="align-right">
                
              <label class="form-label">Author: </label>
              <input class="form-control" id="Author" value="${data.author}">
                
            </div>
          </div>
          
          <div class="card-body">
            <textarea id="code" class="card-text code-text">${data.code}</textarea>
            <div class="align-right">
              <a class="btn btn-primary" onclick="copyToClipboard()">Copy</a>
              <a class="btn btn-success" onclick="saveCard()">save</a>
              <a class="btn btn-danger" onclick="deleteCard(${data.id})">Delete</a>
            </div>            
          </div>
        </div>
      </div>
    `;

  mainBody.innerHTML += card;
  var e = document.getElementById("Language");
  e.value = data.language;

}