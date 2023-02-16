let url = window.location.hostname == "localhost" ? 'http://localhost:3001/' : 'https://' + window.location.hostname + '/';
const params = new URLSearchParams(window.location.search);
let auth = params.get('auth');
let id = params.get('id');
let type = params.get('type');
setTimeout(makeCard, 1);

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveCard();
    }
}, false);
let nav = document.getElementById("nav");
if (auth == 'true') {
  nav.innerHTML += 
  `
    <div class="container-fluid">
    <a class="navbar-brand" href="/">CodeSaver</a>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav" style="margin-left: auto;">
                <li class="nav-item" style="margin-left: auto;">
                <a href="/lab-activities/?auth=true" class="btn btn-light justify-content-end" style="margin-left: auto;margin-right: 5px;">Lab activities</a>
                </li>
            </ul>
        </div>
    </div>
  `;
} else {
  nav.innerHTML += `
    <div class="container-fluid">
    <a class="navbar-brand" href="/">CodeSaver</a>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav" style="margin-left: auto;">
                <li class="nav-item" style="margin-left: auto;">
                <a href="/lab-activities" class="btn btn-light justify-content-end" style="margin-left: auto;margin-right: 5px;">Lab activities</a>
                </li>
            </ul>
        </div>
    </div>
  `;
}
function saveCard() {

    if (type == 'codes') {
        const titleToSend = document.getElementById('Title').value;
        const authorToSend = document.getElementById('Author').value;
        const languageToSend = document.getElementById('Language').value;
        const codeToSend = document.getElementById('code').value;
    
        fetch(url + 'save/?new=true&type=codes', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                title: titleToSend,
                author: authorToSend,
                language: languageToSend,
                code: codeToSend
            })
        })
        .then(response => {
            if (response.status == 200) {
                console.log(response);
                openToast("Saved card ", "#198754");
                setTimeout(() => {
                    window.location.replace("/");
                }, 1000);
            }
        })
        .catch(function (err) {
            openToast("Failed to save card ", "#dc3545");
            console.log(err);
        });
    } else if (type == 'activities') {
        const chapterToSend = document.getElementById('Chapter').value;
        const activityNoToSend = document.getElementById('ActivityNo').value;
        const authorToSend = document.getElementById('Author').value;
        const codeToSend = document.getElementById('code').value;
        fetch(url + 'save/?new=true&type=activities',
            {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                chapter: Number(chapterToSend),
                activityNo: Number(activityNoToSend),
                author: authorToSend,
                code: codeToSend
            })
            }
        )
        .then(() => {
            openToast("Saved card ", "#198754");
        });
    }
    document.getElementById("saveBtn").disabled = true;
}

function openToast(message, color) {
    if (type == 'activities') {
        const cardHeading = document.getElementById('Chapter').value;
        const subHeading = document.getElementById('cardHeading');
        const bodyOfToast = document.getElementById('toast-body');
        const header = document.getElementById('header');
        header.style.backgroundColor = color;
        bodyOfToast.innerHTML = message;
        subHeading.innerHTML = cardHeading;
        const toastLiveExample = document.getElementById('liveToast');
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    
    }else if (type == 'codes') {
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
}

function makeCard() {
    var mainBody = document.getElementById("bodyTo");
    if(type == 'codes'){
        var card = `
            <div>
                <div class="card" id="card">
                    <div class="card-header d-flex justify-content-between">
                        <div class="align-left">                
                            <label class="form-label">Title: </label>
                            <input class="form-control" id="Title" value="">
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
                            <input class="form-control" id="Author" value="">
                        </div>
                    </div>
                    <div class="card-body">
                        <textarea id="code" class="card-text code-text"></textarea>
                        <div class="align-right">
                            <a class="btn btn-primary" onclick="copyToClipboard()">Copy</a>
                            <a class="btn btn-success" id="saveBtn" onclick="saveCard()">save</a>
                        </div>            
                    </div>
                </div>
            </div>
        `;
    } else if(type == 'activities'){
        var card = `
            <div>
                <div class="card" id="card">
                    <div class="card-header d-flex justify-content-between">
                        <div class="align-left">                
                            <label class="form-label">chapter: </label>
                            <input class="form-control" id="Chapter">
                        </div>
                        <div class="align-left">                
                            <label class="form-label">activity: </label>
                            <input class="form-control" id="ActivityNo">
                        </div>
                        
                        <div class="align-right">
                            <label class="form-label">Author: </label>
                            <input class="form-control" id="Author">
                        </div>
                    </div>
                    <div class="card-body">
                        <textarea id="code" class="card-text code-text"></textarea>
                        <div class="align-right">
                            <a class="btn btn-primary" onclick="copyToClipboard()">Copy</a>
                            <a class="btn btn-success" id="saveBtn" onclick="saveCard()">save</a>
                        </div>            
                    </div>
                </div>
            </div>
        `;
    }

    mainBody.innerHTML += card;
}