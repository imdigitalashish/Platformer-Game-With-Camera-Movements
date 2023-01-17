export class CollisionDetection {
    constructor({ position, height = 16}) {
        this.position = position;
        this.width = 16;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }


    update(keys) {
        
    }
}