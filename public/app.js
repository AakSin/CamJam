let socket = io(); // opens and connect to socket
//listen for confirmation
socket.on("connect", () => {
  console.log("connected");
});
socket.on("roomCreated", (roomCode) => {
  let url = window.location.href;

  window.location.href = url + roomCode;
});
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
  createButton.addEventListener("click", () => {
    if (roomNameForm.value) {
      socket.emit("createRoom", roomNameForm.value);
    }
  });
});
