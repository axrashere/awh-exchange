/* размечаем html */
let field = document.createElement('div');
document.body.appendChild(field);
field.classList.add('field');

for (let i = 1; i<101; i++) {
    let excel = document.createElement('div');
    field.appendChild(excel);
    excel.classList.add('excel');
}

let excel = document.getElementsByClassName('excel');
let x = 1,
    y = 10;

for (let i=0; i<excel.length; i++) {
	if (x>10) {
		x = 1;
		y--;
	}
	excel[i].setAttribute('posX', x);
	excel[i].setAttribute('posY', y);
	x++;
}
/* размЕтили html */

/*  */

console.log('localStorage Start',localStorage);

if ( isset(localStorage.getItem('userData')) === true ) {
	console.log('local storage is not empty');
	var scoreS = JSON.parse(localStorage.getItem('userData')); // в переменной scoreS у нас теперь вся таблица рекордов
} else {
	console.log('local storage is empty');
	var scoreS = [
		{
			"name": "Анонним",
			"score": 0,
			"curr": false,
		},
		{
			"name": "axr",
			"score": 13,
			"curr": true,
		},
		{
			"name": "Liza",
			"score": 5,
			"curr": false,
		},
		{
			"name": "Ann",
			"score": 10,
			"curr": false,
		},
		{
			"name": "Казимир",
			"score": 20,
			"curr": false,
		}
	];
	localStorage.setItem('userData', JSON.stringify(scoreS));// Сохраняем объект из scoreS в localStorage
};

var userDataCurrentSource = JSON.parse(localStorage.getItem('userData'));// Извлекаем сохранённый объект

var i = userDataCurrentSource.findIndex(elem => elem.curr === true); // индекс элемента массива userDataCurrentSource, в котором значение ключа curr равно true

var userDataCurrent = userDataCurrentSource[i]; // в переменной userDataCurrent у нас все данные текущего пользователя: name (string), score (number), curr (logic)

/*  */

/* ждём нажатия курсорных клавиш */
window.addEventListener('keydown', dir);

/* создаём змею */
function generateSnake() {
    let posX = Math.round(Math.random() * (10 - 3) + 3);
    let posY = Math.round(Math.random() * (10 - 1) + 1);
    return [posX, posY];
}

let coordinates = generateSnake();
let snakeBody = [
	document.querySelector('[posX = "' + coordinates[0] + '"][posY = "' + coordinates[1] + '"]'),
	document.querySelector('[posX = "' + (coordinates[0]-1) + '"][posY = "' + coordinates[1] + '"]'),
	document.querySelector('[posX = "' + (coordinates[0]-2) + '"][posY = "' + coordinates[1] + '"]')
];

for (let i = 0; i<snakeBody.length; i++) {
	snakeBody[i].classList.add('snakeBody');
}

snakeBody[0].classList.add('head');
/* создАли змею */

/* создаём мышь */
let mouse;

let score = 0;

function createMouse() {
    function generateMouse() {
        let posX = Math.round(Math.random() * (10 - 3) + 3);
        let posY = Math.round(Math.random() * (10 - 1) + 1);
        return [posX, posY];
    }

    let mouseCoordinates = generateMouse();
    mouse = document.querySelector('[posX = "' + mouseCoordinates[0] + '"][posY = "' + mouseCoordinates[1] + '"]')
    
    while(mouse.classList.contains('snakeBody')) {
        let mouseCoordinates = generateMouse();
        mouse = document.querySelector('[posX = "' + mouseCoordinates[0] + '"][posY = "' + mouseCoordinates[1] + '"]')
    }
    
    mouse.classList.add('mouse');
}

createMouse();
/* создАли мышь */

/* движок игры: движение, питание, рост, смерть */
let direction = 'right';

let steps = false;

/* табло с очками */
let scorePad = document.createElement('div');
document.body.appendChild(scorePad);
scorePad.style.cssText = `
margin:20px 0 0 0;
font-size:20px;
display: flex;
flex-wrap: wrap;
width: 500px;
justify-content: space-around;
`;
scoreFill(userDataCurrent,userDataCurrentSource);
/* табло с очками готово */

// заполнение табло выносим в функцию
function scoreFill(userDataCurrent,userDataCurrentSource) {

	let playerName = userDataCurrent.name;
	let playerReg = '<p>Не ' + playerName + '? <button id="reg">Представиться</button></p>';
	let infoMessage = '<p>Здравствуй, <i id="playerName">' + playerName + '</i>!</p>';
	infoMessage = infoMessage + playerReg;
	infoMessage = infoMessage + '<p>Ваши очки: <i id="score">' + score + '</i></p>';
	infoMessage = infoMessage + '<p>Ваш рекорд: <i id="top">' + userDataCurrent.score + '</i></p>';
	infoMessage = infoMessage + '<div><button id="all">Смотреть все рекорды</button><button id="clear">Очистить рекорды</button></div>';
	scorePad.innerHTML = infoMessage;

	// отрисовали табло - вешаем обработчики на кнопки
	document.getElementById('reg').addEventListener(
	'click',
	function() {
		userReg(userDataCurrent,userDataCurrentSource);
	},
	false,
	);

	document.getElementById('all').addEventListener('click', function(){ 
		let scoreList = '';
		for (const key in userDataCurrentSource) {
			let cPlayer = userDataCurrentSource[key].curr === true ? '. Играет сейчас' : '';
			scoreList += userDataCurrentSource[key].name + ': ' + userDataCurrentSource[key].score + cPlayer + '\n';
		}
		alert(scoreList);
	});
	document.getElementById('clear').addEventListener('click', function(){ 
		clearRecords();
	});
};

/*	основная функция игры.
	в этой функции всё: 
	- новое положение змеи с учётом нажатия управляющих клавиш,
	- направление движения головы змеи с учётом нажатия управляющих клавиш,
	- проверка на съеденность мыши,
	- рост змеи после съеденной мыши
	- проверка на укус себя,
	- подсчёт очков и подведение итогов
 */
function move() {

	let snakeCoordinates = [snakeBody[0].getAttribute('posX'), snakeBody[0].getAttribute('posY')]
    snakeBody[0].classList.remove('head');
    snakeBody[snakeBody.length - 1].classList.remove('snakeBody');
    snakeBody.pop();

	if (direction == 'right') {
		if(snakeCoordinates[0] < 10) {
			snakeBody.unshift(document.querySelector('[posX = "' + (+snakeCoordinates[0] + 1 ) + '"][posY = "' + snakeCoordinates[1] + '"]'));
		} else {
			snakeBody.unshift(document.querySelector('[posX = "1"][posY = "' + snakeCoordinates[1] + '"]'));
        }
	} else if (direction == 'left') {
		if(snakeCoordinates[0] > 1) {
			snakeBody.unshift(document.querySelector('[posX = "' + (+snakeCoordinates[0] - 1 ) + '"][posY = "' + snakeCoordinates[1] + '"]')); 
		} else {
				snakeBody.unshift(document.querySelector('[posX = "10"][posY = "' + snakeCoordinates[1] + '"]'));
		}
	} else if (direction == 'up') {
		if(snakeCoordinates[1] < 10) {
			snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "' + ( + snakeCoordinates[1]+1) + '"]')); 
		} else {
			snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "1"]'));
		} 
	} else if (direction == 'down') {
		if(snakeCoordinates[1] > 1) {
			snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '" ][posY = "' + (snakeCoordinates[1]-1) + '"]')); 
		} else {
			snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "10"]'));
		}
	}
	/* проверка на съеденность мыши */
	if (snakeBody[0].getAttribute('posX') == mouse.getAttribute('posX') && snakeBody[0].getAttribute('posY') == mouse.getAttribute('posY')) {
		userDataCurrentSource = readUserData();
		userDataCurrent = userDataCurrentSource[i];
		mouse.classList.remove('mouse');
		let a = snakeBody[snakeBody.length - 1].getAttribute('posX');
		let b = snakeBody[snakeBody.length - 1].getAttribute('posY');
		snakeBody.push(document.querySelector('[posX = "' + a + '" ][posY = "' + b + '"]'));
		createMouse();
		score = score + 1;
		scoreFill(userDataCurrent,userDataCurrentSource);
		// Highscore!!
		if ( score > userDataCurrent.score) {
			userDataCurrent.score = score;
			updateUserData(userDataCurrentSource); // пишем состояние в локалсторадж
			document.getElementById("top").innerHTML = score;
		}
		document.getElementById("score").innerHTML = score;
	}
	/* проверка на кусание себя */
	if (snakeBody[0].classList.contains('snakeBody')) {
		setTimeout(()=> {
			var finalMess = 'Себя кусать - игру кончать. ' + document.getElementById("playerName").innerHTML + ', вы съёли мышей на ' + document.getElementById("score").innerHTML + ' очков.';
			alert(finalMess);
		},200);
		clearInterval(interval); // останавливаем игру
		snakeBody[0].style.background = 'red';
		// записываем результат
		localStorage.clear();
		localStorage.setItem('userData', JSON.stringify(userDataCurrentSource));// Сохраняем объект из userDataCurrentSource в localStorage
		let restart = document.createElement('button');
		document.body.prepend(restart); // добавляем в документ кнопку перезапуска игры
		restart.setAttribute('id', 'restart');
		restart.innerHTML = 'Начать новую игру';
		restart.addEventListener("click", function(){ 
			window.location.reload(true);
		});
	}
    /* размечаем новое положение змеи */
	snakeBody[0].classList.add('head');
	for (let i = 0; i < snakeBody.length; i++) {
		snakeBody[i].classList.add('snakeBody');
	}
	steps = true;
}

/* повторяем ходы каждые gameSpeed миллисекунд */
let gameSpeed = 250;
let interval = setInterval(move, gameSpeed);

/* обрабатываем нажатия курсорных клавиш */
function dir(e) {
    if (steps==true) {
		if (e.keyCode == 37 && direction != 'right') {
			e.preventDefault(); /* чтоб сраница не скроллилась кнопками */
			direction = 'left';
			steps = false;
		}
		else if (e.keyCode == 38 && direction != 'down') {
			e.preventDefault(); /* чтоб сраница не скроллилась кнопками */
			direction = 'up';
			steps = false;
		}
		else if (e.keyCode == 39 && direction != 'left') {
			e.preventDefault(); /* чтоб сраница не скроллилась кнопками */
			direction = 'right';
			steps = false;
		}
		else if (e.keyCode == 40 && direction != 'up') {
			e.preventDefault(); /* чтоб сраница не скроллилась кнопками */
			direction = 'down';
			steps = false;
		}
	}
}

function askName(userDataCurrentSource) {
	if (score == 0) {
		var answer = prompt('Ваше имя? рЕГисТр букв учитывается', '');
		var result = JSON.stringify(String(answer));

		if (answer == '' || answer == 'Null' || answer == 'null' || answer == null) {
			console.log('answer 2',answer);
			alert('Имя не может быть пустым');
		} else user = userDataCurrentSource.find(item => item.name === answer); // ищем, есть ли уже такое имя?
		
		if (isset(user)) {
			var popMessage = 'Имя уже используется. Играть под ником \xAB' + answer + '\xBB?';
			if (confirm(popMessage)) {
				indexByName = userDataCurrentSource.findIndex(x => x.name === answer);
				userDataCurrentSource[i].curr = false; // текущий пользователь больше не текущий
				userDataCurrentSource[indexByName].curr = true; // и назначаем пользователя с именем answer в текущие
				var userDataCurrent = userDataCurrentSource[indexByName]; // данные текущего пользователя у нас теперь такие: name (string), score (number), curr (logic)
				score = 0;
				updateUserData(userDataCurrentSource);
				window.location.reload(true);
				clearInterval(interval); // останавливаем игру
				setInterval(move, gameSpeed); // запускаем с новыми данными
				scoreFill(userDataCurrent,userDataCurrentSource);
			};
		} else {
			i = userDataCurrentSource.findIndex(elem => elem.curr === true); // индекс элемента массива userDataCurrentSource, в котором значение ключа curr равно true
			userDataCurrent = userDataCurrentSource[i];
			userDataCurrentSource[i].curr = false; // текущий игрок больше не текущий
			userDataCurrentSource.push({name:answer, score:0, curr:true}); // добавляем игрока, делаем его текущим
			updateUserData(userDataCurrentSource); // обновляем данные в хранилище, читаем их обратно в игру
			i = userDataCurrentSource.length-1;
			userDataCurrent = userDataCurrentSource[i];
			scoreFill(userDataCurrent,userDataCurrentSource);
		};
	} else {
		alert('Раунд уже начался. Смена игрока невозможна.')
	};
}

function clearRecords() {
	if (confirm('Очистить рекорды?') === true) {
		userDataCurrentSource.forEach(function(item, i, userDataCurrentSource) {
			let message = i + ": " + item + " (массив:" + userDataCurrentSource + ")";
			userDataCurrentSource[i].score = 0; // для всех игроков устанавливаем счёт в зеро
		});
		localStorage.clear();
		localStorage.setItem('userData', JSON.stringify(userDataCurrentSource));// Сохраняем обнулённые достижения из userDataCurrentSource в localStorage
		document.getElementById("top").innerHTML = 0;
		alert( 'Таблица рекордов очищена' );
	};
}

function isset(obj) { // функция для проверки существования переменной
	if (typeof obj === 'undefined' || obj === null ) {
		return false;
	} else {
		return true;
	};
};

function readUserData() {
	return JSON.parse(localStorage.getItem('userData'));
};
function updateUserData(obj) {
	localStorage.clear();
	localStorage.setItem('userData', JSON.stringify(obj));
	return userDataCurrentSource = JSON.parse(localStorage.getItem('userData'));
};

function userReg(userDataCurrent,userDataCurrentSource) {
	askName(userDataCurrentSource);
	userDataCurrent = userDataCurrentSource[i];
	updateUserData(userDataCurrentSource);
};

