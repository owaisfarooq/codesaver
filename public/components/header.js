let nav = document.getElementById('nav');

let mainHeader = `
    <div class="container-fluid">
        <a class="navbar-brand" href="/">CodeSaver</a>
        <div class="collapse navbar-collapse" style="float: right;" id="navbarNav">
            <ul class="navbar-nav" id="HeaderButtons" style="margin-left: auto;">
            </ul>
        </div>
    </div>
`;

let header = mainHeader;

let labActivities = `
    <li class="nav-item" style="margin-left: auto;">
        <a href="/lab-activities" class="btn btn-light justify-content-end" style="margin-left: auto;margin-right: 5px;">Lab activities</a>
    </li>
`;
let addNewBtnActivities = `
    <li class="nav-item" style="margin-left: auto;">
        <a href="/new?type=codes" class="btn btn-primary justify-content-end" style="margin-left: auto;">Add New</a>
    </li>
`;
let addNewBtnCodes = `
    <li class="nav-item" style="margin-left: auto;">
        <a href="/new?type=codes" class="btn btn-primary justify-content-end" style="margin-left: auto;">Add New</a>
    </li>
`;
let totalItems = `
    <a class="navbar-brand" href="#" id="total-items">Total Items: </a>
`;

if (nav.classList.contains('totalItems')){
    header += totalItems;
}
if (nav.classList.contains('labActivities')) {
    header += labActivities;
}
if (nav.classList.contains('addNewBtnCodes')){
    header += addNewBtnCodes;
}
if (nav.classList.contains('addNewBtnActivities')){
    header += addNewBtnActivities;
}

nav.innerHTML = header;

// function populateHeader() {
//     var smallHeader = document.getElementById('total-items');
//     var noOfCards = data.length;
//     smallHeader.innerHTML += noOfCards;
// }