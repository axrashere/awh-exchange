class Bird {
	constructor({x, y, width, height, frames, radius, sprite, ctx, frameIndex, state, cvsH, nextLH}){
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.frames = frames
		this.radius = radius
		this.sprite = sprite
		this.ctx = ctx
		this.frameIndex = frameIndex
		this.state = state
		this.speed = 0
		this.gravity = 0.25 // гравитация
		this.jump = 4 // высота прыжка
		this.cvsH = cvsH
		this.nextLH = nextLH
	}
	draw() {
		ctx.drawImage(
			sprite,
			this.frames[this.frameIndex].sX,
			this.frames[this.frameIndex].sY,
			this.width,
			this.height,
			
			this.x - this.width/2,
			this.y - this.height/2,
			this.width,
			this.height)
	}
	update() {
		let period = this.state.current == this.state.getReady ? 10 : 5;
		this.frameIndex += this.frames%period == 0 ? 1: 0;
		this.frameIndex = this.frameIndex%this.frames.length;
		if (this.state.current == this.state.getReady) {
		   this.y = 150;
		   this.speed = 0; 
		} else {
			this.speed += this.gravity;
			this.y += this.speed;
			if (this.y + this.height/2 >= this.cvsH - this.nextLH) {
				this.y = this.cvsH - this.nextLH -this.height/2;
				if (this.state.current == this.state.game) {
					this.state.current = this.state.over;
				}
			}
		}
		if (this.speed >= this.jump) {
			this.frameIndex = 1;
		}
	}
	flap() {
		this.speed = - this.jump;
	} 
}