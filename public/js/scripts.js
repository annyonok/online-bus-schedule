// функции для запроса и заполнения таблицы
const fetchBusData = async () => {
    try {
        const response = await fetch('/next-departure');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const buses = response.json();
        return buses;
    } catch (error) {
        console.log(`Error fetching bus data: ${error}`);
    }
};

// функции для форматирования времени ISO формата
const formatDate = (date) => date.toISOString().split('T')[0];
const formatTime = (date) => date.toTimeString().split(' ')[0].slice(0, 5);

const getTimeRemainingSeconds = (departureTime) => {
    const now = new Date();
    const timeDeference = departureTime - now;
    return Math.floor(timeDeference / 1000);
};

const renderBusData = (buses) => {
    const tableBody = document.querySelector('#bus tbody');
    tableBody.textContent = '';

    buses.forEach(bus => {
        const row = document.createElement('tr');

        const nextDepartureDateTimeUTC = new Date(`${bus.nextDeparture.date}T${bus.nextDeparture.time}Z`,);

        const remainingSeconds = getTimeRemainingSeconds(nextDepartureDateTimeUTC);

        const remainingTimeText = remainingSeconds < 60 ? 'Отправляется' : bus.nextDeparture.remaining;

        row.innerHTML = `
        <td>${bus.busNumber}</td>
        <td>${bus.startPoint} - ${bus.endPoint}</td>
        <td>${formatDate(nextDepartureDateTimeUTC)}</td>
        <td>${formatTime(nextDepartureDateTimeUTC)}</td>
        <td>${remainingTimeText}</td>
        `;

        tableBody.append(row);
    });
};

// после деплоя проекта на render.com, возможно нужно будет поменять ws на wss
const initWebSocket = () => {
    const ws = new WebSocket(`wss://${location.host}`);

    ws.addEventListener('open', () => {
        console.log('WebSocket connection');
    });

    ws.addEventListener('message', (event) => {
        const buses = JSON.parse(event.data);
        renderBusData(buses)
    });

    ws.addEventListener('error', (error) => {
        console.log(`WebSocket error ${error}`);
    });

    ws.addEventListener('close', () => {
        console.log(`WebSocket connection close`);
    });
};

const updateTime = () => {
    const currentTimeElement = document.querySelector('#current-time');
    const now = new Date();
    currentTimeElement.textContent = now.toTimeString().split(' ')[0];

    setTimeout(() => {
        updateTime();
    }, 1000);
};

const init = async () => {
    const buses = await fetchBusData();
    renderBusData(buses);

    initWebSocket();

    updateTime();
};

init();
