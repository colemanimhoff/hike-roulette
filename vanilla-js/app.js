const locationInput = document.querySelector('#location-search')
const searchButton = document.querySelector('button')
const resultsContainerLeft = document.querySelector('.results-container-left')
const resultsContainerRight = document.querySelector('.results-container-right')
let mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json'
let trailsUrl = 'https://www.hikingproject.com/data/get-trails'

searchButton.addEventListener('click', buildHike)

function buildHike(event) {
    event.preventDefault()
    retrieveData(buildMapUrl())
    .then(coords => ({ lat: coords.results[0].geometry.location.lat, lng: coords.results[0].geometry.location.lng }))
    .then(initNewMap)
    .then(coords => buildHikeUrl(coords))
    .then(url => retrieveData(url))
    // .then(hikes => console.log(hikes))
    .then(handleResponse)
}

function retrieveData(url) {
    return fetch(url)
    .then(response => response.json())
    .catch(error => console.log(error))
}

function buildMapUrl(event) {
    const mapKey = 'AIzaSyA4yXevHDF0z_UQXzORlWSBxvO0WjLF2n8'
    const formattedLocation = locationInput.value.replace(/[' ']/g, '+')
    return mapUrl.concat(`?address=${formattedLocation}&key=${mapKey}`)
}

function buildHikeUrl(coords) {
    const hikeKey = '200253320-d9a4869696803932f46dbb7a5ad5e852'
    const maxDistance = formattedDistaceToTravel()
    const minLength = formattedLengthOfHike()
    return trailsUrl.concat(`?key=${hikeKey}&lat=${coords.lat}&lon=${coords.lng}&maxDistance=${maxDistance}&minLength=${minLength}&maxResults=500`)
}

function formattedDistaceToTravel() {
    const distanceToTravel = document.querySelector('#distance-to-travel')
    if (distanceToTravel.value === '50 miles or less') {
        return 50
    } else if (distanceToTravel.value === '100 miles or less') {
        return 100
    } else return 200
}

function formattedLengthOfHike() {
    const hikeLength = document.querySelector('#length-of-hike')
    if (hikeLength.value === 'At Least 5 Miles') {
        return 5
    } else if (hikeLength.value === 'At Least 10 Miles') {
        return 10 
    } else if (hikeLength.value === 'At Least 20 Miles') {
        return 20 
    } else {
        return 0
    }
}

function initDefaultMap() {
    locationAutocomplete()
    const options = {
        zoom: 1,
        center: { lat: 38.9072, lng: -77.0369 }
    }
    const map = new google.maps.Map(document.getElementById('map'), options)
}

function initNewMap({lat, lng}) {
    const options = {
        zoom: 6,
        center: { lat, lng }
    }
    
    const map = new google.maps.Map(document.getElementById('map'), options)
    let marker = new google.maps.Marker({
        position: { lat, lng },
        map: map
    })
    return  { lat, lng }
}


function locationAutocomplete(event) {
    const options = {
        types: ['(cities)']
    }
    const input = document.getElementById('location-search')
    const autocomplete = new google.maps.places.Autocomplete(input, options)
    const infowindow = new google.maps.InfoWindow()
    const infowindowContent = document.getElementById('infowindow-content')
    infowindow.setContent(infowindowContent)
}

function buildHikeCard(trail) {
    clearContainers()
    createHikeTitle(trail)
    createHikeImg(trail)
    createHikeSummary(trail)
    createTrailDetailsList(trail)
}

function createPlaceholder() {
    clearContainers()
    const placeholderImg = createElement('img')
    addAttr(placeholderImg, 'src', 'https://images.unsplash.com/photo-1447117219916-d8cb5f373434?ixlib=rb-0%E2%80%A6EyMDd9&s=b606af1%E2%80%A6&auto=format&fit=crop&w=1700&q=80')
    addClass(placeholderImg, 'hike-img')
    appendElement(resultsContainerLeft, placeholderImg)
    const errorMessage = createElement('p')
    addClass(errorMessage, 'error-message')
    addClass(resultsContainerRight, 'error-message-container')
    addText(errorMessage, 'Sorry, there are no hikes available in the area at this time. Please try again...')
    appendElement(resultsContainerRight, errorMessage)
}

function createHikeTitle(trail) {
    const hikeTitle = createElement('h3')
    addText(hikeTitle, trail.name)
    addClass(hikeTitle, 'hike-title')
    appendElement(resultsContainerLeft, hikeTitle)
}

function createHikeImg(trail) {
    const hikeImgContainer = createElement('div')
    addClass(hikeImgContainer, 'hike-img-container')
    appendElement(resultsContainerLeft, hikeImgContainer)
    const hikeImg = createElement('img')
    addClass(hikeImg, 'hike-img')
    trail.imgMedium === '' ? addAttr(hikeImg, 'src', 'https://images.unsplash.com/photo-1414542563971-94513793d046?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=df19d8729ad34a6056090cdcabab31f7&auto=format&fit=crop&w=1650&q=80') : addAttr(hikeImg, 'src', trail.imgMedium)
    appendElement(hikeImgContainer, hikeImg)
}

function createHikeSummary(trail) {
    const trailSummary = createElement('p')
    addText(trailSummary, trail.summary)
    addClass(trailSummary, 'hike-summary')
    appendElement(resultsContainerLeft, trailSummary)
}

function createTrailSummary(trail) {
    const trailSummary = createElement('p')
    addText(trailSummary, trail.summary)
    addClass(trailSummary, 'trail-summary')
    appendElement(trailCardLeft, trailSummary)
}

function createTrailDetailsList(trail) {
    const trailDetailsList = createElement('ul')
    addClass(trailDetailsList, 'hike-details')
    appendElement(resultsContainerRight, trailDetailsList)
    const trailLocation = createElement('li')
    addText(trailLocation, `Location: ${trail.location}`)
    appendElement(trailDetailsList, trailLocation)
    const trailDifficulty = createElement('li')
    addText(trailDifficulty, `Difficulty: ${trail.difficulty}`)
    appendElement(trailDetailsList, trailDifficulty)
    const trailLength = createElement('li')
    addText(trailLength, `Length: ${trail.length} mi.`)
    appendElement(trailDetailsList, trailLength)
    const trailConditions = createElement('li')
    trail.conditionDetails === null 
        ? addText(trailConditions, `Conditions: not available`) 
        : addText(trailConditions, `Conditions: ${trail.conditionStatus}, updated on ${trail.conditionDate}`)
    appendElement(trailDetailsList, trailConditions)
    const trailConditionsDetails = createElement('li')
    trail.conditionStatus === 'Unknown'
        ? addText(trailConditionsDetails.textContent = `Condition Details: not available`)
        : addText(trailConditionsDetails, `Condition Details: ${trail.conditionDetails}`)
    appendElement(trailDetailsList, trailConditionsDetails)
    const elevationHighandLow = createElement('li')
    addText(elevationHighandLow, `Elevation Low: ${trail.low} ft., Elevation High: ${trail.high} ft.`)
    appendElement(trailDetailsList, elevationHighandLow)
    const ascentAndDescent = createElement('li')
    addText(ascentAndDescent, `Ascent: ${trail.ascent} ft., Descent: ${trail.descent} ft.`)
    appendElement(trailDetailsList, ascentAndDescent)
    const trailRating = createElement('li')
    addText(trailRating, `Trail Rating: ${trail.stars}/5 -from ${trail.starVotes} review(s)`)
    appendElement(trailDetailsList, trailRating)
    const trailLink = createElement('a')
    addClass(trailLink, 'trail-link')
    addText(trailLink, 'Read More About This Trail')
    addAttr(trailLink, 'href', trail.url)
    addAttr(trailLink, 'target', 'about_blank')
    appendElement(trailDetailsList, trailLink)
}

function createElement(element) {
    return document.createElement(element)
}

function appendElement(parent, element) {
    return parent.appendChild(element)
}

function prependElement(parent, element) {
    return parent.prepend(element)
}

function addText(element, string) {
    return element.textContent = string
}

function addClass(element, string) {
    return element.classList.add(string)
}

function addAttr (element, attr, value) {
    return element.setAttribute(attr, value)
}

function randomIndex(number) {
    return Math.floor(Math.random() * number)
}

function handleResponse(hikes) {
    hikes.trails.length ===  0 ? createPlaceholder() : buildHikeCard(hikes.trails[randomIndex(hikes.trails.length)])
}

function clearContainers () {
    resultsContainerLeft.innerHTML = ''
    resultsContainerRight.innerHTML = ''
}