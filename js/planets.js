var height = document.getElementById('container').clientHeight,
				width = height;

var tangle = new Tangle(document.getElementById('panel'), {
	initialize: function () {
		this.interval = 50;
		this.scale =  2;
		this.earthVelocity = 8;
		this.venusVelocity = 13;
		this.earthOrbitRadius = 94; //940 million kilometers
		this.venusOrbitRadius = 18; ////108 million kilometers
	},
	update: function () {
		this.earthRadius = 6.371 * this.scale; //6371 kilometers
		this.venusRadius = 6.052 * this.scale; // 6052 kilometers
	}
});

Raphael.fn.line = function (startX, startY, endX, endY) {
	return this.path('M' + startX + ' ' + startY + ' L' + endX + ' ' + endY);
};

function calcXY(angle, radius, offsetX, offsetY) {

	return {
		x: radius * Math.cos(angle) + offsetX,
		y: radius * Math.sin(angle) + offsetY
	};

}

var paper = new Raphael('container', width, height);
				
var earthAngle = 0,
				venusAngle = 0;

var earthCoords = calcXY(earthAngle, tangle.getValue('earthOrbitRadius') * tangle.getValue('scale'), width / 2, height / 2),
				venusCoords = calcXY(venusAngle, tangle.getValue('venusOrbitRadius') * tangle.getValue('scale'), width / 2, height / 2);

var earthOrbit = paper.circle(width / 2, height / 2, tangle.getValue('earthOrbitRadius') * tangle.getValue('scale')),
				venusOrbit = paper.circle(width / 2, height / 2, tangle.getValue('venusOrbitRadius') * tangle.getValue('scale')),
				earth = paper.circle(0, 0, tangle.getValue('earthRadius')),
				venus = paper.circle(0, 0, tangle.getValue('venusRadius'));
var lineset = paper.set();

earth.node.id = 'earth';
venus.node.id = 'venus';
earthOrbit.node.setAttribute('class', 'orbit');
venusOrbit.node.setAttribute('class', 'orbit');

function tick() {
	earthAngle = (earthAngle + tangle.getValue('earthVelocity') * 3.14 / 180) % 360;
	venusAngle = (venusAngle + tangle.getValue('venusVelocity') * 3.14 / 180) % 360;
	earthCoords = calcXY(earthAngle, tangle.getValue('earthOrbitRadius') * tangle.getValue('scale'), width / 2, height / 2);
	venusCoords = calcXY(venusAngle, tangle.getValue('venusOrbitRadius') * tangle.getValue('scale'), width / 2, height / 2);
	earth.attr('cx', earthCoords.x);
	earth.attr('cy', earthCoords.y);
	venus.attr('cx', venusCoords.x);
	venus.attr('cy', venusCoords.y);
	lineset.push(paper.line(earthCoords.x, earthCoords.y, venusCoords.x, venusCoords.y));
	window.setTimeout(function () {
		tick();
	}, tangle.getValue('interval'));
}

tick();

function reset() {
	lineset.remove();
	earthOrbit.remove();
	venusOrbit.remove();
	earthOrbit = paper.circle(width / 2, height / 2, tangle.getValue('earthOrbitRadius') * tangle.getValue('scale'));
	venusOrbit = paper.circle(width / 2, height / 2, tangle.getValue('venusOrbitRadius') * tangle.getValue('scale'));
	earthOrbit.node.setAttribute('class', 'orbit');
	venusOrbit.node.setAttribute('class', 'orbit');
}

//Event 'reset-event-spirograph' is triggered by js/TangleKit.js on line 227
//Couldn't find a better way to do this.
//But, It works!™
document.addEventListener("reset-spirograph", function (e) {
	reset();
});