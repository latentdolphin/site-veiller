function create_rayon(id_rayon, posY){

    var newRayon = document.createElement('div');
    newRayon.className = "rayon-user";
    newRayon.id = id_rayon; 

    document.body.appendChild(newRayon);

    document.getElementById(id_rayon).style.top = posY +'px';

    /*if (CON < 18900){
	//console.log('hidden', kelvin)
	// console.log("caché", kelvin) ;
	//document.getElementsByClassName("rayon-user").style.display = 'none';
 	document.getElementById(id_rayon).style.display = 'none';
	}  */ 

}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


const socket = io();
    socket.on('usercount', function(msg) {
        //$(".usercount").text( msg ) 
    console.log('ok', msg) ;

    //nbr_user = msg ;



    // LOÏC : à quelle fréquence s'update la boucle io? 
    for (x=0; x < msg ;x++) {
    var randomPosY = getRandomArbitrary(0,1000);
    create_rayon(x, randomPosY);
	}

})
/*

var array_rayon = new Array();

function rayon(_posY){
	this.posY = _posY;
}


//creer fonction detection de user in ou out





for (x=0; x < 4 ;x++) {
    var randomPosY = getRandomArbitrary(0,1000);
    create_rayon(x, randomPosY);
}
*/

//var nbr_user = 0


        


//

   /* rayon.className = "rayon-user";


    var id_rayon = 
    rayon.Id = id_rayon
    rayon.Id = "rayon-user" + ;

     $('.rayon-user').css({
       top:`posY`
    })
}

create_rayon(150); 


document.getElementsByClassName("rayon-user").style.top="150px";

/*for (x=0; x<9;x++) {
	
	
}*/
    

