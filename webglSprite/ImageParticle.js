
/**
 * ImageParticle - simple physics particle simulation
 * Written by Seb Lee-Delisle as part of the Creative JavaScript training
 * course.
 * http://sebleedelisle.com/training/
 */
var TO_RADIANS = Math.PI / 180; 

function ImageParticle(img, posx, posy) {

  // the position of the particle
  this.posX = posx; 
  this.posY = posy; 
  // the velocity 
  this.velX = 0; 
  this.velY = 0; 
  
  // the image to use for the particle. 
  this.img = img; 

  this.update = function() {
      
    // gravity force 
    var dx = (640-64) - this.posX;
	var	dy = (450-64) - this.posY;
	var dist = Math.sqrt(dx*dx+dy*dy);
	this.velX += 0.1*(dx / dist);
	this.velY += 0.1*(dy / dist);
    
    // and the velocity to the position
    this.posX += this.velX;
    this.posY += this.velY;    
  };
  
  this.render = function(c) {

		c.drawImage(img, this.posX, this.posY); 
		
  };
}


function randomRange(min, max) {
  return ((Math.random()*(max-min)) + min); 
}
