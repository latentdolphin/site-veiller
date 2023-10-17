// ┌─────────────────────────────────────────┐
// │               Conversion                │
// └─────────────────────────────────────────┘

function secs_in_day() {
    let now = new Date();
    return now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
}

// ┌─────────────────────────────────────────┐
// │               Constantes                │
// └─────────────────────────────────────────┘
const SECS_IN_DAY = 24*3600;

const COLOR_TAB = [
    {s:0    ,temp: 0, r:251,v:229,b:209}, 		    // -> 00h00
    {s:14400,temp: 0.5, r:251,v:229,b:209},			// -> 04h00
    {s:28800,temp: 0.5, r:251,v:229,b:209},			// -> 08h00
    {s:61200,temp: 0.2, r:0,v:0,b:0},			// -> 17h00
    {s:72000,temp: 1, r:0,v:255,b:0}			// -> 20h00
];

// ┌─────────────────────────────────────────┐
// │           Mise à jour couleur           │
// └─────────────────────────────────────────┘

function color_update(secs) {
    // console.debug(secs);

    let step = 0; // Current step in day

    /* Find correct color range */
    let i = 0;
    while( i < (COLOR_TAB.length-1)) {
        if ( (secs >= COLOR_TAB[i].s) && 
             (secs <  COLOR_TAB[(i+1)%COLOR_TAB.length].s) ){
            break;
        }
        i++;
    }
    step = i;

    /* Compute color */
    let next = (step+1) % COLOR_TAB.length; // Next color step

    let step_duration = COLOR_TAB[next].s - COLOR_TAB[step].s;
    if(step_duration < 0) step_duration += SECS_IN_DAY;

    let step_progress = (secs - COLOR_TAB[step].s) / step_duration; //entre 0 et 1

    let r = Math.round( COLOR_TAB[step].r + (COLOR_TAB[next].r - COLOR_TAB[step].r) * step_progress);
    let v = Math.round( COLOR_TAB[step].v + (COLOR_TAB[next].v - COLOR_TAB[step].v) * step_progress);
    let b = Math.round( COLOR_TAB[step].b + (COLOR_TAB[next].b - COLOR_TAB[step].b) * step_progress);

    // console.debug (` COLOR_TAB[step]=${COLOR_TAB[step]} ; step_duration=${step_duration} ; step_progress=${step_progress}; r = ${r}, v=${v}, b = ${b}`);

    /* Update color in DOM */
    $('#gradient').css({
        background:`linear-gradient( rgba(${r}, ${v}, ${b}, 0) 0%, rgb(${r},${v},${b}) 50%, rgba(${r}, ${v}, ${b}, 0) 100%)`
    })
}


function clip(x,min,max) {
    return Math.min(Math.max(x,min),max);
}

function color_rayon(rgb_rayon) {

    let r = clip(rgb_rayon[0] ,0, 255)
    let v = clip(rgb_rayon[1] - 50,0, 255)
    let b = clip(rgb_rayon[2] - 25,0, 255)


    $('#gradient').css({
        background:`linear-gradient( rgba(${r}, ${v}, ${b}, 0) 0%, rgb(${r},${v},${b}) 50%, rgba(${r}, ${v}, ${b}, 0) 100%)`
    })

}

// ┌─────────────────────────────────────────┐
// │              Compute path               │
// └─────────────────────────────────────────┘

function time_cursor_update(secs) {
    /* Get DOM and dimensions */
    let dom  = $("#schema-temp");
    let bbox = dom.get(0).getBoundingClientRect()

    /* Get X position */
    let x_pos = secs / SECS_IN_DAY;

    /* Get Y position */
    let idx = 0;
    while( idx < (COLOR_TAB.length-1)) {
        if ( (secs >= COLOR_TAB[idx].s) && 
             (secs <  COLOR_TAB[(idx+1)%COLOR_TAB.length].s) ){
            break;
        }
        idx++;
    }

    let next = (idx+1)%COLOR_TAB.length; // next pos in tab

    let step_duration = COLOR_TAB[next].s - COLOR_TAB[idx].s;
    if(step_duration < 0) step_duration += SECS_IN_DAY;

    let step_progress = (secs - COLOR_TAB[idx].s) / step_duration; // entre 0 et 1

    let y_pos = COLOR_TAB[idx].temp + ((COLOR_TAB[next].temp - COLOR_TAB[idx].temp)*step_progress);

    // console.log(step_duration, step_progress, x_pos, y_pos);

    /* Apply position to stuff */
    $("#schema-cursor").attr("cx", x_pos*bbox.width);
    $("#schema-cursor").attr("cy", y_pos*bbox.height);
}

function time_path_compute() {
    /* Get DOM and dimensions */
    let dom  = $("#schema-temp");
    let bbox = dom.get(0).getBoundingClientRect()

    let path = "M0,0";

    /* Compute path points */
    let i = 0;
    while(i < COLOR_TAB.length) {
        let el       = COLOR_TAB[i];

        /* Get coordinates (0..1 scale) */
        let x_pos    = el.s/SECS_IN_DAY;
        let y_pos    = el.temp;

        /* Create path point */
        path += `L${x_pos*bbox.width},${y_pos*bbox.height} `;

        i++;
    }

    /* Last point in path */
    {
        let el       = COLOR_TAB[0];

        /* Get coordinates (0..1 scale) */
        let x_pos    = ((el.s+SECS_IN_DAY)/SECS_IN_DAY);
        let y_pos    = el.temp;

        /* Create path point */
        path += `L${x_pos*bbox.width},${y_pos*bbox.height}`;
    }

    /* Apply path */
    $("#schema-path").attr("d", path);
}
			

// ┌─────────────────────────────────────────┐
// │             Initialisation              │
// └─────────────────────────────────────────┘

$(window).on("load", function() {
    /* Init clock */
    let now = new Date();

    let clk = document.getElementById("horloge");
    clk.style.setProperty('--start-seconds', now.getSeconds());
    clk.style.setProperty('--start-minutes', now.getMinutes());
    clk.style.setProperty('--start-hours', now.getHours() % 12);

    /* Init update on usercount */
    const socket = io();
    socket.on('usercount', function(msg) {
        $(".usercount").text( msg ) 
        $("#gradient").css('height', 80 * parseInt(msg) )
    })

    /* Init update color interval */
    let update_color_interval = setInterval( function() {
        let secs = secs_in_day();
        //color_update(secs);
        time_cursor_update(secs);
    }, 1000);
    
    /* Manual control */
    //$("#manual-time").on("change", function() {
    //    let value = $(this).val();

    //    let hours   = Math.floor(value/3600);
    //    let minutes = Math.floor((value%3600)/60);
    //    let secs    = (value%3600)%60;

    //    $("#manual-time-clock").text(`${hours}h${minutes} ${secs}s`);

    //    color_update(value);
    //    time_cursor_update(value);
    //});

    /* Resize event */
    $(window).on("resize", function() {
        let secs = secs_in_day();
        time_path_compute();
        time_cursor_update(secs);
    });

    /* Compute initial time path */
    time_path_compute();
    time_cursor_update();
});
