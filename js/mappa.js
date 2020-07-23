const cities = [
    { city: "abuja", lat: 11.396396, lng: 5.076543 },
    { city: "minsk", lat: 53.893009, lng: 27.567444 },
    { city: "delhi", lat: 28.644800, lng: 77.216721 },
    { city: "makhachkala", lat: 42.9763794, lng: 47.5023613 },
    { city: "london", lat: 51.509865, lng: -0.118092 },
    { city: "paris", lat: 48.864716, lng: 2.349014 },
    { city: "la", lat: 34.052235, lng: 118.243683 },
    { city: "toronto", lat: 43.651070, lng: 79.347015 },
    { city: "bali", lat: -8.409518, lng: 115.188919 },
    { city: "irkutsk", lat: 52.2977791, lng: 104.2963867 }
];

const speed = 0.5

window.addEventListener("load", () => {
    initMap();

   setTimeout(() => {
        launchDemoAnimation("abuja", "minsk")
        .then(() => {
            return launchDemoAnimation("minsk", "delhi")
        })
        .then(() => {
            return launchDemoAnimation("delhi", "makhachkala")
        })
        .then(() => {
            return launchDemoAnimation("makhachkala", "london")
        })
        .then(() => {
            return launchDemoAnimation("london", "paris")
        })
        .then(() => {
            return launchDemoAnimation("paris", "la")
        })
        .then(() => {
            return launchDemoAnimation("la", "toronto")
        })
        .then(() => {
            return launchDemoAnimation("toronto", "bali")
        })
        .then(() => {
            return launchDemoAnimation("bali", "irkutsk")
        })
        .then(() => {
            return launchDemoAnimation("irkutsk", "minsk")
        })
    }, 1000);
})

function initMap() {
    let map = L.map('map').setView([50.84673, 4.35247], 12);

    L.tileLayer('https://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' +
            ', Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>',
        maxZoom: 18
    }).addTo(map);

    let markers = []

    cities.forEach((city) => {

        let marker = L.marker([city.lat, city.lng]).addTo(map);

        L.DomUtil.addClass(marker._icon, city.city);

        markers.push(marker)
    });

    let group = new L.featureGroup(markers);

    map.fitBounds(group.getBounds());
}

function launchDemoAnimation(cityFrom, cityTo) {
    let plane = document.querySelector('.plane');

    let from = document.querySelector("." + cityFrom);
    let coordsFrom = from.style.transform
        .replace("translate3d(", "")
        .replace(")", "")
        .split(",")
        .map((value) => parseInt(value))

    plane.style.left = coordsFrom[0] + 'px';
    plane.style.top = coordsFrom[1] + 'px';


    let to = document.querySelector("." + cityTo);
    let coordsTo = to.style.transform
        .replace("translate3d(", "")
        .replace(")", "")
        .split(",")
        .map((value) => parseInt(value))

    return animateTo(plane, coordsTo[0], coordsTo[1]);
}

function animateTo(dom_elem, x, y) {
    return new Promise((resolve) => {
        dom_elem.style.display = "block"

        let pos = {
            x: parseInt(dom_elem.style.left),
            y: parseInt(dom_elem.style.top)
        };

        let calcError = 2

        

        function animate() {    
            let xToTarget = x - pos.x;
            let yToTarget = y - pos.y;

            let scale = speed/Math.sqrt(Math.pow(xToTarget, 2) + Math.pow(yToTarget, 2));

            let delta_x = xToTarget * scale;
            let delta_y = yToTarget * scale;

            pos.x += delta_x;
            pos.y += delta_y;

            dom_elem.style.left = pos.x + 'px';
            dom_elem.style.top = pos.y + 'px';

            console.log(pos.x, x, pos.y, y)

            if (Math.abs(pos.x - x) < calcError && Math.abs(pos.y - y) < calcError) {
                resolve()

                return
            }

           setTimeout(animate, 1);
        }
        

       setTimeout(animate, 10);
    })
}