let currentRoom = null;
let players = [];

function createRoom() {
    const name = document.getElementById('playerName').value;
    if (!name) return alert("Введите имя!");

    currentRoom = Math.floor(1000 + Math.random() * 9000); // Генерируем код
    document.getElementById('roomDisplay').innerText = "#" + currentRoom;

    enterRoomUI(name);
}

function joinRoom() {
    const name = document.getElementById('playerName').value;
    const code = document.getElementById('roomCodeInput').value;
    if (!name || !code) return alert("Введите имя и код!");

    currentRoom = code;
    document.getElementById('roomDisplay').innerText = "#" + code;
    enterRoomUI(name);
}

function enterRoomUI(userName) {
    document.getElementById('lobby-setup').style.display = 'none';
    document.getElementById('game-room').style.display = 'block';

    // Добавляем вас и пару ботов для примера
    players = [userName, "Бот Иван", "Бот Мария", "Бот Алекс", "Бот София"];
    renderPlayers();
}

function renderPlayers() {
    const list = document.getElementById('playerList');
    list.innerHTML = "";
    players.forEach(p => {
        list.innerHTML += `<li class="player-item">${p} <span>Готов</span></li>`;
    });
}

function distributeRoles() {
    const roles = ["Мафия 🕵️‍♂️", "Доктор ➕", "Шериф 👮‍♂️", "Мирный 👨‍🌾", "Мирный 👨‍🌾"];
    // Перемешиваем роли
    const shuffled = roles.sort(() => 0.5 - Math.random());

    const myRole = shuffled[0]; // Ваша роль (первая в списке)
    const roleBox = document.getElementById('role-display');

    roleBox.innerHTML = `Ваша роль: <span style="color: #e74c3c">${myRole}</span>`;
    document.getElementById('startGameBtn').innerText = "Переиграть роли";
}

function leaveRoom() {
    document.getElementById('lobby-setup').style.display = 'block';
    document.getElementById('game-room').style.display = 'none';
    document.getElementById('role-display').innerText = "Роль еще не назначена...";
}