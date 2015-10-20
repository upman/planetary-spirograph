var height = document.getElementById('container').clientHeight,
				width = height;

// All parameters that control planetary spirograph
var parameters = {
	"earthVelocity" : {
		"randomFunc" : randomNumRange.bind({"start" : 5, "end" : 100}),
		"default" : 8,
		"new-value" : null
	},
	"venusVelocity" : {
	 	"randomFunc" : randomNumRange.bind({"start" : 5, "end" : 200}),
	 	"default" : 13,
	 	"new-value" : null
	},
	"scale" : {
		"randomFunc" : randomNumRange.bind({"start" : 1, "end" : 3}),
		"default" : 2,
		"new-value" : null
	},
	"venusOrbitRadius": {
		"randomFunc" : randomNumRange.bind({"start" : 5, "end" : 100}),
		"default" : 18,
		"new-value" : null
	},
	"earthOrbitRadius" : {
		"randomFunc" : randomNumRange.bind({"start" : 5, "end" : 100}),
		"default" : 94,
		"new-value" : null
	},
	"interval" : {
		"randomFunc" : randomNumRange.bind({"start" : 25,"end" : 200}),
		"default" : 50,
		"new-value" : null
	},
	"color" : {
		"randomFunc" : function(){return '#'+Math.floor(Math.random()*16777215).toString(16);},
		"default" : "#e562ce", // Interesting color, but overriden
		"new-value" : null
	}
};

// Random color set on execution
parameters.color.default = parameters.color.randomFunc();

var tangle = new Tangle(document.getElementById('panel'), {
	initialize: function () {
		this.interval = parameters.interval.default;
		this.scale =  parameters.scale.default;
		this.earthVelocity = parameters.earthVelocity.default;
		this.venusVelocity = parameters.venusVelocity.default;
		this.earthOrbitRadius = parameters.earthOrbitRadius.default; 
		this.venusOrbitRadius = parameters.venusOrbitRadius.default;
	},
	update: function () {
		this.earthRadius = 6.371 * this.scale; //6371 kilometers
		this.venusRadius = 6.052 * this.scale; // 6052 kilometers
	}
});

Raphael.fn.line = function (startX, startY, endX, endY) {
	var line = this.path('M' + startX + ' ' + startY + ' L' + endX + ' ' + endY);
	// Set new value as default value for color.
	var color = parameters.color["new-value"];
	if(color === null){
		// If new value does not exist use default value.
		color = parameters.color.default;
	}
	// Set color to the line.
	line.attr("stroke", color);
	return line;
};

// Generates random number from a bound variable between range => {start, end}
function randomNumRange(){
	return Math.floor(Math.random() * this.end) + this.start;
}

// Event Listener added for randomizing checkbox 
(function(){
	document.getElementById("random-all").addEventListener("click", function(e){
		// Iterate over all parameters generating their respective random value.
		for(var i=0;i<Object.keys(parameters).length; i++){
			var parameter = Object.keys(parameters)[i];
			// Unset default value, Set random value.
			if(parameters[parameter]["new-value"] === null){
				var randomValue = parameters[parameter]["randomFunc"].call();
				// color parameter is not a tangle attr
				if(parameter !== "color"){
					tangle.setValue(parameter, randomValue);
				}
				parameters[parameter]["new-value"] = randomValue;
			}
			// Unset random value, set default value.
			else{
				tangle.setValue(parameter, parameters[parameter].default);
				parameters[parameter]["new-value"] = null;
			}
			// Rerender the visualization with the new updated values.  
			reset();
		}
	})
})();

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