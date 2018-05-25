//init the canvas, and the variables that we use along the project
let [canvas,canvasW,canvasH] = [document.querySelector('canvas'),1000,500];
canvas.width = canvasW;
canvas.height = canvasH;
let ctx = canvas.getContext('2d');

//the points array
let points = [];

//the values that define our movement/color/radius of our circles/lines
let maxSpeed = .5;
let numberOfPoints = 80;
let pointRad = 3;
let colors = ['rgb(95,52,75)' , 'rgb(217,0,0)' , 'rgb(255,45,0)' , 'rgb(255,140,0)','rgb(4,117,111)'];
let dBPoints = 150; //the maximum distance between points, if the distance is smaller then this draw a line

//the holder for the animaton so we can stop it when we press ESCAPE
let animHolder;

//random number generated function
function randomNumber(min,max){
    return (Math.random()*(max-min))+min;
}

//get the distance between 2 points
function distance(x1,x2,y1,y2){ 
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

//point maker
function Point(x,y,dx,dy,radius,color){
    [this.x,this.y,this.dx,this.dy,this.radius,this.color] = [x,y,dx,dy,radius,color];
    this.draw = function(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
        ctx.fill();
    }
    this.update = function(){
        if(this.x + this.dx + this.radius > canvasW || this.x+this.dx-this.radius < 0){
            this.dx = -this.dx;
        }else{
            this.x += this.dx;
        }
        if(this.y + this.dy + this.radius> canvasH || this.y+this.dy-this.radius < 0){
            this.dy = -this.dy;
        }else{
            this.y += this.dy;
        }
        this.draw();
    }
}

//line maker
function Line(startX,startY,endX,endY,opacity,color){
    [this.startX,this.startY,this.endX,this.endY,this.opacity,this.color] = [startX,startY,endX,endY,opacity,color.match(/[0-9]+/g)];
    this.draw = function(){
        ctx.beginPath();
        ctx.moveTo(startX,startY);
        ctx.lineTo(endX,endY);
        ctx.strokeStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.opacity})`;
        ctx.stroke();
    }
}

//Populate the points array
for(var i = 0 ; i < numberOfPoints ; i++){
    let ranX = Math.floor(randomNumber(pointRad,canvasW-pointRad));
    let ranY = Math.floor(randomNumber(pointRad,canvasH-pointRad));
    let ranDx = randomNumber(-maxSpeed,maxSpeed);
    let ranCol = colors[Math.floor(randomNumber(0,colors.length))];
    ranDx==0?ranDx=maxSpeed/2:ranDx;
    let ranDy = randomNumber(-maxSpeed,maxSpeed);
    ranDy==0?ranDy=-maxSpeed/2:ranDy;
    points.push(new Point(ranX,ranY,ranDx,ranDy,3,ranCol));
}

//Animate function that animate our 
function anim(){
    animHolder = window.requestAnimationFrame(anim);
    ctx.clearRect(0,0,canvasW,canvasH);
    points.forEach((el,idx)=>{
        
        points.forEach((element,index)=>{
            if(idx==index)return;
            let distancePoints = distance(el.x,element.x,el.y,element.y)-el.radius+element.radius;
            if(distancePoints <= dBPoints){
                let l = new Line(el.x,el.y,element.x,element.y,.8-(distancePoints/dBPoints),element.color);
                l.draw();
            }
        })
        el.update();
    });
}

//Start the animation
anim();

//Listen to the key, when the escape is pressed stop the animation
window.addEventListener('keydown',(e)=>e.key=='Escape'?window.cancelAnimationFrame(animHolder):'');