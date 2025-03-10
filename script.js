async function fetchForecastData(cityName) {
    let forecastData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=0f5af3c7db44adca576e8a6b8ce2c0e4&units=metric`);
    let formattedData = await forecastData.json();
    
    // Get the forecast container
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = ''; // Clear existing content
    
    // Get one forecast per day (data comes in 3-hour intervals)
    const dailyForecasts = new Map();
    formattedData.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateKey = date.toLocaleDateString();
        
        if (!dailyForecasts.has(dateKey)) {
            dailyForecasts.set(dateKey, forecast);
        }
    });
    
    // Take only the first 5 days
    let count = 0;
    for (let [dateKey, forecast] of dailyForecasts) {
        if (count >= 5) break;
        
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        const temp = Math.round(forecast.main.temp);
        
        const forecastHtml = `<h5 class="m-0 p-1 d-flex align-items-center"> ${temp}&deg;C &nbsp;&nbsp; ${dayName} &nbsp;&nbsp; ${dateStr} </h5>`;
        forecastContainer.innerHTML += forecastHtml;
        
        count++;
    }


    // 6hours update 
    // Update today's hourly forecast
const today = new Date().toLocaleDateString();
    const todayForecasts = formattedData.list.filter(item => {
        const itemDate = new Date(item.dt * 1000).toLocaleDateString();
        return itemDate === today;
    });

    // Update the heading with today's date
    const todayHead = document.getElementById('todayhead');
    todayHead.innerText = `Today (${today})`;

    // Define the target hours we want to display
    const targetHours = [6, 9, 12, 15, 18, 21]; // 6 AM, 9 AM, 12 PM, 3 PM, 6 PM, 9 PM
    
    // Update each time slot box
    targetHours.forEach((hour, index) => {
        // Find the closest forecast to the target hour
        const closestForecast = todayForecasts.reduce((prev, curr) => {
            const currHour = new Date(curr.dt * 1000).getHours();
            const prevHour = new Date(prev.dt * 1000).getHours();
            return Math.abs(currHour - hour) < Math.abs(prevHour - hour) ? curr : prev;
        }, todayForecasts[0]);

        if (closestForecast) {
            const temp = Math.round(closestForecast.main.temp);
            const timeStr = hour <= 12 ? `${hour} Am` : `${hour-12} Pm`;
            const boxElement = document.querySelector(`.row3box${index + 1} h5`);
            if (boxElement) {
                boxElement.innerHTML = `${timeStr} <br> ${temp}&deg;C`;
            }
        }
    });
}







function dateFormat(timestamp) {
    const date = new Date(timestamp * 1000);
    console.log(date.toUTCString());
    console.log(date.toLocaleString());
    return date.toLocaleString();
    


}

//fetching the latitude and longitude for gases like co2,so2,no2,o3

async function fetchAQIData(lat, lon) {
    let fetchAQIData = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=0f5af3c7db44adca576e8a6b8ce2c0e4`);
    let formattedData = await fetchAQIData.json();

    let list = formattedData.list[0].components;



    $('#coValue')[0].innerText = list.co;
    $('#so2Value')[0].innerText = list.so2;
    $('#no2Value')[0].innerText = list.no2;
    $('#o3Value')[0].innerText = list.o3;

}









async function fetchData() {





    let cityName = document.getElementById('searchInput').value;





    let requestData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=0f5af3c7db44adca576e8a6b8ce2c0e4&units=metric`);

    let formattedData = await requestData.json();

    console.log(formattedData);




    let responseCityName = formattedData.name;
    let responseTemp = formattedData.main.temp;
    let skyDescription = formattedData.weather[0].description;

    let pressure = formattedData.main.pressure;
    let humidity = formattedData.main.humidity;
    let seaLevel = formattedData.main.sea_level;
    let groundLevel = formattedData.main.grnd_level;




    $('#cityName')[0].innerText = responseCityName;
    $("#cityTemp")[0].innerText = responseTemp;
    $("#skyDesc")[0].innerText = skyDescription;

    $('#pressureValue')[0].innerText = pressure;
    $('#humidityValue')[0].innerText = humidity;
    $('#sealevelValue')[0].innerText = seaLevel;
    $('#groundlevelValue')[0].innerText = groundLevel;





    // Updating date and time

    let properDate = dateFormat(formattedData.dt);
    let date = properDate.split(',')[0];
    let time = properDate.split(',')[1];
    $("#date")[0].innerText = date;
    $("#time")[0].innerText = time;


    // Updating Sunrise and Sunset


    let sunriseTimeStamp = formattedData.sys.sunrise;
    let sunsetTimeStamp = formattedData.sys.sunset;

    let properSunriseTime = dateFormat(sunriseTimeStamp).split(',')[1];
    let properSunsetTime = dateFormat(sunsetTimeStamp).split(',')[1];

    $('#sunriseTime')[0].innerText = properSunriseTime;
    $('#sunsetTime')[0].innerText = properSunsetTime;



    let lat = formattedData.coord.lat;
    let lon = formattedData.coord.lon;

    fetchAQIData(lat, lon);

    fetchForecastData(cityName);






}