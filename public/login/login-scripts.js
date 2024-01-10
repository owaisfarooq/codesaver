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
  const password = document.getElementById("password").value;
  
  try {
    const res = await fetch(url + 'login/', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      openToast("Login successfull", "valid credentials", 'green')
      window.location.replace(oldPage || url);
    } else {
      console.log('Login failed');
      res.json()
      .then( ( data ) => {
        openToast("Login failed", data, 'red')
      });
    }
  } catch (error) {
    openToast("Login failed", error, 'red')
    console.error('Error:', error);
  }
  
}