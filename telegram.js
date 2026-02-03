<script>
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand(); // Разворачивает приложение на весь экран

    let players = [];
    let myRole = "";
    let isNight = true;
    let selectedPlayer = null;

    // Инициализация игры
    function startGame() {
        const count = document.getElementById('playerCount').value;
        if (count < 4) return alert("Нужно минимум 4 игрока");

        document.getElementById('lobby').classList.remove('active');
        document.getElementById('game').classList.add('active');

        generatePlayers(count);
        assignRole();
        renderPlayers();

        // Сообщаем Telegram, что игра началась (вибрация)
        tg.HapticFeedback.notificationOccurred('success');
    }

    function generatePlayers(count) {
        players = [];
        for (let i = 1; i <= count; i++) {
            players.push({
                id: i,
                name: "Игрок " + i,
                isAlive: true,
                role: i === 1 ? 'mafia' : 'citizen' // Для примера: первый всегда мафия
            });
        }
    }

    function assignRole() {
        myRole = players[0].role; // В этом демо ты — Игрок 1
        const display = document.getElementById('roleDisplay');
        display.innerText = "Ваша роль: " + (myRole === 'mafia' ? "МАФИЯ 🔴" : "МИРНЫЙ 🔵");
        display.style.color = myRole === 'mafia' ? "#ef4444" : "#38bdf8";
    }

    function renderPlayers() {
        const container = document.getElementById('playerContainer');
        container.innerHTML = "";
        players.forEach(p => {
            const card = document.createElement('div');
            card.className = `player-card ${!p.isAlive ? 'dead' : ''}`;
            card.innerText = p.name;
            card.onclick = () => selectPlayer(p.id, card);
            container.appendChild(card);
        });
    }

    function selectPlayer(id, element) {
        if (!players.find(p => p.id === id).isAlive) return;

        document.querySelectorAll('.player-card').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');
        selectedPlayer = id;

        tg.HapticFeedback.impactOccurred('light'); // Легкая вибрация при выборе
    }

    function processAction() {
        if (!selectedPlayer) return alert("Сначала выберите игрока!");

        const log = document.getElementById('gameLog');
        log.innerHTML += `<div>Ход подтвержден для игрока ${selectedPlayer}</div>`;

        // Здесь должна быть логика смены дня и ночи
        togglePhase();
    }

    function togglePhase() {
        isNight = !isNight;
        document.body.classList.toggle('day-mode');
        const phaseText = isNight ? "ГОРОД ЗАСЫПАЕТ..." : "ГОРОД ПРОСЫПАЕТСЯ";
        document.getElementById('phaseDisplay').innerText = phaseText;
    }
</script>