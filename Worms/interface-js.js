// THE SCRIPT THAT DO THE DO

let interfaceUl = document.querySelector('.interface ul.main');
let optionsInterface = document.querySelector('.interface ul.options');
let countdownDiv = document.querySelector('.countdown');
let dificultyInterface = document.querySelector('.options');
let allLi       = [];
let dificulties = [];
let secCount    = 3;
let typeGame;
let countdownInterval;

optionsInterface.querySelectorAll('p').forEach(el=>dificulties.push(el));
interfaceUl.querySelectorAll('li').forEach(el=>allLi.push(el));


//THE EVENTLISTENERS
window.addEventListener('keydown',interfaceKey);


// FUNCTION THAT HANDLE THE KEY left/right UP/DOWN and cicle throgh an array with no problemos

function cicleThrough(arr,pressedKey,key1,key2,length){
	let indexOfActive;
	for(var i= 0 ; i < length ; i++){
		if(arr[i].classList.contains('active')){
			indexOfActive = i;
			break;
		}
	}
	arr[indexOfActive].classList.remove('active');
	if(pressedKey == key1){
		if(indexOfActive == 0) indexOfActive = length;
		arr[indexOfActive-1].classList.add('active');
	}else if(pressedKey == key2){
		if(indexOfActive == length-1) indexOfActive = -1;
		arr[indexOfActive+1].classList.add('active');
	}

}





//functions for the eventlisteners
function interfaceKey(e){
	let thisKey = e.key;

	if(thisKey != 'ArrowUp' && thisKey != 'ArrowDown' && thisKey != 'Enter') return;
	let length = allLi.length;
	if(thisKey=='Enter'){
		let indexOfActive;
		for(var i= 0 ; i < length ; i++){
			if(allLi[i].classList.contains('active')){
				indexOfActive = i;
				break;
			}
		}
		console.log(indexOfActive);
		thisPick(allLi[indexOfActive].dataset['for']);
		return;
	}

	cicleThrough(allLi,thisKey,'ArrowUp','ArrowDown',length);
	// let liLength = allLi.length;
	// let indexOfActive = allLi.indexOf(document.querySelector('.interface ul li.active'));
	


	//allLi[indexOfActive].classList.remove('active');
	// if(thisKey=='ArrowUp'){
	// 	if(indexOfActive == 0) indexOfActive = liLength;
	// 	allLi[indexOfActive-1].classList.add('active');
	// }else if(thisKey == 'ArrowDown'){
	// 	if(indexOfActive == liLength-1) indexOfActive = -1;
	// 	allLi[indexOfActive+1].classList.add('active');		
	// }
}


function countDown(forz){
		countdownDiv.style.display = 'block';
		countdownDiv.innerText = secCount;
		countdownInterval = window.setInterval(function(){
			secCount--
			countdownDiv.innerText = secCount;
			if(secCount == 0){
				secCount = 3;
				countdownDiv.style.display = 'none';
				window.clearInterval(countdownInterval);
				if(forz == 'new' || forz == 'restart'){
					init(typeGame);
				}else if(forz =='resume'){
					animate();
				}
				
			}
		}, 1000);
}

//FUNCTION THAT IS CALLED WHEN THE ENTER IS PRESSED

function thisPick(goTo){
	if(goTo == 'new-game'){    //new game means that we have to take down what is on the screen and init(); the game + scoatem keydownul asta il punem pe celalt;
		window.removeEventListener('keydown', interfaceKey); //remove this one
		window.addEventListener('keydown', keyDownListener); //and put the game one on
		interfaceUl.style.display = 'none';

		typeGame = dificultyInterface.querySelector('.active').dataset.dificulty;
		obstacles = [];
		if(typeGame == 'hard'){

			let half = Math.floor(gridNumbers/2);
			let w = oneBlock+1;
			obstacles.push(new Obstacle((half-3)*w , Math.floor(half/2)*w  ,w-1,(w*half)-1));
			obstacles.push(new Obstacle((half+3)*w , Math.floor(half/2)*w  ,w-1,(w*half)-1));
		}
		countDown('new');
		// countdownDiv.style.display = 'block';
		// countdownDiv.innerText = secCount;
		// countdownInterval = window.setInterval(function(){
		// 	secCount--
		// 	countdownDiv.innerText = secCount;
		// 	if(secCount == 0){
		// 		secCount = 3;
		// 		countdownDiv.style.display = 'none';
		// 		window.clearInterval(countdownInterval);
		// 		init(typeGame);
		// 	}
		// }, 1000);

	}else if(goTo == 'options'){
		interfaceUl.style.display = 'none';
		optionsInterface.style.display = 'block';
		window.removeEventListener('keydown', interfaceKey);
		window.addEventListener('keydown',optionsKey);
	}
}

function optionsKey(e){
	let thisKey = e.key;

	if(thisKey == 'Backspace' || thisKey == 'Escape' || thisKey == 'Enter'){
		window.addEventListener('keydown', interfaceKey);
		window.removeEventListener('keydown',optionsKey);
		interfaceUl.style.display = 'block';
		optionsInterface.style.display = 'none';

	}else if(thisKey == 'ArrowLeft' || thisKey == 'ArrowRight'){
		let length = dificulties.length;
		cicleThrough(dificulties,thisKey,'ArrowLeft','ArrowRight',length);
	}
}




// MUST SET IT IN THE LOCALSTORAGE TO BE THE SAME ALL THE TIME THE DIFICULTY