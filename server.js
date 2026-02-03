const io = require('socket.io')(3000, {
    cors: { origin: "*" }
});

let players = [];
let gameStarted = false;

io.on('connection', (socket) => {
    console.log('Новое подключение:', socket.id);

    // Игрок заходит в лобби
    socket.on('joinGame', (username) => {
        if (gameStarted) return socket.emit('error', 'Игра уже идет');

        const newUser = { id: socket.id, name: username, role: null, isAlive: true };
        players.push(newUser);

        io.emit('updatePlayers', players); // Рассылаем всем новый список игроков
    });

    // Старт игры (нажимает админ)
    socket.on('startGame', () => {
        if (players.length < 4) return;

        gameStarted = true;
        // Распределяем роли (1 мафия, остальные мирные)
        const mafiaIndex = Math.floor(Math.random() * players.length);
        players.forEach((p, i) => {
            p.role = (i === mafiaIndex) ? 'Мафия' : 'Мирный';
            io.to(p.id).emit('getRole', p.role); // Отправляем роль лично игроку
        });

        io.emit('gameStarted', players);
    });

    // Голосование или убийство
    socket.on('action', (targetId) => {
        const target = players.find(p => p.id === targetId);
        if (target) {
            target.isAlive = false;
            io.emit('playerKilled', { id: targetId, name: target.name });
            io.emit('updatePlayers', players);
        }
    });

    socket.on('disconnect', () => {
        players = players.filter(p => p.id !== socket.id);
        io.emit('updatePlayers', players);
    });
});