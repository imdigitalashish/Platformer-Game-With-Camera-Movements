import { collisionDetection, globalScalingFactor, gravity } from "./constants.js";
import { Sprite } from "./sprite.js";
import { Vector } from "./vector.js";

export class Player extends Sprite {
    constructor({ position, collisionBlocks, imageSrc, frameRate, scale = 0.5 }) {
        super({ imageSrc, frameRate, scale });
        console.log(collisionBlocks)
        this.position = new Vector({ x: position.x, y: position.y });

        this.velocity = new Vector({ x: 0, y: 1 });
        // this.height = 25;
        // this.width = 25;
        this.collisionBlocks = collisionBlocks;
        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10,
        }
    }


    updateHitBox() {
        this.hitBox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 26,
            },
            width: 20,
            height: 26,
        }
    }

    // We don't need this because we are taking method from sprit.js which have image draw method !
    // draw(ctx) {
    //     ctx.fillStyle = "red";
    //     ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // }

    update(keys, ctx) {



        this.updateFrames();




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
        this.updateHitBox();
        this.checkForHorizontalCollisions();
        this.applyGravity();
        this.updateHitBox();
        this.checkForVerticalCollisions();

        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 1087, 9000);

    }


    checkForHorizontalCollisions() {
        this.collisionBlocks.forEach((collisionBlock, index) => {

            if (collisionDetection(this.hitBox, collisionBlock)) {
                console.log("COLLIDE");
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;
                    const offset = this.hitBox.position.x - this.position.x + this.hitBox.width;

                    this.position.x = collisionBlock.position.x - offset - 0.08;
                    return;

                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0;

                    const offset = this.hitBox.position.x - this.position.x;


                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.08;
                    return;
                }
            }
        })
    }


    checkForVerticalCollisions() {
        this.collisionBlocks.forEach((collisionBlock, index) => {
            if (collisionDetection(this.hitBox, collisionBlock)) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;

                    const offset = this.hitBox.position.y - this.position.y + this.hitBox.height;

                    this.position.y = collisionBlock.position.y - offset - 0.01;
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    const offset = this.hitBox.position.y - this.position.y;

                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
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