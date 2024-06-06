class Field {
	constructor({x, y, width, height, sX, sY, sWidth, sHeight, sprite, ctx, dx, state}){
		this.x = x
		this.y = y
		this.width = width
		this.height = height

		this.sX = sX
		this.sY = sY
		this.sWidth =  sWidth
		this.sHeight = sHeight 

		this.sprite = sprite
		this.ctx = ctx
		this.dx = dx
		this.state = state
	}
	draw() {
		ctx.drawImage(sprite, this.x, this.y, this.width, this.height, this.sX, this.sHeight - this.height, this.width, this.height)
		ctx.drawImage(sprite, this.x, this.y, this.width, this.height, this.sX + this.width, this.sHeight - this.height, this.width, this.height)
	}
	update(value) {
		let speed = this.dx
		if (value > 0) {
			if (value%10 == 0) {
				speed++
			}	
		}
		if (this.state.current == this.state.game) {
			this.sX = (this.sX - speed)%(this.width/2);
		} else {
			speed = this.dx;
		}
	}
}