// Переменные
// canvas
let canvas = document.querySelector("#my-canvas");
let ctx = canvas.getContext("2d");
// элементы dom
let startBtn = document.querySelector("#start-btn");
let restartBtn = document.querySelector("#restart-btn");
let splashScreen = document.querySelector("#splash-screen");
let gameoverScreen = document.querySelector("#gameover-screen");
// основной object игры
let game;

// Функции
const startGame = () => {
	// прячем заставку
	splashScreen.style.display = "none";
	// показываем игровой экран
	canvas.style.display = "flex";

	// начинаем игру
	// создаём экземляр класса Game
	game = new Game();
	game.gameLoop()
};

const restartGame = () => {
	gameoverScreen.style.display = "none";
	canvas.style.display = "flex";
	/*
		создаём новый экземпляр класса Game
		возможно понадобится перезапуск некоторых Переменных
	*/
	game = new Game();
	game.gameLoop();
};

// Отслеживание событий
startBtn.addEventListener("click", startGame)
restartBtn.addEventListener("click", restartGame)

canvas.addEventListener( "click", () => {
	game.bird.birdJump(); // прыг по клику мышки
});

window.onkeydown = function keyDown(e) {
	if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38) {
		game.bird.birdJump(); // прыг по пробелу, клавише W или стрелке вверх
	};
};

class Game {
	// свойства
	constructor() {
		this.bg = new Image();
		this.bg.src = "images/bg.png";
		this.bird = new Bird();
		this.pipeArr = [ new Pipe("images/obstacle_top.png", -100) ];
		this.gapBetweenPipes = 120;
		this.pipeAppearingDistance = 400;
		this.isGameover = false;
	};
	// методы
	gameover = () => {
		// останавливаем игру
		this.isGameover = true;
		// скрываем canvas
		canvas.style.display = "none";
		// показываем экран перезапуска
		gameoverScreen.style.display = "flex";
	};
	spawnPipes = () => {
		console.log("добавляем трубу")
		/*
			после того как мы добавили трубу
			можно двигать игровой процесс через setIntervals, но есть вариант интереснее:
			если последний элемент массива в позиции 400, то...
		*/
		let lastIndex = this.pipeArr.length - 1;
		let lastPipe = this.pipeArr[ lastIndex ];
		if ( lastPipe.x === this.pipeAppearingDistance ) {
			// как мы добавляем трубу
			// генерим случайную координату верхушки трубы yPos
			let randomPosYTop = Math.random() * - canvas.height / 3 // 0 - 1
			// Math.random * range
			let pipeTop = new Pipe( "images/obstacle_top.png", randomPosYTop )
			this.pipeArr.push( pipeTop );
			// добавляем низ трубы
			let randomPosYBottom = randomPosYTop + pipeTop.height + this.gapBetweenPipes;
			let PipeBottom = new Pipe( "images/obstacle_bottom.png", randomPosYBottom )
			this.pipeArr.push(PipeBottom)
		};
	};
	gameLoop = () => {
		console.log("Игра началась!")
		// Чистим холст canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Перемещение и изменение элементов
		this.bird.birdGravity();
		// this.pipeArr.pipeMove();
		this.pipeArr.forEach( (eachPipe) => {
			eachPipe.pipeMove();
		});
		this.spawnPipes();
		this.pipeArr.forEach( (eachPipe) => {
			if (this.bird.birdPipeCollision( eachPipe )) {
				// функция возвращает true или false
				this.gameover()
			}
			  // this.isGameover = this.bird.birdPipeCollision( eachPipe )
		} );
		// Отрисовываем элементы
		ctx.drawImage(this.bg, 0, 0, canvas.width, canvas.height);
		this.bird.drawBird();
		// this.pipeArr.drawPipe();
		this.pipeArr.forEach( (eachPipe)  => {
			eachPipe.drawPipe();
		} );
		// Цикл игровой анимации и обработки физики
		if (!this.isGameover) {
			requestAnimationFrame(this.gameLoop);
		};
	};
}

class Bird {
	// свойства
	constructor() {
		this.birdImage = new Image();
		this.birdImage.src = "images/flappy.png";
		this.width = 50;
		this.height = 50;
		this.x = canvas.width / 6;
		this.y = canvas.height / 2;
		this.birdSpeed = 20;
	};
	// методы
	drawBird = () => {
		ctx.drawImage( this.birdImage, this.x, this.y, this.width, this.height );
	};
	birdGravity = () => {
		// posY ?
		this.y++;
	};
	birdJump = () => {
		this.y -= this.birdSpeed;
	};
	birdPipeCollision = (singlePipe) => {
		// singlePipe.x
		// singlePipe.y
		// проверка на столкновение птички с трубой
		if (this.x < singlePipe.x + singlePipe.width &&
		this.x + this.width > singlePipe.x &&
		this.y < singlePipe.y + singlePipe.height &&
		this.height + this.y > singlePipe.y) {
			console.log("БУМ!")
			return true
			// игра окончена
			// возвращаем логическое true, на которое триггерится окончание игры. и проверяем requestAnimationFrame
		} else {
			return false;
		};
	};
};

class Pipe {
	// свойства
	constructor( srcImage, yPos ) {
		this.image = new Image();
		this.image.src = srcImage; // динамическое
		this.width = 70;
		this.height = canvas.height * 0.75;
		this.x = canvas.width;
		this.y = yPos; // динамическое
	};
	// методы
	drawPipe = () => {
		ctx.drawImage( this.image, this.x, this.y, this.width, this.height );
	};
	pipeMove = () => {
		this.x -= 2;
	};
};