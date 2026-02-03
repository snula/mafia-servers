// game.js - для страницы игры (/game.html)
class MafiaGame {
    constructor(roomCode, playerName) {
        this.roomCode = roomCode;
        this.playerName = playerName;
        this.players = [];
        this.phase = 'waiting'; // waiting, night, day, voting
        this.roles = {};

        this.init();
    }

    async init() {
        await this.joinGame();
        this.setupWebSocket();
        this.renderUI();
    }

    async joinGame() {
        // В реальном приложении здесь будет запрос к серверу
        console.log(Игрок ${this.playerName} присоединился к комнате ${this.roomCode});
    }

    setupWebSocket() {
        // Здесь будет подключение к WebSocket серверу
        this.ws = new WebSocket(ws://your-server.com/ws/${this.roomCode});

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };

        this.ws.onopen = () => {
            console.log('WebSocket соединение установлено');
        };
    }

    handleMessage(data) {
        switch (data.type) {
            case 'player_joined':
                this.addPlayer(data.player);
                break;
            case 'player_left':
                this.removePlayer(data.player);
                break;
            case 'game_started':
                this.startGame(data.roles);
                break;
            case 'night_start':
                this.startNight();
                break;
            case 'day_start':
                this.startDay();
                break;
            case 'vote_result':
                this.showVoteResult(data.result);
                break;
        }
    }

    addPlayer(playerName) {
        if (!this.players.includes(playerName)) {
            this.players.push(playerName);
            this.updatePlayersList();
        }
    }

    removePlayer(playerName) {
        this.players = this.players.filter(p => p !== playerName);
        this.updatePlayersList();
    }

    updatePlayersList() {
        // Обновление UI списка игроков
        const list = document.getElementById('playersList');
        if (list) {
            list.innerHTML = this.players.map(p =>
                <div class="player-item">${p}${p === this.playerName ? ' (Вы)' : ''}</div>
            ).join('');
        }
    }

    startGame(roles) {
        this.roles = roles;
        this.phase = 'night';
        // Показать роль игрока
        if (roles[this.playerName]) {
            alert(Ваша роль: ${roles[this.playerName]});
        }
    }

    renderUI() {
        // Рендеринг интерфейса игры
        document.getElementById('roomCodeDisplay').textContent = this.roomCode;
        document.getElementById('playerNameDisplay').textContent = this.playerName;
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    const playerName = urlParams.get('player');

    if (roomCode && playerName) {
        window.game = new MafiaGame(roomCode, playerName);
    } else {
        alert('Не указаны параметры комнаты!');
        window.location.href = '/';
    }
});