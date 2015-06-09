/**
 * HTML5 Performance Profiling
 * by Rama Hoetzlein
 *
 * Based on Browser Fountain by Christian Heilmann @codepo8
 * Uses ImageParticle.js by Seb Lee Delisle and 
 * the requestAnimationFrame shim by Paul Irish
 */
(function(){

  var drawing = true,
  running = true,
  mouseDown = false,
  visible = true,
  particles = [],
  MAX_PARTICLES = 300000,
  num_particles = 1000;
  
  var canvas = document.getElementById('mycanvas');
  var context = canvas.getContext( '2d' );
  
  var SCREEN_WIDTH = canvas.width;
  SCREEN_HEIGHT = canvas.height;
  HALF_WIDTH = SCREEN_WIDTH / 2,
  HALF_HEIGHT = SCREEN_HEIGHT / 2;

  var ball_img = new Image();
  ball_img.src = "ball32.png";
  
  var msec = 0;
  var frame = 0;
  var lastTime = new Date();

  function init() {
    
    var container = document.querySelector( 'section' );
    container.innerHTML = context;

    requestAnimationFrame( loop, 1 );
	
    makeParticle( num_particles );  
	
    logo.addEventListener( 'mousedown', function(e) {
      mouseDown = true;
    }, false );
    logo.addEventListener( 'mouseup', function(e) {
      mouseDown = false;
    }, false );

    document.querySelector( 'form' ).addEventListener( 'submit', function(e){
      getvalues();
      e.preventDefault();
    },false);
   
  }

 function loop() {
	
	frame = frame + 1;
	if ( frame >= 30 ) {
		var d = new Date();
		msec = (d.getTime() - lastTime ) / frame;
		lastTime = d;
		frame = 0;
	}
	
	var container = document.querySelector( 'section' );
	container.innerHTML = "num: " + particles.length +"   msec: " + msec;
	
	context.fillStyle = "rgb(0,0,0)";
	context.fillRect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);
	  
	if ( drawing ) {
		for( var i = 0, j = particles.length; i < j; i++ ) {
			particles[i].render( context ); 
		}
	}
	if ( running ) {
		for( var i = 0, j = particles.length; i < j; i++ ) {
			particles[i].update();
		}
	}
	while( particles.length > MAX_PARTICLES ) { particles.shift(); } 
	
	requestAnimationFrame( loop, 1 );

  }
  
  function makeParticle( particleCount ) {	

  	
	particles = [];

    for( var i = 0; i < particleCount; i++ ) {
      particle = new ImageParticle( ball_img, randomRange(0, SCREEN_WIDTH)-64, randomRange(0, SCREEN_HEIGHT)-64 );
      particle.velX = 0;
      particle.velY = 0;
      particles.push( particle ); 	  
    }

	
  }
  
  window.addEventListener( 'load', init, false );
  
  document.addEventListener( 'keydown', function(e){
  
    var display;
	
	frame = frame + 1;

	var container = document.querySelector( 'section' );
	container.innerHTML = e.keyCode;

	if ( e.keyCode === 81 ) {
		num_particles -= 10000; 	
		makeParticle( num_particles );  
	}
	if ( e.keyCode === 87 ) {
		num_particles += 10000; 	
		makeParticle( num_particles );  
	}
	if ( e.keyCode === 90 ) { 
		num_particles -= 100; 
		makeParticle( num_particles );  
	}
    if ( e.keyCode === 88 ) { 
		num_particles += 100; 
	    makeParticle( num_particles );  
	}
    if ( e.keyCode === 68 ) { 
		drawing = !drawing;
	}	
    if ( e.keyCode === 80 ) {
		running = !running;
    }    
    
  }, false );

})();

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
    
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback, element ) {
      window.setTimeout( callback, 1000/60 );
    };
	
  } )();
}
