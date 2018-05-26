//THE INITIALIZATION PART
const canvas = document.querySelector('canvas');
const [vWidth,vHeight] = [window.innerWidth,window.innerHeight];
let projectileSpeed = 7;
let playerDelay = 10;
let gravity = .1;
let textHolder = document.querySelector('#text p');
let livesHolder = document.querySelector('ul.lives');
let startHpBall = 4;
let playerStartHealth = 3;


//SET THE CANVAS AND THE CONTEXT
cHeight = 500;
cWidth  = 700;
canvas.width = cWidth;
canvas.height = cHeight;
let c = canvas.getContext('2d');
c.globalCompositeOperation='destination-over'
//////////////////////////////////////////
//          RANDOM FUNCTIONS           //
/////////////////////////////////////////
function randomNumber(min,max){
    return Math.round(Math.random() * (max-min)) + min
}
function updateLivesUi(number){
    let one = '<li class="hearth"></li>';
    livesHolder.innerHTML = one.repeat(number);
}
//////////////////////////////////////////
//           EVENT LISTENERS           //
/////////////////////////////////////////
window.addEventListener('keydown',keyDownHandler)
window.addEventListener('keyup',keyUpHandler)


//////////////////////////////////////////
//    FUNCTION EVENT HANDLERS          //
/////////////////////////////////////////
function keyDownHandler(e){
    let thisKey = e.key;
    playerKeyDown(thisKey);
    if(thisKey === 'Escape'){
        closeAnimation();
    }else if(thisKey === ' '){
        player1.delay = playerDelay;
        porjectile1 = new Projectile(player1.x+(player1.width/2),cHeight,projectileSpeed);
    }
}
function keyUpHandler(e){
    let thisKey = e.key;
    playerKeyUp(thisKey);
}

//////////////////////////////////////////
//           LEVEL HANDELING            //
/////////////////////////////////////////

//consider 1hp of a ball radius being 5px;
let levels=[ 
    {'numberofballs':1,'level':1,'firstBallHp' : [2],'gifts':['hp','speed'],'giftchance':50},
    {'numberofballs':1,'level':2,'firstBallHp' : [4],'gifts':['hp','shield'],'giftchance':50},
    {'numberofballs':2,'level':3,'firstBallHp' : [2,2],'gifts':['hp','shield','sticky'],'giftchance':50},
    {'numberofballs':2,'level':4,'firstBallHp' : [4,2],'gifts':['hp','shield','sticky','speed'],'giftchance':50},
    {'numberofballs':1,'level':5,'firstBallHp' : [8],'gifts':['hp','shield'],'giftchance':50},
    {'numberofballs':2,'level':6,'firstBallHp' : [4,4],'gifts':['shield','sticky','speed'],'giftchance':50}
    
]
let currentLevel = 0;
let totalLevels = levels.length;
let porjectile1;
let superPowers = [];
let balls = [];
let player1;
let powerThisLevel;
let playerWidth = 20;
let playerHeight = 50;
let playerDx = 4;
let animationHolder;
let hpRadius = 5;
function levelStart(level){
    let infoLevel = levels[level];
    powerThisLevel = infoLevel.gifts;
    balls.push(new Ball(100,100,infoLevel.firstBallHp[0]*hpRadius,'red',1,0,infoLevel.firstBallHp[0]))
    if(infoLevel.numberofballs==2){
        balls.push(new Ball(cWidth-100,100,infoLevel.firstBallHp[1]*hpRadius,'red',-1,0,infoLevel.firstBallHp[1]))
    }
   
    
    if(infoLevel.level==1 && !player1){ //if the level is the first one, create the player else, just restore it
        player1 = new Player(cWidth/2-(playerWidth/2),cHeight-playerHeight,playerWidth,50,0);
        updateLivesUi(playerStartHealth);
    }else{
        resetPlayer();
    }
    animate();
}
function resetPlayer(){
    player1.x = cWidth/2-(playerWidth/2);
    player1.shield = false;
    player1.delay = 0;
}
function resetLevel(level){
    balls = [];
    let infoLevel = levels[level];
    powerThisLevel = infoLevel.gifts;
    balls.push(new Ball(100,100,infoLevel.firstBallHp[0]*hpRadius,'red',1,0,infoLevel.firstBallHp[0]));
    if(infoLevel.numberofballs==2){
        balls.push(new Ball(cWidth-100,100,infoLevel.firstBallHp[1]*hpRadius,'red',-1,0,infoLevel.firstBallHp[1]))
    }
    porjectile1 = '';
    superPowers = [];
    resetPlayer();
    animate();
}
function levelDone(){ //when level is done clear the rect and give the text that the level is done
    closeAnimation();
    window.setTimeout(()=>{
        c.clearRect(0,0,cWidth,cHeight);
        currentLevel++;
        if(currentLevel < totalLevels){
         displayText(`Congrats you beat this level, level ${currentLevel + 1} coming, press the button when you fell ready for it!`);
        }else{
            displayText('Congrats you beat the game')
        }
    },500)
    if(currentLevel+1 < totalLevels){
        window.setTimeout(()=>{
            textHolder.style.transform = 'scale(0)';
            levelStart(currentLevel);
            
        },3000);
    }

}
levelStart(currentLevel);

function displayText(text,time=undefined){
    if(time){
        window.setTimeout(()=>{
            textHolder.style.transform = 'scale(0)';
        },time)
    }
    textHolder.innerText = text;
    textHolder.style.transform = 'scale(1)';
}
//////////////////////////////////////////
//               PLAYER                //
/////////////////////////////////////////
function Player(x,y,width,height,dx){
    [this.x,this.y,this.width,this.height,this.dx] = [x,y,width,height,dx];
    this.delay = 0;
    this.isImune = false;
    this.shield = false;
    this.health = playerStartHealth;
    this.draw = function(){
        c.fillStyle = 'rgba(20,120,50,1)'
        c.fillRect(this.x,this.y,this.width,this.height);
    }
    this.imune = function(){
        this.isImune = true;
        window.setTimeout(function(){
            player1.isImune = false;
            console.log(player1.isImune + 'after timeout');
        },1000)
    }
    this.update = function(){

        if(this.delay > 0){
            this.delay--;
        }else if(this.x+this.dx < cWidth-this.width && this.x+this.dx > 0){
            this.x+=this.dx;
        }
        if(this.shield){
            c.beginPath();
            c.strokeStyle = '#3498db';
            c.rect(this.x-5,this.y-5,this.width+10,this.height+10);
            c.lineWidth = 1;
            c.stroke();
        }
        this.draw();

    }
}



function playerKeyDown(thisKey){
    //if the key will be arrowLeft=>dx-- if it is arrowRight=> dx ++
    if(thisKey == 'ArrowLeft'){
        player1.dx = -playerDx;
    }else if(thisKey == 'ArrowRight'){
        player1.dx = playerDx;
    }
}
function playerKeyUp(thisKey){
    if(thisKey == 'ArrowLeft' && player1.dx==-playerDx){
        player1.dx = 0;
    }else if(thisKey == 'ArrowRight' && player1.dx==playerDx){
        player1.dx = 0;
    }    
}

function playerGotHit(){
    if(player1.isImune){
        return;
    }
    if(player1.shield){ //when the user got the shield, take it off and let him be imune for 1 sec
        player1.shield = false;
        player1.imune();
        return
    }
    if(player1.health-1<= 0){
        closeAnimation();
        alert('You are dead');
    }else{
        player1.health--;
        updateLivesUi(player1.health);
        closeAnimation();
        displayText(`You got hit, and now have ${player1.health} lives!Get ready for another try!`,time=2500)
        window.setTimeout(()=>{
            resetLevel(currentLevel);
        } , 2500)

    }
}

///////////////////////////////////////////
//             FIRING PART              //
/////////////////////////////////////////
let projectileType = 'normal';
function Projectile(x,y=cHeight,dy){
    [this.x,this.y,this.dy] = [x,y,dy];
    this.width = 2;
    this.height = 0;
    this.type = projectileType, //sticky or double;
    this.draw = function(){
        c.beginPath();
        c.moveTo(this.x,cHeight);
        c.lineTo(this.x,this.y);
        c.strokeStyle = 'black';
        c.lineWidth = 2;
        c.stroke();
    }
    this.update = function(){
        if(this.y - this.dy < 0){
            this.dy = 0;
            this.y = 0;
            if(this.type == 'normal'){
                porjectile1 = ''; //KILLING IT
            }
        }else{
            this.y-=this.dy;
            this.height = cHeight-this.y;
        }
        
        
        this.draw();
    }
}

///////////////////////////////////////////
//          SUperPowers                 //
/////////////////////////////////////////
let img = document.querySelector('img');

let imgs = {
    'hpImg' : document.querySelector('img#healthImg'), 
    'shieldImg' : document.querySelector('img#shieldImg'),
    'stickyImg' : document.querySelector('img#thornImg'),
    'speedImg' : document.querySelector('img#speedImg')
}

let superPowerWidth = 15;
let superPowerHeight = 15;
function SuperPower(x,y,width,height,dy,color,dieTime,power){
    [this.x,this.y,this.width,this.height,this.dy,this.color,this.dieTime] = [x,y,width,height,dy,color,dieTime];
    this.opacity = 1;
    this.power = power;
    this.draw = function(){
        c.save();
        c.beginPath();
        c.globalAlpha = this.opacity;
        c.drawImage(imgs[power+'Img'],this.x,this.y,15,15);
        c.restore();
    }
    this.update = function(){
        if(this.y+this.dy+superPowerHeight > cHeight){
            this.y = cHeight - 15;
            this.opacity -= 1/(this.dieTime*60); //2 sec to get it
        }else{
            this.y += this.dy;
        }
        this.draw();
    }
}


function superPowersLoop(){
    if(superPowers.length>0){
        superPowers.forEach((el,idx)=>{
            if(el.opacity <= 0){
                console.log('dead')
                superPowers.splice(idx,1);
            }else{
               if(colisionRect(el,player1)){
                    superPowers.splice(idx,1);
                    superPowerManager(el.power);
                    console.log(el.power);
                }else{
                    el.update();
                }
                
            }
        })
    }
}
function superPowerManager(thisPower){
    if(thisPower == 'speed'){
        playerDx += 3;
        console.log('boost up')
        window.setTimeout((e)=>{
            playerDx -= 3
            console.log('boost no')
        },3000);
    }else if(thisPower == 'sticky'){
        projectileType = 'sticky';
         
    }else if(thisPower === 'hp'){
        player1.health++;
        updateLivesUi(player1.health);
    }else if(thisPower === 'shield'){
        player1.shield = true;
    }
}
///////////////////////////////////////////
//               BALLS                  //
/////////////////////////////////////////
function Ball(x,y,radius,color,dx,dy,hp){
    [this.x,this.initialY,this.y,this.radius,this.color,this.dx,this.dy] = [x,y,y,radius,color,dx,dy];
    this.acceleration = 0;
    this.hp = hp;
    this.draw=function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle = this.color;
        c.fill();
    }
    this.update = function(){
        this.x+=this.dx;
        this.y+=this.dy;
        
        if(this.y+this.radius+this.dy>cHeight){
            this.dy = -this.dy;
        }else{
            this.dy += gravity;
        }
        this.y += this.dy;

        if(this.x+this.dx -this.radius < 0 || this.x+this.dx+this.radius>=cWidth){
            this.dx = -this.dx;
        }
       
        this.draw();
    }
}

function ballsLoop(){
    balls.forEach((el,idx)=>{
        el.update();
        if(checkColision(el,player1)){
            playerGotHit();
        }
     
        if(porjectile1 && checkColision(el,porjectile1)){
            porjectile1 = '';
            balls.splice(idx,1);
            
            if(el.hp >= 2){ //if the hp > 2 then the ball is big enough to split in twoo small ones
                balls.push(new Ball(el.x,el.y,el.radius/2,'blue',el.dx*1.5,0,el.hp/2),new Ball(el.x,el.y,el.radius/2,'blue',-el.dx*1.5,0,el.hp/2));
            }
            if(balls.length == 0){
                closeAnimation();
                levelDone();
            }else{
                if(randomNumber(0,4)==1){
                    //let po = ['hp','sticky','shield','speed'];
                    let thisPower = powerThisLevel[randomNumber(0,powerThisLevel.length-1)];
                    superPowers.push(new SuperPower(el.x,el.y,20,10,2,'red',3,thisPower));
                    console.log(superPowers);
                    
                }
            }
        }
       

    });
}

//////////////////////////////////////////
//              COLISION                //
/////////////////////////////////////////
function checkColision(ball,rect){
    let DeltaX = ball.x - Math.max(rect.x, Math.min(ball.x, rect.x + rect.width));
    let DeltaY = ball.y - Math.max(rect.y, Math.min(ball.y, rect.y + rect.height));
    return (DeltaX ** 2 + DeltaY ** 2) < (ball.radius ** 2 );
}
function colisionRect(rect1,rect2){
   return (rect1.x <= rect2.x+rect2.width && rect1.x+rect1.width >= rect2.x && rect1.y <= rect2.y+rect2.height && rect1.y+rect1.height >= rect2.height) 
}

///////////////////////////////////////////
//       ANIMATE FUNCTION PART          //
/////////////////////////////////////////


function animate(){
    animationHolder = window.requestAnimationFrame(animate);
    c.clearRect(0,0,vWidth,vHeight);

    superPowersLoop();
    player1.update();
    ballsLoop();


    if(porjectile1){
        porjectile1.update();
    }
    
}

function closeAnimation(){
    window.cancelAnimationFrame(animationHolder);
}







