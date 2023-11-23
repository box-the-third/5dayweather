document.addEventListener("DOMContentLoaded", function () {
    const apiKey = '9fd162659cfe6e46e4bdcb2d20ed9d6f';

    document.getElementById('searchBtn').addEventListener('click', function () {
        const cityInput = document.getElementById('cityInput').value;

        if (cityInput) {
            const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log(data); 
                    displayWeatherData(data);
                })
                .catch(error => console.error('Error fetching weather data:', error));
        } else {
            alert('Please enter a city name.');
        }
    });

    function displayWeatherData(data) {
        const weatherDataElement = document.getElementById('weatherData');
        weatherDataElement.innerHTML = '';

        const groupedData = groupByDate(data.list);

        Object.keys(groupedData).forEach(date => {
            const dailyForecast = groupedData[date];

            const row = document.createElement('div');
            row.className = 'row mb-4 text-center align-items-center';
            const dateHeader = document.createElement('h5');
            dateHeader.className = 'col-md-12 font-weight-bold';
            const dateObject = new Date(date);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateHeader.textContent = dateObject.toLocaleDateString(undefined, options);
            row.appendChild(dateHeader);

            dailyForecast.forEach(item => {
                const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const column = document.createElement('div');
                column.className = 'col-md-2 mb-2';
                column.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${time}</h5>
                            <p class="card-text">Temperature: ${formatTemperature(item.main.temp)} &deg;C</p>
                            <p class="card-text">Precipitation: ${item.rain ? item.rain['3h'] || '0' : '0'} mm</p>
                            <p class="card-text">Feels Like: ${formatTemperature(item.main.feels_like)} &deg;C</p>
                            <p class="card-text">Humidity: ${item.main.humidity} %</p>
                            <p class="card-text">Wind Speed: ${item.wind.speed} m/s</p>
                            <p class="card-text">Pressure: ${item.main.pressure} hPa</p>
                            <img src="http://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="Weather Icon">
                            <p class="card-text">${item.weather[0].description}</p>
                        </div>
                    </div>
                `;

                row.appendChild(column);
            });

            weatherDataElement.appendChild(row);
        });
    }

    function formatTemperature(temp) {
        return (temp - 273.15).toFixed(2);
    }

    function groupByDate(list) {
        return list.reduce((grouped, item) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            grouped[date] = grouped[date] || [];
            grouped[date].push(item);
            return grouped;
        }, {});
    }
});
