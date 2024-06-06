const config = new Config();
const cvs = document.getElementById(config.canvasID);
const ctx = cvs.getContext("2d");
const sprite = new Image();
sprite.src = "sprite.png";
let frameIndex = 0;
const dx = 2; // расстояние можду трубами
const record = parseInt(localStorage.getItem("HiScore")) || 0;
const firstLine = new Field({
	x: config.firstLine.x,
	y: config.firstLine.y,
	width: config.firstLine.width,
	height: config.firstLine.height,
	sX: 0,
	sY: 0,
	sWidth: cvs.width,
	sHeight: cvs.height,
	sprite: sprite,
	ctx: ctx
});
const nextLine = new Field({
	x: config.nextLine.x,
	y: config.nextLine.y,
	width: config.nextLine.width,
	height: config.nextLine.height,
	sX: 0,
	sY: 0,
	sWidth: cvs.width,
	sHeight: cvs.height,
	sprite: sprite,
	ctx: ctx,
	dx: dx,
	state: config.state
});
const bird = new Bird({
	x: config.bird.x,
	y: config.bird.y,
	width: config.bird.width,
	height: config.bird.height,
	frames: config.bird.frames,
	radius: config.bird.radius,
	sprite: sprite,
	ctx: ctx,
	frameIndex: frameIndex,
	state: config.state,
	cvsH: cvs.height,
	nextLH: config.nextLine.height
});
const getReady = new GetReady({
	x: config.getReady.x,
	y: config.getReady.y,
	w: config.getReady.w,
	h: config.getReady.h,
	sX: cvs.width/2 - config.getReady.w/2,
	sY: 80,
	sprite: sprite,
	state: config.state,
	ctx: ctx
});
const pipes = new Pipes({
	position : config.pipes.position,
	bottom: config.pipes.bottom,
	top:config.pipes.top,
	w: config.pipes.w,
	h: config.pipes.h,
	gap: config.pipes.gap,

	sX: 150,
	maxY: config.pipes.maxY,
	sW: cvs.width,
	frameIndex: frameIndex,
	dx: dx,
	sprite: sprite,
	ctx: ctx,
	state: config.state,
	bird: bird,
	value: 0,
	record: record
});
const gameOver = new GameOver({
	x: config.gameOver.x,
	y: config.gameOver.y,
	w: config.gameOver.w,
	h: config.gameOver.h,
	sX: cvs.width/2 - config.gameOver.w/2,
	sY: 80,
	sprite: sprite,
	state: config.state,
	ctx: ctx
});
cvs.addEventListener("click", stateSwitch);
document.addEventListener("keydown", function(e) {
	if (e.keyCode == 32 || e.keyCode == 38 || e.keyCode == 87) {
		e.preventDefault();
		stateSwitch();
	}
});
function stateSwitch() {
	switch (config.state.current) {
	case config.state.getReady:
		config.state.current = config.state.game
		break;
	case config.state.game:
		bird.flap();
		break;
	case config.state.over:
		config.state.current = config.state.getReady;
		break;
	}
}
function update() {
	nextLine.update(pipes.value);
	bird.update();
	pipes.update();
}
function loop() {
	ctx.fillStyle = "#70c5ce";
	ctx.fillRect(0, 0,cvs.width, cvs.height);
	firstLine.draw();
	nextLine.draw();
	bird.draw();
	bird.frameIndex++
	pipes.draw();
	pipes.frameIndex++
	gameOver.draw(pipes.record, pipes.value);
	getReady.draw();
	update();
	requestAnimationFrame(loop);
}
loop();