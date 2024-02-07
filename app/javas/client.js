// Установка соединения с сервером с помощью Socket.io
const socket = io('http://localhost:8000');

// Выбор элементов HTML с помощью jQuery
const form = $('#send-container');
const messageInput = $('#messageInp');
const messageContainer = $('#chatbox');

// Функция добавления сообщений в окно чата
const append = (message, self) => {
  // Добавление сообщения в окно чата в виде нового элемента div
  messageContainer.append('<div class="message">'+message+'</div>');
}

// Слушатель событий для отправки формы
$(form).submit(function(e){
    e.preventDefault(); // Предотвращает действие отправки формы по умолчанию
    const message = messageInput.val(); // Получение сообщения из поля ввода
    append(`You: ${message}`, 1); // Отображение сообщения пользователя в окне чата
    socket.emit('send', message); // Отправка сообщения на сервер
    messageInput.val(''); // Очистка поля ввода сообщения
});

// Запрос у пользователя его имени и передача его на сервер
const userName = prompt('Enter your name to join');
socket.emit('new-user-joined', userName);

// Прослушивание события 'user-joined' от сервера
socket.on('user-joined', name => {
  append(`${name} joined the chat`); // Уведомление о присоединении к чату нового пользователя
});

// Прослушивание события 'receive' для входящих сообщений
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`); // Отображение полученных сообщений в окне чата
});

// Прослушивание события 'left' при выходе пользователя из чата
socket.on('left', name => {
    append(`${name} left the chat`); // Уведомление о выходе пользователя из чата
});