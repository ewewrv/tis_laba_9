const io = require('socket.io')(8000, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"] 
    },
    transports: ['websocket', 'polling', 'flashsocket'],

    host: '127.0.0.1'
});
// Объект для отслеживания подключенных пользователей
const users = {};

// Слушатель событий для новых подключений к серверу
io.on('connection', socket => {
    // При подключении нового пользователя
    socket.on('new-user-joined', name => {
        users[socket.id] = name; // Добавление пользователя в объект users
        socket.broadcast.emit('user-joined', name); // Передача события всем остальным пользователям
    });

    // При отправке пользователем сообщения
    socket.on('send', message => {
        // Передача сообщения всем остальным пользователям
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    // При отключении пользователя
    socket.on("disconnect", (reason, details) => {
        socket.broadcast.emit('left', users[socket.id]); // Уведомление других пользователей о том, что кто-то вышел из чата
        delete users[socket.id]; // Удаление пользователя из объекта users
    });
});
// Запрос у пользователя его имени и передача его на сервер
const userName = prompt('Enter your name to join');
socket.emit('new-user-joined', userName);
