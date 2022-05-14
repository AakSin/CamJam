
window.addEventListener("load", () => {
  const roomNameForm = document.querySelector("#roomName");
  const joinButton = document.querySelector("#joinRoom");
  const createButton = document.querySelector("#createRoom");

  joinButton.addEventListener("click", () => {
    if (roomNameForm.value) {
      let url = window.location.href;
      window.location.href = url + roomNameForm.value;
    }
  });
});
