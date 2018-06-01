//The const and vars that we will be using along the way
const [wW,wH] = [window.innerWidth-5,window.innerHeight-5];
let pase = 2;
let bulletPase = 10;
let particles = [];

//INITAILIZE THE CANVAS AND CONTEXT
const canvas = document.querySelector('canvas');
canvas.width = wW;
canvas.height = wH;
let c = canvas.getContext('2d');




//Event listener mousemove
window.addEventListener('mousemove', mouseMoveListener);
window.addEventListener('keydown' , keyDown);
window.addEventListener('click',clickListner)
// window.addEventListener('keyup' , keyUp);

function colision(x1,x2,y1,y2){
	let xdif = x2-x1;
	let ydif = y2-y1;
	return Math.sqrt(Math.pow(xdif,2)+Math.pow(ydif,2));
}

let mouseX;
let mouseY;
//Functions for the eventListeners
function mouseMoveListener(e){
	mouseX = e.clientX;
	mouseY = e.clientY;
	//player.draw();
}
let keyz = ['a','d','s','w'];
function keyDown(e){
	let thisKey = e.key;
	if(thisKey == 'k'){
		
		enemies.forEach(el=>createBullet(el));
	}
	if(keyz.indexOf(thisKey)<0) return;

	switch (thisKey) {
		case 'a':
			player.dx = -pase;
			break;
		case 'd':
			player.dx = pase;
			break;
		case 's':
			player.dy = pase;
			break;
		case 'w':
			player.dy = -pase;
			break;
	}

}

function clickListner(e){
	createBullet(player);
}


function keyUp(e){
	let thisKey = e.key;
	if(keyz.indexOf(thisKey)<0) return;
	player.dx = 0;
	player.dy = 0;
}

//FUNCTION THAT MOVE THE CANON
function moveCanon(el1,el2x,el2y){
	let angle = Math.atan2(el1.y - el2y, el1.x - el2x) * 180 / Math.PI;
	// alter the angle to be relative to Y axis instead of X
	angle -=90;
	if(angle < 0) angle+=360;
	//return(-(180-angle));
	return angle;
}



//The BattleMachineCreator function
function BattleMachine(x,y,radius,hp,color,anglez=0){
	this.x = x;
	this.y = y;
	this.dx = 0;
	this.dy = 0;
	this.hp = hp;
	this.radius = radius;
	this.color = color;
	this.angle = anglez;
	this.draw = function(){
		c.save();
		c.beginPath();  
		c.translate(this.x , this.y);
		c.rotate(this.angle * Math.PI/180); 
		c.arc(0,0,this.radius,0,Math.PI*2,false);
		c.fillStyle = this.color;
		c.fill();
		c.beginPath();
		c.fillStyle = 'black';
		c.fillRect(-5,-radius-15,10,15);
		c.restore();
	}
	this.update = function(){
		if(this.x+ this.radius + this.dx > wW || this.x - this.radius + this.dx < 0){
			this.dx = 0;
		};
		if(this.y+ this.radius + this.dy > wH | this.y - this.radius + this.dy < 0){
			this.dy = 0;
		}
		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	}
}

let player = new BattleMachine(350,350,25,3,'#222f3e');
player.draw();


c.globalCompositeOperation='destination-over';
//THE BULLETS STUFF
let enemyBullets=[];
let playerBullets=[];
function Bullet(x,y,dx,dy,radius,angle,color='white',from){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.angle = angle;
	this.radius = radius;
	this.color=color;
	this.from = from;
	this.draw = function(){
		c.save();

		c.beginPath();
		c.translate(this.x , this.y);
		c.rotate(this.angle * Math.PI/180); 
		c.arc(0,0,this.radius,0,Math.PI*2,false);
		c.fillStyle = this.color;
		c.fill();
		c.restore();
	}
	this.update = function(){
		this.y += this.dy;
		this.x += this.dx;
		this.draw();
	}
}
//the function that call new Bullet, it spawn it on the perfect place with the perfect angle, depending on the barel angle;
function createBullet(fromThis){
	let dX;
	let dY;
	let nowAngle = fromThis.angle;
	let perc;
	if(nowAngle==0){
		dX = 0;
		dY = bulletPase;
	}else if(nowAngle <= 90){
		//perc = nowAngle/90;
		perc = parseFloat(Math.round(nowAngle/90 * 100) / 100)
		dX = bulletPase * perc;
		dY = -bulletPase * (1-perc);
		
	}else if(nowAngle <= 180){
		//perc = (nowAngle-90)/90;
		perc = parseFloat(Math.round((nowAngle-90)/90 * 100) / 100)
		dY = bulletPase * perc;
		dX = bulletPase * (1-perc);
	}else if(nowAngle <= 270){
		//perc = (nowAngle-180)/90;
		perc = parseFloat(Math.round((nowAngle-180)/90 * 100) / 100)
		dX = -bulletPase * perc;
		dY = bulletPase * (1-perc);
	}else{
		//perc = (nowAngle-270)/90;
		perc = parseFloat(Math.round((nowAngle-270)/90 * 100) / 100)
		dY = -bulletPase * perc;
		dX = -bulletPase * (1-perc);
	}	
	if(fromThis == player){
		playerBullets.push(new Bullet(player.x,player.y,dX,dY,4,nowAngle,'white','player'));
	}else{
		enemyBullets.push(new Bullet(fromThis.x,fromThis.y,dX,dY,4,nowAngle,'red','enemy'));
	}
}




// THE FUNCTIONS THAT CHECK IF THE BULLET LEAVED THE CANVAS OR IF THE BULLET HITS SOMETHING!!;

function bulletDies(bullet,arr,idx){ //the function that check to see if the bullet is out of the screen or not
	return(bullet.x + bullet.dx >= wW || bullet.x - bullet.dx < 0 || bullet.y + bullet.dy >= wH || bullet.y - bullet.dy <0 );
}

function bulletHit(bullet,arr,idx){
	let hit = false;
	if(bullet.from == 'player'){
		enemies.some((el,index)=>{
			if(colision(bullet.x,el.x,bullet.y,el.y) - (el.radius+bullet.radius) <=0){
				
				hit = true;
				el.hp -= 1;
				if(el.hp <= 0){
					particles.push(new Particle(el.x,el.y,2,2,8,.04,'die'),new Particle(el.x,el.y,-2,2,8,.04,'die'),new Particle(el.x,el.y,-2,-2,8,.04,'die'),new Particle(el.x,el.y,2,-2,8,.04,'die'))
					enemies.splice(index,1);
				}else if(el.hp>0){
					particles.push(new Particle(bullet.x,bullet.y,2,2,4,.1,'hit'))
					
				}
				return true;
			}
			return false;
		});
	}else{
		if(colision(bullet.x,player.x,bullet.y,player.y) - (player.radius+bullet.radius) <=0){
			player.hp-=1;
			/* ========================================================================
				MUST SCRIPT IT SO IT DOES SOMETHING WHEN THE PLAYER THAKE THE DAMAGE
			========================================================================== */
			// if(player.hp <= 0){
			// 	particles.push(new Particle(player.x,player.y,2,2,8,.04,'die'),new Particle(player.x,player.y,-2,2,8,.04,'die'),new Particle(player.x,player.y,-2,-2,8,.04,'die'),new Particle(player.x,player.y,2,-2,8,.04,'die'))
			// 	window.cancelAnimationFrame(z);
			// }else if(player.hp>0){
			// 	particles.push(new Particle(bullet.x,bullet.y,2,2,4,.1,'hit'))
					
			// }
			hit = true;
		}
	}
	return hit;
}

function bulletUpdaterChecker(array){

	if(array.length>0){       //the enemies bulets updater
		array.forEach((el,idx)=>{
			if(bulletDies(el,array,idx) || bulletHit(el,array,idx)){
				array.splice(idx,1);
			}else{
				el.update();
			}
		});
	}
}



function Particle(x,y,dx,dy,radius,oPase,type){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.opacity = .9;
	this.oPase = oPase;
	this.type = type;
	this.radius = radius;
	this.draw = function(){
		c.beginPath();
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
		if(this.type == 'die'){
			c.fillStyle = `rgba(240,0,0,${this.opacity})`;
			c.fill();
		}else{
			c.strokeStyle = `rgba(240,0,0,${this.opacity})`;
			c.stroke();
		}
	}
	this.update = function(){
		if(this.type == 'die'){
			this.x += this.dx;
			this.y += this.dy;
		}else{
			this.radius += 1;
		}
		this.opacity -= oPase;
		this.draw();
	}
}









// THE Enemy Thingy
let enemies = [];
for(var i = 1 ; i < 5 ; i++){
	let randomX = Math.floor(Math.random()*(wW-60))+30;
	let randomY = Math.floor(Math.random()*(wH-60))+30;
	let randomHp = Math.floor(Math.random()*5)+1;
	enemies.push(new BattleMachine(randomX,randomY,30,randomHp,'black'))
}

let z ;
window.addEventListener('keydown',function(e){

	if(e.key == 'Escape'){
		window.cancelAnimationFrame(z);
	}
})


// THE ANIMATE SSSHITY
function animate(){
	z = window.requestAnimationFrame(animate);
	c.clearRect(0,0,wW,wH);
	player.angle = moveCanon(player,mouseX,mouseY);
	

	//THE PLAYER STUFF
	player.update();
	bulletUpdaterChecker(playerBullets);

	if(particles.length > 0){
		particles.forEach((el,idx)=>{
			if(el.opacity-0.04 <= 0) particles.splice(idx,1);
			el.update();
		});
	}


	//THE ENEMIES THINGS
	enemies.forEach(el=>{
		el.angle = moveCanon(el,player.x,player.y);
		el.draw();
	});
	bulletUpdaterChecker(enemyBullets);
}

animate();


/* IDEAS

1.bossFIghts
2.health increse of the dudes
3.asteroids levels
4.Score
5.DIferent weapon / shotgun shoot with 3 bulets in the same time / they will separate after they are one in other for a little while
6. reload time



*/