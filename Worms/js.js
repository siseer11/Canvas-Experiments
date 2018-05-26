

//INITIATE THE GRID SYSTEM
const canvas = document.querySelector('canvas');
let oneBlock = 10; //plus one the margin betweek them
let gridNumbers = 15;
function createGrid(n){
	canvas.width = n*(oneBlock+1) -1;
	canvas.height = n*(oneBlock+1) -1;
}
createGrid(gridNumbers);

let pressable = true;

//INITIAL VARIABLES//
let [canvasW,canvasH] = [canvas.width,canvas.height];
const c = canvas.getContext('2d');
const pointsTxt = document.querySelector('.numberPoints');
let pase = 11;
let arrows = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
let animateHolder = undefined;
let timer = 0;
let points = 0;
let gameT = 'easy'; //the default is easy for the game mode
let obstacles = [];
let endGameScreen = document.querySelector('.game-over'); 

let overOptions = document.querySelectorAll('.over-options li');
let resumeMenu = document.querySelector('.resume-menu');
let resumeMenuOption = resumeMenu.querySelectorAll('li');
// TO DO: EVERY 5 BALLS TAKEN SPAWN A BOG one
//        DO IT OS THE BALLS THAT ARE SPAWNING ARE NOT SPAWN IN THE SNAKE



//EVENT LISTENERS


function keyResume(e){
	let thisKey = e.key;	
	if(thisKey != 'ArrowUp' && thisKey != 'ArrowDown' && thisKey != 'Enter') return;
	let length = resumeMenuOption.length;
	
	if(thisKey == 'Enter'){
		let toThis;
		for(var i = 0 ; i < length;i++){
			if(resumeMenuOption[i].classList.contains('active')){
				toThis = resumeMenuOption[i].dataset.to;
				break;
			}
		}
		resumeMenu.style.display = 'none';
		window.removeEventListener('keydown',keyResume);

		if(toThis == 'resume'){
			window.addEventListener('keydown', keyDownListener);
			countDown('resume');
		}else if(toThis == 'menu'){
			interfaceUl.style.display = 'block';
			window.addEventListener('keydown',interfaceKey);
		}else if(toThis == 'restart'){
			window.addEventListener('keydown', keyDownListener);
			countDown('restart');
		}
	
	}else{
		cicleThrough(resumeMenuOption,thisKey,'ArrowUp','ArrowDown',length);
	}
}

//FUNCTION FOR THE EVENTLISTENERS
function keyDownListener(e){
	if(!pressable) return;
	let thisKey = e.key;
	let arrowIdx = arrows.indexOf(thisKey);
	if(arrowIdx < 0 && thisKey != 'Escape')return;

	if(thisKey == 'Escape'){
		c.clearRect(0,0,canvasW,canvasH);
		window.removeEventListener('keydown', keyDownListener);
		resumeMenu.style.display = 'block';
		window.cancelAnimationFrame(animateHolder);

		window.addEventListener('keydown',keyResume);



	}else if(arrowIdx == 0){
		if(snakeBody[0].dy!=0) return;
		snakeBody[0].dy = -pase;
		snakeBody[0].dx = 0;
	}else if(arrowIdx == 1){
		if(snakeBody[0].dy!=0) return;
		snakeBody[0].dy = pase;
		snakeBody[0].dx = 0;
	}else if(arrowIdx == 2){
		if(snakeBody[0].dx!=0) return;
		snakeBody[0].dy = 0;
		snakeBody[0].dx = -pase;
	}else{
		if(snakeBody[0].dx!=0) return;
		snakeBody[0].dy = 0;
		snakeBody[0].dx = pase;
	}	
	pressable = false;
};



//THE FUNCTION THAT SPAWN THE BLOCKS
function Block(x,y,radius,value){
	this.initialX = x;
	this.initialY = y;
	this.x = x;
	this.y = y;
	this.value = value;
	this.radius = radius;
	this.width = radius;
	this.height = radius;
	this.dx = 11;
	this.dy = 0;
	this.opacity = 1;
	this.draw = function(){
		c.fillStyle = `black`;
		c.fillRect(this.x,this.y,this.radius,this.radius);
	}
	this.update = function(){
		if(this.x+this.dx < 0){
			if(gameT == 'easy'){
				this.x = canvasW - this.radius;
			}else{
				gameOver();
				return;
			}
		}else if(this.x+this.radius+this.dx>canvasW){
			if(gameT == 'easy'){
				this.x = 0;
			}else{
				gameOver();
				return;
			}
		}else{
			this.x += this.dx;
		}
		if(this.y+this.dy < 0){
			if(gameT == 'easy'){
				this.y = canvasH - this.radius;
			}else{
				gameOver();
				return;
			}
		}else if(this.y+this.radius+this.dy>canvasH){
			if(gameT == 'easy'){
				this.y = 0;
			}else{
				gameOver();
				return;
			}
		}else{
			this.y += this.dy;
		}
		this.draw();
	}
	this.updateOpacity = function(){
		this.opacity -= .05;
		c.fillStyle = `rgba(0,0,0,${this.opacity})`;
		if(this.opacity <= 0){
			bigPoint = undefined;
		}
		c.fillRect(this.x,this.y,this.radius,this.radius);
	}
}

//THE FUNCTION THAT CHECK FOR THE COLISION//
function colision(el1,el2){
	let [x1,x2,y1,y2,w1,w2,h1,h2] = [el1.x,el2.x,el1.y,el2.y,el1.width,el2.width,el1.height,el2.height];
	if(x1<=x2+w2 && x1+w1 >= x2 && y1 <= y2+h2 && y1+h1 >= y2){
		return true;
	}
	return false;
}

//THE ARRAY THAT HOLD THE SNAKE BODY AND THE INITIALIZATION OF THE HEAD OF IT//
let snakeBody;
let head;


// THE PART THAT HANDLE THE RANDOM SPAWN OF NEW POINTS //
let point;
let bigPoint;
function newPoint(radius){
	let rX = Math.floor(Math.random()*gridNumbers) * 11;
	let rY = Math.floor(Math.random()*gridNumbers) * 11;

	point = new Block(rX,rY,radius,10);
	if(gameT == 'hard'){
		while(snakeBody.some(el=>colision(el,point)) || obstacles.some(el=>colision(el,point))){
			console.log('a fost spawnat in el')
			rX = Math.floor(Math.random()*gridNumbers) * 11;
			rY = Math.floor(Math.random()*gridNumbers) * 11;
			point = new Block(rX,rY,radius,10);
		}
	}else{
		while(snakeBody.some(el=>colision(el,point))){
			console.log('a fost spawnat in el')
			rX = Math.floor(Math.random()*gridNumbers) * 11;
			rY = Math.floor(Math.random()*gridNumbers) * 11;
			point = new Block(rX,rY,radius,10);
		}
	}

	point.draw();
}
function bigPointGenerator(radius){
	let rX = Math.floor(Math.random()*gridNumbers) * 10;
	let rY = Math.floor(Math.random()*gridNumbers) * 10;
	bigPoint = new Block(rX,rY,radius,20);
	bigPoint.draw();
}

//Function that creates obstacles

function Obstacle(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.draw = function(){
		c.fillRect(x,y,width,height);
	}
}

//THE FUNCTION THAT INITIALIZE THE GAME why is here? I DONT KNOW...//

function init(gameType){
	if(animateHolder){
		window.cancelAnimationFrame(animateHolder);
	}
	c.clearRect(0,0,canvasW,canvasH);
	snakeBody = [];
	points = 0;
	head = new Block(0,0,10);
	snakeBody.push(head);
	head.draw();
	newPoint(10);
	gameT = gameType;

	obstacles.forEach(el=>el.draw());
	animate();

}
//init();


// THE PART WHERE THE ANIMATION IS GOING ON//

function animate(){
	animateHolder = window.requestAnimationFrame(animate);
	timer++;
	if(timer < 7) return;
	pressable = true;
	timer = 0;
	c.clearRect(0,0,canvasW,canvasH);
	point.draw();

	if(gameT == 'hard'){
		obstacles.forEach(el=>el.draw());
	}


	snakeBody.forEach((el,idx)=>{
		if(idx==0){
			el.update();
		}else{
			el.x = snakeBody[idx-1].initialX;
			el.y = snakeBody[idx-1].initialY;
			el.draw();
		}
	});

	snakeBody.forEach((el,idx)=>{
		el.initialX = el.x;
		el.initialY = el.y;
	});
	if(bigPoint){
		if(colision(snakeBody[0],bigPoint)){
			points += Math.ceil(200*bigPoint.opacity);
			bigPoint = undefined;
		}else{
			bigPoint.updateOpacity();
		}
	}
	if(endGame()) gameOver();
	if(obstacles.some(el=>colision(el,head))){
		gameOver();
		return;
	}
	if(colision(head,point)) colisionHappend();	
	pointsTxt.innerText = points;
}

//FUNCTION CALLED WHEN THE COLISION BETWEEN THE SNAKE AND A POINT IS MADE//
function colisionHappend(){
	let bodyLength = snakeBody.length;
	let sTail = snakeBody[bodyLength-1];
	snakeBody.push(new Block(sTail.x+11 , sTail.y+11 , 10));
	points += 2;                   //must do it so the point has a point.value and add it to this, for the fat one
	
	if(bodyLength%5 == 0) bigPointGenerator(20);
	newPoint(10);
}

//FUNCTION THAT CHECK IF THE WORM HAS TOUCH IT'S OWN BODY//
function endGame(){
	return !snakeBody.every((el,idx)=>{
		if(idx==0){return true};
		return !colision(head,el);
	})
}


function keyGameOver(e){
	let thisKey = e.key;
	if(thisKey!='ArrowRight' && thisKey != 'ArrowLeft' && thisKey != 'Enter') return;

	let length = overOptions.length;
	if(thisKey == 'Enter'){
		let toThis;
		for(var i = 0 ; i < length;i++){
			if(overOptions[i].classList.contains('active')){
				toThis = overOptions[i].dataset.to;
				break;
			}
		}
		endGameScreen.classList.remove('active');
		window.removeEventListener('keydown' , keyGameOver);
		if(toThis == 'menu'){
			interfaceUl.style.display = 'block';
			window.addEventListener('keydown',interfaceKey);
		}else{
			window.addEventListener('keydown', keyDownListener);
			init(gameT);
		}

		return;
	}
	cicleThrough(overOptions,thisKey,'ArrowRight','ArrowLeft',length);
}


function gameOver(){
	window.cancelAnimationFrame(animateHolder);
	window.removeEventListener('keydown', keyDownListener);
	c.clearRect(0,0,canvasW,canvasH);

	window.setTimeout(function(){
		endGameScreen.classList.add('active');
		window.addEventListener('keydown' , keyGameOver);
	}, 200)


	//init(gameT); 
}


//IDEAS 
//1.START/STOP BUTTON
//2.SCORE TYPE OF THING
//3.SPEED INCRESE