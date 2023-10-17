
let kelvin = 0 ;

// Initialisation en temps réel
let seconds_real_time = secs_real_time();

let coord_real_time = timeToCoord(seconds_real_time);
// console.log("okedak", coord_real_time);




// Closest Point on Path
// https://bl.ocks.org/mbostock/8027637

var DEG = 180 / Math.PI;

var drag = document.querySelector("#drag");
var path = document.querySelector("#path");

var pathLength = path.getTotalLength() || 0;
var startPoint = path.getPointAtLength(0);
var startAngle = getRotation(startPoint, path.getPointAtLength(0.1));


// var nowDrag = new Date()
// var timestamp = nowDrag.getHours() * 3600 + nowDrag.getMinutes() * 60 + nowDrag.getSeconds()
// var xPos = Math.round( timestamp / ( (24 * 60 * 60 - 3600) / 1800 ) )
//
// console.log(timestamp , xPos)
//
// var coords =  closestPoint(path, pathLength, {x:xPos, y:0})
//
// console.log(coords)
//
// coords.x = Math.round(coords.point.x)
// coords.y = Math.round(coords.point.y)
//
// drag.setAttribute('cx', coords.x)
// drag.setAttribute('cy', coords.y)
//
// pointModifier(coords)
//
//
$("#drag").trigger('Dragabble','left');





TweenLite.set(drag, {
  transformOrigin: "center",
  rotation: startAngle + "_rad",
  xPercent: -50,
  yPercent: -50,
  x: startPoint.x,
  y: startPoint.y
});

var draggable = new Draggable(drag, {
  liveSnap: {
    points: pointModifier
  }
});





// time / (24 * 60 * 60 - 3600) / 1800)  = point.x

TweenLite.set(".container", {
  autoAlpha: 1
});

function pointModifier(point) {

  var p = closestPoint(path, pathLength, point);

  TweenLite.set(drag, {
    rotation: p.rotation
  });

  coordToTime(p.point)

  return p.point;
}




// FONCTION utlisée pour faire la correposndance entre x (en pixels) et horaire (en secondes)
// la largeur du SVG ne dépend pas de la largeur de la fenetre (car responsive)
// elle est calculée en fonction du système de coordonnées du SVG (1800 px de large)
function coordToTime(point){
  // console.log(point);
	// console.log("coords", point.x, point.y)

	// regle de 3
	// 24h * 60 min * 60 sec
	let time = Math.round(point.x * (24 * 60 * 60 - 3600) / 1800)
	// * 1000 pour l'avoir en millisecondes
	let d = new Date(time * 1000);
  // let d = new Date;

	// à ajuster
	// cf https://www.lightingtutor.com/kelvin-color-temperature/
	let minTemp = 2400 // 2700
	let maxTemp = 6650 // 6500
	// 185 = hauteur du tracé
	kelvin = Math.round(-point.y * (maxTemp - minTemp) / 265) + maxTemp




   if (kelvin > 2800){
   // console.log("caché", kelvin) ;
    document.getElementById("fond_nuit").style.display = 'none';
    document.getElementById("path").style.stroke = '#faf5f4';
    document.getElementById("title-nuit").style.color = '#faf5f4';
    document.querySelector("#horaire").style.color = '#faf5f4';
    document.querySelector("#tempK").style.color = '#faf5f4';

    //document.querySelector("#horloge").style.stroke = '#faf5f4';

   }

  if (kelvin < 2800){
    // console.log("temp-cool", kelvin) ;
    document.getElementById("fond_nuit").style.display = 'block';
    //document.getElementById("title-nuit","horaire", "tempK").style.color = '#a17c21';
    //document.getElementById("path").style.stroke = '#a17c21';
    //document.querySelector("#horaire").style.color = '#a17c21';
   // document.querySelector("#tempK").style.color = '#a17c21';

    //document.querySelector("#horloge").style.stroke = '#a17c21';

   }






	// console.log(time)
	// console.log(d.getHours(), d.getMinutes(), d.getSeconds() )

	// krgb = kelvin_to_rgb(kelvin)
	krgb = kelvinToRGB(kelvin)
	//console.log("temp", kelvin, krgb)

	//color_update(time,krgb)
  color_rayon(d/1000)

	// document.body.style.background = `rgb(${krgb[0]},${krgb[1]},${krgb[2]})`;

	$("body").css("background",`rgb(${krgb[0]},${krgb[1]},${krgb[2]})` )

	// pour afficher l'horaire ajouter un élément #horaire
	// document.getElementById('horaire').innerHTML = `${pad(d.getHours(),2)}:${pad(d.getMinutes(),2)}:${pad(d.getSeconds(),2)}`
  // console.log(document.getElementById('horaire'));



	$("#horaire").text(`${pad(d.getHours(),2)}:${pad(d.getMinutes(),2)}`)
	$("#tempK").text(kelvin+" K")


	let root = document.documentElement;

	// AIGUILLES HORLOGES
	$(".minute").css( 'transform', `translate(20px, 20px) rotate(${d.getMinutes()*6}deg)`)
	$(".hour").css( 'transform', `translate(20px, 20px) rotate(${d.getHours()*30}deg)`)

	//console.log(`translate(20px, 20px) rotate(${d.getHours()*30}deg)`, `translate(20px, 20px) rotate(${d.getMinutes()*6}deg)` )

}


function timeToCoord(secs){

  // regle de 3
  // secs --> coord
  // coord = (secs * 1800)/ secs_in_a_day
  //let time = Math.round(secs * (24 * 60 * 60 - 3600) / 1800);

  let coord = Math.round((secs*1800)/ SECS_IN_DAY);

  return coord;
}



// pour ajouter des zéros devant des nombres
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

// CF https://github.com/mattdesl/kelvin-to-rgb
// https://github.com/mattdesl/kelvin-to-rgb/blob/master/index.js
function kelvinToRGB (temp, out) {
  if (!Array.isArray(out)) {
    out = [0, 0, 0]
  }

  temp = temp / 100
  var red, blue, green

  if (temp <= 66) {
    red = 255
  } else {
    red = temp - 60
    red = 329.698727466 * Math.pow(red, -0.1332047592)
    if (red < 0) {
      red = 0
    }
    if (red > 255) {
      red = 255
    }
  }

  if (temp <= 66) {
    green = temp
    green = 99.4708025861 * Math.log(green) - 161.1195681661
    if (green < 0) {
      green = 0
    }
    if (green > 255) {
      green = 255
    }
  } else {
    green = temp - 60
    green = 288.1221695283 * Math.pow(green, -0.0755148492)
    if (green < 0) {
      green = 0
    }
    if (green > 255) {
      green = 255
    }
  }

  if (temp >= 66) {
    blue = 255
  } else {
    if (temp <= 19) {
      blue = 0
    } else {
      blue = temp - 10
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307
      if (blue < 0) {
        blue = 0
      }
      if (blue > 255) {
        blue = 255
      }
    }
  }

  out[0] = Math.floor(red)
  out[1] = Math.floor(green)
  out[2] = Math.floor(blue)
  return out
}


////// END kelvinToRGB

function closestPoint(pathNode, pathLength, point) {

  var precision = 8,
      best,
      bestLength,
      bestDistance = Infinity;

  // linear scan for coarse approximation
  for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
    if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
      best = scan, bestLength = scanLength, bestDistance = scanDistance;
    }
  }

  // binary search for precise estimate
  precision /= 2;
  while (precision > 0.5) {
    var before,
        after,
        beforeLength,
        afterLength,
        beforeDistance,
        afterDistance;
    if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
      best = before, bestLength = beforeLength, bestDistance = beforeDistance;
    } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
      best = after, bestLength = afterLength, bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  var len2 = bestLength + (bestLength === pathLength ? -0.1 : 0.1);
  var rotation = getRotation(best, pathNode.getPointAtLength(len2));

  return {
    point: best,
    rotation: rotation * DEG,
    distance: Math.sqrt(bestDistance),
  };

  function distance2(p) {
    var dx = p.x - point.x,
        dy = p.y - point.y;
    return dx * dx + dy * dy;
  }
}

function getRotation(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.atan2(dy, dx);
}
