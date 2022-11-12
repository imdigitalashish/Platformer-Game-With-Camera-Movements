
export class Sprite {
    constructor({ position, imageSrc }) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
    }


    draw(ctx) {
        if (!this.image) return; // prevents from happening undefined
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    update(keys) {
        
    }

}