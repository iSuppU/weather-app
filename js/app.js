// ----- Main info Container
const mainInfo = document.querySelector('.main__info');

// ---- Cards
const cardMaxMin = document.getElementById('max-min'),
      cardWind = document.getElementById('wind'),
      cardSunriseSunset = document.getElementById('sunrise-sunset')
      cardHumidity = document.getElementById('humidity'),
      cardVisibility = document.getElementById('visibility'),
      cardCloudiness = document.getElementById('cloudiness');

const cards = document.querySelectorAll('.card');

// -------- Otros elementos
const infoContainer = document.querySelector('.info__container');

const errors = document.querySelector('.potential-errors');

const spinner = document.querySelector('.spinner__container')

const form = document.getElementById('form');


window.addEventListener('load', () => {
    mainInfo.style.display = 'none';

    cards.forEach(card => card.style.display = 'none');
    form.addEventListener('submit', prepararAPI);
});


function prepararAPI(e) {
    e.preventDefault();


    mainInfo.style.display = 'none';
    mainInfo.style.opacity = '0';
    cards.forEach(card => card.style.display = 'none');

    const pais = document.getElementById('pais').value;
    const ciudad = document.getElementById('ciudad').value;

    if(pais === '' || ciudad === '') {
        mostrarError('Todos los campos deben ser rellenados');
        return;
    }

    limpiarHTML(errors);

    llamarAPI(pais, ciudad);

}

function llamarAPI(pais, ciudad) {

    spinner.style.display = 'block'
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=19d7ca0814d26059779c57f55cb6432b`)
        .then( respuesta => respuesta.json())
        .then( datos => cargarDatos(datos))
        .catch( error => {
            mostrarError('Ciudad no encontrada, revisa los campos');
            spinner.style.display = 'none'
            return;
        })
        
}

function cargarDatos(datos) {
    spinner.style.display = 'none'

    loadMainInfo(datos);
    loadMaxMin(datos);
    loadWind(datos);
    loadSunriseSunset(datos);
    loadHumidity(datos);
    loadVisibility(datos);
    loadCloudiness(datos);

    // Asegura que todas las cartas se muestren al mismo tiempo con su informacion correspondiente
    showAllInfo();
}

// ----------------Funciones modificadoras del DOM

function showAllInfo() {
    infoContainer.style.display = 'block';

    mainInfo.style.display = 'block';

    cards.forEach( card => card.style.display = 'initial');
}

function mostrarError(msj) {
    infoContainer.style.display = 'none';
    const alerta = document.querySelector('.msj-error');


    if(!alerta) {
        msjError = document.createElement('p');

        msjError.classList.add('msj-error');
        msjError.textContent = `Error: ${msj}`;

        errors.appendChild(msjError);

    }
}

// Muestra la temperatura actual y el nombre de la ciudad
function loadMainInfo({ name, main: { temp }, weather: { [0]: { icon } }, timezone }) {

    limpiarHTML(mainInfo);
    tempC = kelvinACentigrados(temp);

    // Crea los divs y el texto dentro de ellos
    const divTemp = document.createElement('div');
    divTemp.classList.add('current-temp__container');
    const imgTemp = document.createElement('img');
    imgTemp.setAttribute('src', `http://openweathermap.org/img/w/${icon}.png`);
    const showTemp = document.createElement('p');
    showTemp.classList.add('text');
    showTemp.textContent = `${tempC} °C`;

    divTemp.appendChild(imgTemp);
    divTemp.appendChild(showTemp);

    const divName = document.createElement('div');
    divName.classList.add('city-name__container');

    const showCity = document.createElement('p');
    showCity.classList.add('text');
    showCity.textContent = `${name}`;

    const showCountry = document.createElement('p');
    showCountry.textContent = `${document.getElementById('pais').value}`;
    showCountry.classList.add('text', 'country')

    const divDate = document.createElement('div');
    divDate.classList.add('hours__container');

    const showDate = document.createElement('p');
    showDate.classList.add('text');
    showDate.textContent = `${convertirFecha(timezone)}`;

    divDate.appendChild(showDate);


    divName.appendChild(showCity);
    divName.appendChild(showCountry);


    // Inserta los divs al documento
    mainInfo.appendChild(divTemp);
    mainInfo.appendChild(divName);
    mainInfo.appendChild(divDate);
}

function loadMaxMin({ main: { temp_max, temp_min } }) {
    limpiarHTML(cardMaxMin);

    // Crea el titutlo de la card
    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('card__title')
    cardTitle.textContent = 'Temperatura';

    // Crea el div padre de las temperaturas MAX, MIN
    const divTemp = document.createElement('div');
    divTemp.classList.add('card-father__container')
    // Crea div para la temperatura MAX
    const tempMax = document.createElement('div');
    tempMax.classList.add('card-info__container');

    // Crea la imagen de la temperatura MAX
    const tempMaxImg = document.createElement('figure');
    tempMaxImg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" transform:;-ms-filter:"><path d="M12.001,1.993C6.486,1.994,2,6.48,2,11.994c0.001,5.514,4.487,10,10,10c5.515,0,10.001-4.486,10.001-10 S17.515,1.994,12.001,1.993z M12,19.994c-4.41,0-7.999-3.589-8-8c0-4.411,3.589-8,8.001-8.001c4.411,0.001,8,3.59,8,8.001 S16.412,19.994,12,19.994z"></path><path d="M12.001 8.001L7.996 12.006 11.001 12.006 11.001 16 13.001 16 13.001 12.006 16.005 12.006z"></path></svg>`;
    tempMaxImg.classList.add('card-info__img');

    // Crea el texto de la temperatura
    const tempMaxText = document.createElement('p');
    tempMaxText.classList.add('temp_max', 'card-info__text', 'text');
    tempMaxText.textContent = `Max: ${kelvinACentigrados(temp_max)}°C`;

    // Insertando img y text al div temp Max
    tempMax.appendChild(tempMaxImg);
    tempMax.appendChild(tempMaxText);

    // Insertando info temp MAX al div padre
    divTemp.appendChild(tempMax);

    // Crea div para la temperatura MIN
    const tempMin = document.createElement('div');
    tempMin.classList.add('card-info__container');

    // Crea la imagen de la temperatura MIN
    const tempMinImg = document.createElement('figure');
    tempMinImg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" transform:;-ms-filter:"><path d="M12,1.993C6.486,1.994,2,6.48,2,11.994c0,5.513,4.486,9.999,10,10c5.514,0,10-4.486,10-10S17.515,1.994,12,1.993z M12,19.994c-4.411-0.001-8-3.59-8-8c0-4.411,3.589-8,8-8.001c4.411,0.001,8,3.59,8,8.001S16.411,19.994,12,19.994z"></path><path d="M13 8L11 8 11 12 7.991 12 11.996 16.005 16 12 13 12z"></path></svg>`;
    tempMinImg.classList.add('card-info__img');

    // Crea el texto de la temperatura MIN
    const tempMinText = document.createElement('p')
    tempMinText.classList.add('temp_min', 'card-info__text', 'text');
    tempMinText.textContent = `Min: ${kelvinACentigrados(temp_min)}°C`;

    // Insertando img y text al div temp MIN
    tempMin.appendChild(tempMinImg);
    tempMin.appendChild(tempMinText);

    // Insertando info temp MIN al div padre
    divTemp.appendChild(tempMin);

    cardMaxMin.appendChild(cardTitle);  // Inserta el titutlo a la card
    cardMaxMin.appendChild(divTemp);   // Inserta todo el codigo de las temperaturas a la card
}

function loadWind({ wind: { deg, speed } }) {
    limpiarHTML(cardWind);

    // Crea titulo de la card
    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('card__title')
    cardTitle.textContent = 'Viento';

    // Transforma la velocidad de m/s a km/h
    const velocidad = calcularVelocidadViento(speed);

    // Crea la informacion principal de la card
    const cardText = document.createElement('p');
    cardText.classList.add('card__text', 'text');
    cardText.innerHTML = `${velocidad} <span id="km">km/h</span>`;

    // Calcula la direccion del viento
    const direccionViento = calcularDireccionViento(deg);

    // Crea div para la informacion secundaria
    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card__footer');

    // Crea img de la informacion secundaria
    const cardFooterArrow = document.createElement('div');
    cardFooterArrow.innerHTML = `<svg fill="#bbbaba" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" transform:;-ms-filter:"><path d="M11 8.414L11 18 13 18 13 8.414 17.293 12.707 18.707 11.293 12 4.586 5.293 11.293 6.707 12.707z"></path></svg>`;
    cardFooterArrow.style.transform = `rotate(${deg}deg)`;

    cardFooter.appendChild(cardFooterArrow);    // Inserta la imagen

    // Crea la informacion secundaria
    const cardFooterText = document.createElement('p');
    cardFooterText.classList.add('card-footer__text', 'text');
    cardFooterText.textContent = `${direccionViento}`

    cardFooter.appendChild(cardFooterText)     // Inserta la informacion secundaria

    // Inserta todo el codigo a la card
    cardWind.appendChild(cardTitle);
    cardWind.appendChild(cardText);
    cardWind.appendChild(cardFooter);
}

function loadSunriseSunset({  sys: { sunrise, sunset }, timezone }) {
    limpiarHTML(cardSunriseSunset);

    // Crea el titutlo de la card
    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('card__title')
    cardTitle.textContent = 'Amanecer y Atardecer';

    // Crea el div padre del amanecer y atardecer
    const divSun = document.createElement('div');
    divSun.classList.add('card-father__container')

    // Crea div para el amanecer
    const sunRise = document.createElement('div');
    sunRise.classList.add('card-info__container');

    // Crea la imagen del amanecer
    const sunRiseImg = document.createElement('img');
    sunRiseImg.setAttribute('src', 'img/sunrise.svg')
    sunRiseImg.classList.add('card-info__img');

    // Crea la hora del atardecer
    const sunRiseText = document.createElement('p');
    sunRiseText.classList.add('sunrise', 'card-info__text', 'text');
    sunRiseText.textContent = `${convertirAHora(sunrise, timezone)} a.m`;

    // Insertando img y text al div Amanecer
    sunRise.appendChild(sunRiseImg);
    sunRise.appendChild(sunRiseText);

    // Insertando info amanecer al div padre
    divSun.appendChild(sunRise);

    // Crea div para el atardecer
    const sunSet = document.createElement('div');
    sunSet.classList.add('card-info__container');

    // Crea la imagen del atardecer
    const sunSetImg = document.createElement('img');
    sunSetImg.setAttribute('src', `img/sunset.svg`)
    sunSetImg.classList.add('card-info__img');

    // Crea el texto del atardecer
    const sunSetText = document.createElement('p')
    sunSetText.classList.add('sunset', 'card-info__text', 'text');
    sunSetText.textContent = `${convertirAHora(sunset, timezone)} p.m`;

    // Insertando img y text al div Atardecer
    sunSet.appendChild(sunSetImg);
    sunSet.appendChild(sunSetText);

    // Insertando info atardecer al div padre
    divSun.appendChild(sunSet);

    cardSunriseSunset.appendChild(cardTitle);  // Inserta el titutlo a la card
    cardSunriseSunset.appendChild(divSun);   // Inserta todo el codigo de las temperaturas a la card
}

function loadHumidity({ main: { humidity } }) {
    limpiarHTML(cardHumidity);

    // Crea titulo de la card
    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('card__title')
    cardTitle.textContent = 'Humedad';

    // Crea la informacion de la card
    const cardText = document.createElement('p');
    cardText.classList.add('card__text', 'text');
    cardText.innerHTML = `${humidity}<span class="figure">%</span>`;

    // Inserta titulo e informacion a la card
    cardHumidity.appendChild(cardTitle);
    cardHumidity.appendChild(cardText);
}

function loadVisibility({ visibility }) {
    limpiarHTML(cardVisibility);

    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('card__title')
    cardTitle.textContent = 'Visibilidad';

    // Crea la informacion de la card
    const cardText = document.createElement('p');
    cardText.classList.add('card__text', 'text');
    cardText.innerHTML = `${(visibility/1000).toFixed(1)}<span id="km">km</span>`;

    // Inserta titulo e informacion a la card
    cardVisibility.appendChild(cardTitle);
    cardVisibility.appendChild(cardText);
}

function loadCloudiness({ clouds: { all } }){
    limpiarHTML(cardCloudiness);

    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('card__title')
    cardTitle.textContent = 'Nubosidad';

    // Crea la informacion de la card
    const cardText = document.createElement('p');
    cardText.classList.add('card__text', 'text');
    cardText.innerHTML = `${all}<span class="figure">%</span>`;

    // Inserta titulo e informacion a la card
    cardCloudiness.appendChild(cardTitle);
    cardCloudiness.appendChild(cardText);
}

// ---------------- Funciones de utilidad

// Obtiene la hora actual del lugar que se esta consultando
function convertirFecha(timezone) {

    const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

    const diferenciaHoras = timezone/3600;
    const fechaUTC = new Date();
    const minutos = '0' + fechaUTC.getMinutes();

    const horaActual = fechaUTC.getUTCHours() < (diferenciaHoras * -1)
                    ? ( fechaUTC.getUTCHours() + 12) + diferenciaHoras + 12
                    : fechaUTC.getUTCHours() + diferenciaHoras;



    const newHoraActual = horaActual > 12
                        ? horaActual - 12
                        : horaActual;

    const horaConvertida = horaActual > 12
                        ? `${weekDays[fechaUTC.getUTCDay()]}, ${newHoraActual}:${minutos.substr(-2)} p.m`
                        : `${weekDays[fechaUTC.getUTCDay()]}, ${newHoraActual}:${minutos.substr(-2)} a.m`;

    return horaConvertida;
}

// Convierte los grados kelvin a centigrados
const kelvinACentigrados = grados => Math.round(grados - 273.15);

// Convierte la velocidad del viento a km/h
function calcularVelocidadViento(velocidad) {
    vel = (velocidad*3600)/1000;
    return  vel.toFixed(2);
}

function convertirAHora(unix, timezone) {
    const date = new Date(unix * 1000);

    const diferenciaHoras = timezone/3600;

    const horas = date.getUTCHours() < 12
                ? date.getUTCHours() + diferenciaHoras + 12
                : date.getUTCHours() + diferenciaHoras

    const newHoras = horas > 12
                    ? horas - 12
                    : horas;

    const minutos = '0' + date.getMinutes();

    const tiempoConvertido = `${newHoras}:${minutos.substr(-2)}`;

    return tiempoConvertido;
}

// Convierte a texto la direccion del viento
function calcularDireccionViento(deg) {
    if( deg > -22 && deg < 22) {
        return 'N';
    } else if( deg === 22 ) {
        return 'NNE';
    } else if( deg > 22 && deg < 46 ) {
        return 'NE';
    } else if ( deg === 46 ) {
        return 'ENE';
    } else if( deg > 46 && deg < 115) {
        return 'E';
    } else if( deg === 115 ) {
        return 'ESE';
    } else if( deg > 115 && deg < 135 ) {
        return 'SE';
    } else if( deg === 135 ) {
        return 'SSE';
    } else if( deg > 135 && deg < 202 ) {
        return 'S';
    } else if( deg === 202 ) {
        return 'SSW';
    } else if( deg > 202 && deg < 247) {
        return 'SW';
    } else if( deg === 247 ) {
        return 'WSW';
    } else if( deg > 247 && deg < 292 ) {
        return 'W';
    } else if( deg === 292 ) {
        return 'WNW';
    } else if( deg > 292 && deg < 337 ) {
        return 'NW';
    } else if( deg === 337) {
        return 'NNW';
    } else if( deg > 337 || deg === 0) {
        return 'N'
    }
}

// Limpia el HTML previo dependiendo de donde es llamado
function limpiarHTML(target) {
    while(target.firstChild) {
        target.removeChild(target.firstChild);
    }
}
