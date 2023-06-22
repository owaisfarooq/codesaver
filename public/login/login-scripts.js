let url = window.location.hostname == "localhost" ? 'http://localhost:3001/' : 'https://' + window.location.hostname + '/';
const params = new URLSearchParams(window.location.search);
const oldPage = params.get('oldPage');
// console.log("oldPage:" + oldPage + " params.get('oldPage'): " + params.get('oldPage'));

// document.getElementById("submit-btn").addEventListener("click", function(event){
//   event.preventDefault();
//   submit();
// });
// async function submit() {
//   console.log("asdasd");
//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;
//   console.log("username: " + username + "\npassword: " + password);
//   // preventDefault()
//   fetch(url + "login/",{
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     method: "POST",
//     body: JSON.stringify({
//       username: username,
//       password: password
//     })
//   },(data) => {
//     console.log("data: " + data);
//   })
//   .then(()=>{
//     // console.log("response: " + resposnse);
//   });
// }
function submit() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  let accessGranted = false;
  // console.log("username: " + username + "\npassword: " + password);

  if (username == "owais" && password == "superuser") {
    accessGranted = true;
    // url.searchParams.append('auth', true);

  } else if (username == "rae" && password == "iamcrazy") {
    accessGranted = true;
  }
  if (accessGranted) {
    if (oldPage.includes("?")) {
      window.location.replace(oldPage + "&auth=true");
    } else if (!oldPage.includes("?")) {
      window.location.replace(url + "/lab-activities/" + "?auth=true");
    } else {
      window.location.replace(oldPage + "?auth=true");
    }
  } else {
    alert("invalid username or password");
  }
}