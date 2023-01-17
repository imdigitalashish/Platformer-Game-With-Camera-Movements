import { collisionDetection, globalScalingFactor, gravity } from "./constants.js";
import { Sprite } from "./sprite.js";
import { Vector } from "./vector.js";

export class Player extends Sprite {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        imageSrc,
        frameRate,
        scale = 0.5,
        animations
    }) {
        super({ imageSrc, frameRate, scale });
        this.position = new Vector({ x: position.x, y: position.y });

        this.velocity = new Vector({ x: 0, y: 1 });
        // this.height = 25;
        // this.width = 25;
        this.lastDirection = "right";

        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;
        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10,
        },
            this.animations = animations;

        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;
            this.animations[key].image = image;

        }

        this.cameraBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }

        this.spanCameraToLeft = false;

    }

    updateCamerabox() {
        this.cameraBox = {
            position: {
                x: this.position.x - 50,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }

    }

    checkForHorizontalCanvasCollision() {
        if (this.hitBox.position.x + this.hitBox.width + this.velocity.x >= 576 ||
            this.hitBox.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0;
        }
    }

    shouldPanCameraToTheLeft({ camera }) {
        const cameraboxRightSide = this.cameraBox.position.x + this.cameraBox.width;
        const scaledDownCanvasWidth = canvasD.width / 4;


        if (cameraboxRightSide >= 576) return; // 576 is real value original background

        if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x

            return true;
        }
        return false;
    }

    shouldPanCameraToRight({ camera }) {

        if (this.cameraBox.position.x <= 0) return;

        if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x;
        }
    }

    shouldPanCameraDown({ camera }) {


        if (this.cameraBox.position.y + this.velocity.y <= 0) return;
        else if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y
        }
    }

    shouldPanCameraUp({ camera }) {


        // if (this.cameraBox.position.y + this.velocity.y <= 0) return;


        if (this.cameraBox.position.y + this.cameraBox.height + this.velocity.y >= 432) return;

        const scaledCanvasHeight = canvasD.height / 4
        if (this.cameraBox.position.y + this.cameraBox.height >= Math.abs(camera.position.y) + scaledCanvasHeight) {
            camera.position.y -= this.velocity.y
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


    switchSprite(key) {
        if (this.image === this.animations[key].image) return;
        this.image = this.animations[key].image;
    }

    update(keys, ctx) {



        this.updateFrames();
        this.updateCamerabox();

        this.position.x += this.velocity.x;


        this.velocity.x = 0;

        if (this.lastDirection == "right") {
            this.switchSprite('Idle');

        } else {
            this.switchSprite("IdleLeft");
        }
        if (keys.d) {
            this.switchSprite('Run');

            this.velocity.x = 2 * globalScalingFactor;
            this.lastDirection = "right";
            this.checkForHorizontalCanvasCollision();
        }

        if (keys.a) {
            this.switchSprite("RunLeft");
            this.velocity.x = -2 * globalScalingFactor;
            this.lastDirection = "left";
        }

        if (keys.w) {
            if (this.velocity.y === 0) {
                this.velocity.y = -5.5 * globalScalingFactor;

            }
        }

        // if (this.velocity.y < 0) {
        //     this.switchSprite("Jump")
        // }

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


        this.platformCollisionBlocks.forEach((collisionBlock, index) => {

            if (collisionDetection(this.hitBox, collisionBlock)) {
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


        this.platformCollisionBlocks.forEach((collisionBlock, index) => {
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