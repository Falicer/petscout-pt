const socket = io();
const messages = document.getElementById('messages');
const chatBar = document.getElementById('chatBar');
const chatInput = document.getElementById('chatInput');

console.log('chat page')

chatBar.addEventListener('submit', function(e) {
e.preventDefault();
if (chatInput.value) {
  socket.emit('chat message', chatInput.value);
  chatInput.value = '';
}
});

socket.on('chat message', function(msg) {
  console.log(msg)
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});