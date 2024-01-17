let url = window.location.hostname == "localhost" ? 'http://localhost:3001/' : 'https://' + window.location.hostname + '/';
const params = new URLSearchParams(window.location.search);
const oldPage = params.get('oldPage');

function openToast(heading, message, color) {
    const subHeading = document.getElementById('cardHeading');
    const bodyOfToast = document.getElementById('toast-body');
    subHeading.innerHTML = heading;
    bodyOfToast.innerHTML = message;
    const toastLiveExample = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}


async function submit() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await axios.post(url + 'register/', {
      email: email,
      username: username,
      password: password
    });

    // Assuming the server returns a success message or data in the response
    console.log(response.data);
    openToast("Success", response.data, "green");
    // Registration successful logic here
  } catch (error) {
    // Handle errors
    openToast("Error", error.response.data, "red");
    console.log(error);
  }
}