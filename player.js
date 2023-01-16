import { collisionDetection, globalScalingFactor, gravity } from "./constants.js";
import { Sprite } from "./sprite.js";
import { Vector } from "./vector.js";

export class Player extends Sprite {
    constructor({ position, collisionBlocks, imageSrc, frameRate }) {
        super({imageSrc, frameRate});
        console.log(collisionBlocks)
        this.position = new Vector({ x: position.x, y: position.y });

        this.velocity = new Vector({ x: 0, y: 1 });
        // this.height = 25;
        // this.width = 25;
        this.collisionBlocks = collisionBlocks;
    }

    // We don't need this because we are taking method from sprit.js which have image draw method !
    // draw(ctx) {
    //     ctx.fillStyle = "red";
    //     ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // }

    update(keys) {




        this.position.x += this.velocity.x;


        this.velocity.x = 0;

        if (keys.d) {
            this.velocity.x = 2 * globalScalingFactor;
        }

        if (keys.a) {
            this.velocity.x = -2 * globalScalingFactor;
        }

        if (keys.w) {
            this.velocity.y = -4 * globalScalingFactor;
        }

        // We need to first check for horizontal collision
        this.checkForHorizontalCollisions();
        this.applyGravity();
        this.checkForVerticalCollisions();

    }


    checkForHorizontalCollisions() {
        this.collisionBlocks.forEach((collisionBlock, index) => {
            if (collisionDetection(this, collisionBlock)) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;
                    this.position.x = collisionBlock.position.x - this.width - 1;
                    
                } 

                if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                    this.position.x = collisionBlock.position.x + collisionBlock.width + 1;
                } 
            }
        })
    }


    checkForVerticalCollisions() {
        this.collisionBlocks.forEach((collisionBlock, index) => {
            if (collisionDetection(this, collisionBlock)) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    this.position.y = collisionBlock.position.y - this.height - 0.01;
                } 

                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01;
                } 
            }
        })
    }

    applyGravity() {
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y < window.gameHeight) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
    }
}