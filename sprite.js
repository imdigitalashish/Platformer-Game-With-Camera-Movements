import { Player } from "./player.js";

export class Sprite {
    constructor({ position, imageSrc, frameRate = 1, scale = 1 }) {
        this.scale = scale;
        this.position = position;
        this.image = new Image();

        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * this.scale; // go get the same width as the crop box
            this.height = this.image.height * this.scale;
        }
        this.image.src = imageSrc;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        
    }


    draw(ctx) {

        if (!this.image) return; // prevents from happening undefined

        



        const cropbox = {
            position: {
                /**
                 * (this.image.width / this.frameRate) <- this entire quantity actually represents the whole crop box size
                 */
                x: this.currentFrame * (this.image.width / this.frameRate),
                y: 0
            },
            /**
             * as there are 8 frames in that box but this
             * would also affect our background which also using sprite
             * but it only has 1 frames so it will strech
             * so this property needs to be dynamic 
             */
            width: this.image.width / this.frameRate,
            height: this.image.height,
        }


      
        ctx.drawImage(this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        // ctx.fillStyle = "green";
    }

    update(keys) {
        this.updateFrames();
    }


    updateFrames() {
        if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
        else this.currentFrame = 0;
    }

}