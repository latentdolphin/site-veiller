now();

function now(){
  let d = new Date();
  var timestamp = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
  var xPos = Math.round( timestamp / ( (24 * 60 * 60 - 3600) / 1800 ) )

  // console.log(timestamp , xPos)

  var coords =  closestPoint(path, pathLength, {x:xPos, y:0})

  let point = coords.point

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
