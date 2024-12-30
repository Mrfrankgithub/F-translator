const searchInput = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const image = document.querySelector('.icon')

async function getweather(city) {
    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=abf4f2425189afc9b8b05fe7161e447c&units=metric`);
    if(res.status == 404){
        document.querySelector('.error').style.display = "block";
    } else {
        document.querySelector('.error').style.display = "none";

    }
    let data = await res.json();
    document.querySelector('.celcius').innerHTML = Math.round(data.main.temp)  + "°C";
    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.humidityP').innerHTML = Math.round(data.main.humidity) + "%";
    document.querySelector('.windS').innerHTML = Math.round(data.wind.speed) + "km/h";

    if (data.weather[0].main == "Clouds") {
        image.src = "./weatherImages/clouds.jpg"
    }else if (data.weather[0].main == "Clear"){
        image.src = "./weatherImages/sunny.jpg"
    }
    else if (data.weather[0].main == "Rain"){
        image.src = "./weatherImages/rain.jpg"
    }
    else if (data.weather[0].main == "Drizzle"){
        image.src = "./weatherImages/rain2.png"
    }
    else if (data.weather[0].main == "Mist"){
        image.src = "./weatherImages/mist.jpg"
    }

}

searchBtn.addEventListener('click',() => {
    getweather(searchInput.value);
})


// JavaScript can be used for additional control if needed
// For instance, to stop the animation on hover, you can use the following code:

document.getElementById('movingImage').addEventListener('mouseover', () => {
    document.getElementById('movingImage').style.animationPlayState = 'paused';
});

document.getElementById('movingImage').addEventListener('mouseout', () => {
    document.getElementById('movingImage').style.animationPlayState = 'running';
});
