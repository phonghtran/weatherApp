/* 
==============================================
==============================================
Doc ready
==============================================
==============================================
*/

var currentLocation = {
		longitude: -73.949577,
		latitude: 40.650101,
		colorSpectrum: [
			'#1A237E',
			'#7986CB'
		]
	},
	defaultLocations = {
		brooklyn: { // brooklyn
			name: 'brooklyn',
			id: 5110302,
			preferredCard: 'cardBrooklyn',
			longitude: -73.949577,
			latitude: 40.650101,
			colorSpectrum: [
				'#1A237E',
				'#7986CB'
			],
			coverImage: 'https://untappedcities-wpengine.netdna-ssl.com/wp-content/uploads/2017/06/2_The-Top-10-Secrets-of-Downtown-Brooklyn-in-NYC_Brooklyn-Bridge_Sunset_NYC_Untapped-Cities.v1.jpg'
		},
		tokyo: { 
			name: 'tokyo',
			id: 1850147,
			preferredCard: 'cardTokyo',
			longitude: 139.691711,
			latitude: 35.689499,
			colorSpectrum: [
				'#BF360C',
				'#F4511E'
			],
			coverImage: 'https://www.telegraph.co.uk/content/dam/Travel/Destinations/Asia/Japan/Tokyo/Tokyo%20lead-xlarge.jpg'
		},
		santaMonica: { 
			name: 'santaMonica',
			id: 5393212,
			preferredCard: 'cardSantaMonica',
			longitude: -118.491188,
			latitude: 34.019451,
			colorSpectrum: [
				'#B71C1C',
				'#EF5350'
			],
			coverImage: 'https://www.santamonica.com/wp-content/uploads/2015/04/thumbnail_pier2.jpg'
		},
		amsterdam: { 
			name: 'amsterdam',
			id: 2759794,
			preferredCard: 'cardAmsterdam',
			longitude: 4.88969,
			latitude: 52.374031,
			colorSpectrum: [
				'#880E4F',
				'#EC407A'
			],
			coverImage: 'http://www.netherlands-tourism.com/wp-content/uploads/2014/11/Amsterdam.jpg'
		},
		honolulu: {
			name: 'honolulu',
			id: 5856195,
			preferredCard: 'cardHonolulu',
			longitude: -157.858337,
			latitude: 21.30694,
			colorSpectrum: [
				'#4a148c',
				'#BA68C8'
			],
			coverImage: 'https://travel.usnews.com/static-travel/images/destinations/59/waikiki_beach_honolulu.jpg'
		}
		
	},
	wW = 1024, wH = 768, cW = 1024, cH = 768, // window size and canvas height
	canvasAspectRatio = 1.33, // 4/3 ratio
	canvasObjectStorage = {};

$( document ).ready(function() {
	$(window).resize(function(){
		wW = $(window).width();
		wH = $(window).height();

		if (wW > 700) {
			canvasAspectRatio = 3;

			$('#searchToggle').attr('disabled', true);
		} else {
			$('#searchToggle').attr('disabled', false);
		}

		cW = $('#cardHolder').width();
		cH = cW / canvasAspectRatio;
	}).resize();

	for (city in defaultLocations){
		
		getWeatherData(defaultLocations[city]);
	}

	// turn back on at end
	// navigator.geolocation.getCurrentPosition(geo_success, geo_error);


	$('#searchToggle').on('click',function(e){
		e.preventDefault();

		$('body').toggleClass('searchMode');


		if ($('body').hasClass('searchMode')){
			for (city in defaultLocations){
				parseWeather(defaultLocations[city].name);
			}
		} else {
			window.requestAnimationFrame(function(){
				renderAnimation();
			});
		}
	});

	$('li.card').on('click',function(e){
		e.preventDefault();


		if ($('body').hasClass('searchMode') || (wW > 700)){
			var previousCity = $('#cardBrooklyn').attr('city');

			parseWeather($(this).attr('city'), 'cardBrooklyn');
			parseWeather(previousCity, $(this).attr('id'));

			$('body').removeClass('searchMode');
		}		
	});
}); // doc ready


function setupAnimation(mainWeatherCondition){
	var mainCategory = parseInt(mainWeatherCondition.weatherId / 100);
	
	canvasObjectStorage = {};

	switch  (mainCategory){
		case 2: // Group 2xx: Thunderstorm

			for (var i = 0; i < 2; i++){
				canvasObjectStorage[i] = {};

				canvasObjectStorage[i].image = new Image();
				canvasObjectStorage[i].image.src = prepSVGPathForCanvas(vectors.thunder);

				var scaleVector = cH / vectors.thunder.height * 0.8;

				canvasObjectStorage[i].viewBox = {
					x: 0,
					y: 0,
					w: vectors.thunder.width,
					h: vectors.thunder.height
				}

				canvasObjectStorage[i].targetViewBow = {
					x: cW - vectors.thunder.width * scaleVector * 1.1,
					y: 0,
					w: vectors.thunder.width * scaleVector,
					h: vectors.thunder.height * scaleVector
				}

				if (i == 0){
					canvasObjectStorage[i].transformation = {
						flash: true
					};
				}
			} // loop

		break;
		case 3: // Group 3xx: Drizzle
		case 5: // Group 5xx: Rain
		case 6: // Group 6xx: Snow

			var numOfItems = Math.floor(Math.random() * mainCategory ) + 2,
				dropSpeed = Math.random() * 2 + 1,
				targetVector = (mainCategory == 6) ? vectors.snow : vectors.rain;

			for (var i = 0; i <= numOfItems; i++){
				canvasObjectStorage[i] = {};

				canvasObjectStorage[i].image = new Image();
				canvasObjectStorage[i].image.src = prepSVGPathForCanvas(targetVector, {
					'path,polygon': {
						fill: 'rgba(255, 255, 255, ' + (Math.random() * 0.25 + 0.1).toFixed(2) + ')'
					}	
				});

				var newSize = (i == numOfItems) ? cH * 0.3 : Math.random() * 0.2 * cH + (cH * 0.2);

				canvasObjectStorage[i].viewBox = {
					x: 0,
					y: 0,
					w: targetVector.width,
					h: targetVector.height
				}

				canvasObjectStorage[i].targetViewBow = {
					x: (i == numOfItems) ? cW * 0.6 : Math.random() * cW * 1.15 - (cW * 0.15),
					y: (i == numOfItems) ? cH * 0.35 : Math.random() * cH - (cH * 0.15),
					w: newSize,
					h: newSize
				}

				canvasObjectStorage[i].transformation = {
					add: {
						y: dropSpeed * Math.random() * 0.05 + (dropSpeed * 0.97)
					}
					
				}
			} // loop
		break;
		
		case 7: // Group 7xx: Atmosphere
			for (var i = 0; i < 20; i++){
				canvasObjectStorage[i] = {};

				canvasObjectStorage[i].image = new Image();
				canvasObjectStorage[i].image.src = prepSVGPathForCanvas(vectors.atmosphereBar,{
					'#bar' : {
						fill: 'rgba(255, 255, 255, ' + (Math.random() * 0.25 + 0.05).toFixed(2) + ')'
					}
				});

				var scaleVector = cW / vectors.atmosphereBar.width;

				canvasObjectStorage[i].viewBox = {
					x: 0,
					y: 0,
					w: vectors.atmosphereBar.width,
					h: vectors.atmosphereBar.height
				}

				canvasObjectStorage[i].targetViewBow = {
					x: 0,
					y: cH - (cH * 0.08 * i),
					w: cW,
					h: cH * 0.2 * Math.random()
				}

				canvasObjectStorage[i].transformation = {
					opacity: {
						current: Math.random(),
						step: Math.random() * -0.01,
						min: 0,
						max: 0.5
					}
				}
			} // loop
		break;
		case 8:
			if (mainWeatherCondition.weatherId == 800){ // Group 801: Partly Cloudy
				

				var i = 0,
					targetVector = (mainWeatherCondition.isNight) ? vectors.moon : vectors.sun;

				canvasObjectStorage[i] = {};

				canvasObjectStorage[i].image = new Image();
				canvasObjectStorage[i].image.src = prepSVGPathForCanvas(targetVector);

				var scaleVector = cH / targetVector.height * 0.5;

				canvasObjectStorage[i].viewBox = {
					x: 0,
					y: 0,
					w: targetVector.width,
					h: targetVector.height
				}

				canvasObjectStorage[i].targetViewBow = {
					x: cW - targetVector.width * scaleVector * 1.2,
					y: cH * 0.1,
					w: targetVector.width * scaleVector,
					h: targetVector.height * scaleVector
				}

				canvasObjectStorage[i].transformation = {
					opacity: {
						current: 1,
						step: -0.001,
						min: 0.92,
						max: 1
					}
				}

				
			} else { // Group 80x: Clouds
				var numOfItems = (mainWeatherCondition.weatherId == 801) ? 1 : 5;

				for (var i = 0; i <= numOfItems; i++){
					var targetVector = vectors['cloud'+ (Math.floor(Math.random()*3) + 1)];
					canvasObjectStorage[i] = {};

					canvasObjectStorage[i].image = new Image();
					canvasObjectStorage[i].image.src = prepSVGPathForCanvas(targetVector);

					var scaleVector = cH / targetVector.height * 0.5;
					if (i > 0) scaleVector = scaleVector * Math.random() + 0.5;

					canvasObjectStorage[i].viewBox = {
						x: 0,
						y: 0,
						w: targetVector.width,
						h: targetVector.height
					}

					canvasObjectStorage[i].targetViewBow = {
						x: (i == 0) ? cW - targetVector.width * scaleVector * 1.2 : cW * Math.random() * 0.5,
						y: (i == 0) ? cH * 0.1 : cH * Math.random() - (cH * 0.25),
						w: targetVector.width * scaleVector,
						h: targetVector.height * scaleVector
					}

					canvasObjectStorage[i].transformation = {
						add: {
							x: Math.random() * 2
						}
					}
				} // loop
			} // if clear or cloudy
		break;
		default:
			
		break;
	} // which animation type

	window.requestAnimationFrame(function(){
		renderAnimation();
	});
} // setupAnimation

function renderAnimation(){
	var activeCanvas = $('.card.active canvas'),
		ctx = activeCanvas[0].getContext('2d');
		
	ctx.clearRect(0, 0, cW, cH);


	for (object in canvasObjectStorage){
		for (newTransform in canvasObjectStorage[object].transformation){
			if (newTransform == 'add'){
				for (propType in canvasObjectStorage[object].transformation[newTransform]){
					canvasObjectStorage[object].targetViewBow[propType] += canvasObjectStorage[object].transformation[newTransform][propType];
				} // props inside of the transform
				

				if (canvasObjectStorage[object].targetViewBow.y > cH){
					canvasObjectStorage[object].targetViewBow.y = canvasObjectStorage[object].targetViewBow.h * -1;
				} else if (canvasObjectStorage[object].targetViewBow.y < canvasObjectStorage[object].targetViewBow.h * -1){
					canvasObjectStorage[object].targetViewBow.y = cH;
				} 
				if (canvasObjectStorage[object].targetViewBow.x > cW){
					canvasObjectStorage[object].targetViewBow.x = canvasObjectStorage[object].targetViewBow.w * -1;
				} else if (canvasObjectStorage[object].targetViewBow.x < canvasObjectStorage[object].targetViewBow.w * -1) {
					canvasObjectStorage[object].targetViewBow.x = cW;
				} 

			} // additive to position

			if (newTransform == 'flash'){
				var scaleVector = (Math.random() < 0.05) ? cH / canvasObjectStorage[object].viewBox.h * 1.2 * Math.random() : 0;

				canvasObjectStorage[object].targetViewBow = {
					x: cW * Math.random(),
					y: 0,
					w: canvasObjectStorage[object].viewBox.w * scaleVector,
					h: canvasObjectStorage[object].viewBox.h * scaleVector
				}

			} // flash random

			if (newTransform == 'opacity'){
				canvasObjectStorage[object].transformation[newTransform].current += canvasObjectStorage[object].transformation[newTransform].step;

				if (canvasObjectStorage[object].transformation[newTransform].current > 
						canvasObjectStorage[object].transformation[newTransform].max){

					canvasObjectStorage[object].transformation[newTransform].step = 
						canvasObjectStorage[object].transformation[newTransform].step * -1;

					canvasObjectStorage[object].transformation[newTransform].current = 
						canvasObjectStorage[object].transformation[newTransform].max;
				} else if (canvasObjectStorage[object].transformation[newTransform].current < 
						canvasObjectStorage[object].transformation[newTransform].min) {

					canvasObjectStorage[object].transformation[newTransform].step = 
						canvasObjectStorage[object].transformation[newTransform].step * -1;

					canvasObjectStorage[object].transformation[newTransform].current = 
						canvasObjectStorage[object].transformation[newTransform].min;
				}

				ctx.globalAlpha = canvasObjectStorage[object].transformation[newTransform].current;
			} // opacity
		} // apply transformations

		ctx.drawImage(
			canvasObjectStorage[object].image, 
			canvasObjectStorage[object].viewBox.x, canvasObjectStorage[object].viewBox.y,
			canvasObjectStorage[object].viewBox.w, canvasObjectStorage[object].viewBox.h,
			canvasObjectStorage[object].targetViewBow.x, canvasObjectStorage[object].targetViewBow.y,
			canvasObjectStorage[object].targetViewBow.w, canvasObjectStorage[object].targetViewBow.h
		);

		ctx.globalAlpha = 1;
	} // objects in render

	window.requestAnimationFrame(function(){
		if (!$('body').hasClass('searchMode')) renderAnimation();
	});
} // renderAnimation

function parseWeather(jsonObjectName, targetCard){
	var jsonObject = cityWeatherInfo[jsonObjectName],
		cityName = jsonObject.city.name,
		listItemPosition = 0,
		totalCount = 0,
		currentColor = 1,
		lastDay, newDayCheck = false,
		cardContents = '',
		colorSpectrum = new Rainbow(),
		mainWeatherCondition = {};

	targetCard = targetCard || defaultLocations[jsonObjectName].preferredCard;

	colorSpectrum.setNumberRange(0, 10);
	colorSpectrum.setSpectrum(
		defaultLocations[jsonObjectName].colorSpectrum[0], 
		defaultLocations[jsonObjectName].colorSpectrum[1]
	);

	for (var listItem in jsonObject.list) {
		var currentListItem = jsonObject['list'][listItem],
			dateObj = new Date(currentListItem['dt'] * 1000),
			itemPrep = {
				bgColor: '' , 
				classes: '',

				dateReadable: dateObj.toString(), // Fri May 04 2018 13:47:50 GMT-0400 (EDT)
					currentDay: dateObj.getDay(), // Sunday - Saturday : 0 - 6
					currentHour: dateObj.getHours(),
					isNight: '',
					timestamp: '', 

				currentTemp: Math.round(currentListItem['main']['temp']),
				weatherId: currentListItem['weather'][0]['id'],
				weatherMain: currentListItem['weather'][0]['main'],
				weatherDesc: currentListItem['weather'][0]['description']
			};

		itemPrep.isNight = (itemPrep.currentHour > 6 && itemPrep.currentHour < 19) ? false : true;

		// Group 2xx: Thunderstorm
		// Group 3xx: Drizzle
		// Group 5xx: Rain
		// Group 6xx: Snow
		// Group 7xx: Atmosphere
		// Group 800: Clear
		// Group 80x: Clouds

		if (listItemPosition == 0){
			lastDay = itemPrep.currentDay; // set up for later items
			mainWeatherCondition = {
				weatherId: itemPrep.weatherId,
				isNight: itemPrep.isNight
			}


			cardContents = '<div class="cardHeader">' + 
			'<h1>' + jsonObject.city.name + '</h1>' +
			'<span class="weather">' +
			findWeatherIcon(itemPrep)  +
			'<span class=" weatherTemp">' + itemPrep.currentTemp + '<sup>°</sup></span>' + 
			'<h2 class="bigDesc">' + 
			currentListItem['weather'][0]['description'].replace(/\b\w/g, l => l.toUpperCase()) + '</h2>'  + 
			 '</span>' +
			 
			'</div>';

			if (targetCard == 'cardBrooklyn'){
				cardContents += '<canvas id="canvasCurrentCity" width="' + cW + '" height="' + cH + '" ></canvas>' + 
					'<ul id="extendedForecast">';
			}

			totalCount++;
		} else if (listItemPosition < 5 && listItemPosition > 0){
			currentColor = (wW > 700) ? 3: currentColor + 1;
			itemPrep.bgColor = '#' + colorSpectrum.colourAt(currentColor);
			itemPrep.timestamp = prettyTime(itemPrep.currentHour);

			cardContents += generateExtendedForecastItem(itemPrep);
			totalCount++;

		} else {
			if (lastDay != itemPrep.currentDay){
				newDayCheck = true;
				lastDay = itemPrep.currentDay;
			} 

			if (newDayCheck == true && itemPrep.currentHour >= 12){
				currentColor = (wW > 700) ? 5 : currentColor + 1;

				itemPrep.bgColor = '#' + colorSpectrum.colourAt(currentColor);
				itemPrep.timestamp = dayOfTheWeek(itemPrep.currentDay);

				cardContents += generateExtendedForecastItem(itemPrep);

				totalCount++;
				newDayCheck = false;

				if (totalCount == 9) break;
			}
		} // first then tri-hourly then daily
		
		listItemPosition++;
		if (targetCard != 'cardBrooklyn') break;
	} // for loop

	if (targetCard == 'cardBrooklyn') cardContents += '</ul>';

	$('#largeBgImage').css('backgroundImage', 'url("' + defaultLocations[jsonObjectName].coverImage + '")');

	$('#' + targetCard).html(cardContents)
		.css('background-color', '#' + colorSpectrum.colourAt(0))
		.attr('city', jsonObjectName);
	if (targetCard == 'cardBrooklyn') setupAnimation(mainWeatherCondition);
} // parseWeather

function generateExtendedForecastItem(itemPrep){
	return '<li class="' + itemPrep.classes + '" style="background-color:' + itemPrep.bgColor + '"><div class="time">' + 
		itemPrep.timestamp + '</div><div class="weather">' + 
		findWeatherIcon(itemPrep) +
		'<span class="weatherTemp">' + itemPrep.currentTemp + '<sup>°</sup> ' + '</span>'+ '</div>'
}

function findWeatherIcon(itemPrep){
	var imgPath = '',
		mainCategory = parseInt(itemPrep.weatherId / 100);

	switch  (mainCategory){
		case 2: // Group 2xx: Thunderstorm
			imgPath += 'thunder.png';
		break;
		case 3: // Group 3xx: Drizzle
		case 5: // Group 5xx: Rain
			imgPath += 'rain.png';

		break;
		case 6: // Group 6xx: Snow
			imgPath += 'snow.png';
		break;
		case 7: // Group 7xx: Atmosphere
			imgPath += 'atmosphere.png';
		break;
		case 8:
			if (itemPrep.weatherId == 800){ // Group 801: Partly Cloudy
				imgPath += (itemPrep.isNight) ? 'clearN.png' : 'clear.png';
			} else if (itemPrep.weatherId == 801){ // Group 801: Partly Cloudy
				imgPath += (itemPrep.isNight) ? 'partlyCloudyN.png' : 'partlyCloudy.png';
			} else { // Group 80x: Clouds
				imgPath += 'cloudy.png';
			}
		break;
		default:
			imgPath += (itemPrep.isNight) ? 'clearN.png' : 'clear.png';
		break;
	} // weather icon

	return '<img class="weatherIcon" src="img/' + imgPath + '" alt="' + itemPrep.weatherDesc + '">';
} // findWeatherIcon

function getWeatherData(targetLocation){
	$.ajax({
		method: "GET",
		url: "http://api.openweathermap.org/data/2.5/forecast",
		data: {
			id: targetLocation.id,
			mode: 'json',
			APPID: 'c5e0b01bf32a03207f66c5b14301fe45',
			units: 'imperial'
		},

		success: function(data,status,xhr){
			if (data.cod == 200) cityWeatherInfo[targetLocation.name] = data;
		},
		error: function(xhr, status, error){
			console.log("Error!" + xhr.status);
		},
		complete: function(){
			parseWeather(targetLocation.name, targetLocation.preferredCard);
		},
		dataType: "json"
	});
} // getWeatherData

function geo_success(position) {
	currentLocation.longitude = position.coords.longitude;
	currentLocation.latitude = position.coords.latitude;
	getWeatherData();

} // geo_success

function geo_error(error) {
	currentLocation = defaultLocations['Brooklyn'];
	console.log('ERROR(' + error.code + '): ' + error.message);
	getWeatherData();
} // geo_error

function dayOfTheWeek(day){
	switch (day){
		case 0: 
			return 'Sunday';
		case 1:
			return 'Monday';
		case 2:
			return 'Tuesday';
		case 3:
			return 'Wednesday';
		case 4:
			return 'Thursday';
		case 5:
			return 'Friday';
		case 6:
			return 'Saturday';
	}
} // dayOfTheWeek

function prettyTime(hour){
	if (hour < 12){
		if (hour == 0) hour = 12;

		return hour + 'AM';
	} else {
		return (hour - 12) + 'PM';
	}
}


function prepSVGPathForCanvas(vectorTarget, css){
	var cssString = 'path, polygon { fill: rgba(255, 255, 255, 0.25); }';

	if (typeof css === 'object'){
		for (var key in css) {
			if (css.hasOwnProperty(key)) {
				cssString += key + '{';
					for (var keyCssItem in css[key]) {
						if (css[key].hasOwnProperty(keyCssItem)) {
							cssString += keyCssItem + ':' + css[key][keyCssItem] + ';'
						}
					}
				cssString += '}'
			}
		}
	} 

	return 'data:image/svg+xml,' + 
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="' + 
			vectorTarget.width + '" height="' + vectorTarget.height + 
			'" viewBox="0 0 ' + vectorTarget.width + ' ' + vectorTarget.height + '">' +
			'<style type="text/css"><![CDATA[ '+ cssString + '  ]]></style>' +
			vectorTarget.path + '</svg>'
		);
} //prepSVGPathForCanvas
