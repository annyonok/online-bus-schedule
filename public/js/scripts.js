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


const renderBusData = (buses) => {
    const tableBody = document.querySelector('#bus tbody');
    tableBody.textContent = '';

    buses.forEach(bus => {
        const row = document.createElement('tr');

        const nextDepartureDateTimeUTC = new Date(`${bus.nextDeparture.date}T${bus.nextDeparture.time}Z`,);

        row.innerHTML = `
        <td>${bus.busNumber}</td>
        <td>${bus.startPoint} - ${bus.endPoint}</td>
        <td>${formatDate(nextDepartureDateTimeUTC)}</td>
        <td>${formatTime(nextDepartureDateTimeUTC)}</td>
        `;

        tableBody.append(row);
    });
};


const init = async () => {
    const buses = await fetchBusData();
    renderBusData(buses);
};

init();
