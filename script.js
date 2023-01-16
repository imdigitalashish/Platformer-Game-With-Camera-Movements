import { CollisionDetection } from "./CollisionsBlock.js";
import { floorCollisions, height, platformCollisions } from "./constants.js";
import { Player } from "./player.js";
import { Sprite } from "./sprite.js";
import { Vector } from "./vector.js";

class Game {
    constructor() {

        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1024;
        this.canvas.height = 576;
        this.frameBuffer = 40;


        this.floorCollisions2D = [];
        for (let i = 0; i < floorCollisions.length; i += 36) {
            this.floorCollisions2D.push(floorCollisions.slice(i, i + 36));
        }

        this.collisionsBlocks = [];
        this.floorCollisions2D.forEach((row, y) => {
            row.forEach((symbol, x) => {
                if (symbol == 202) {
                    this.collisionsBlocks.push(
                        new CollisionDetection({
                            position: new Vector({ x: x * 16, y: y * 16 })
                        })
                    );
                }
            })
        })

        this.platformCollisions2D = [];
        for (let i = 0; i < platformCollisions.length; i += 36) {
            this.platformCollisions2D.push(platformCollisions.slice(i, i + 36));
        }


        this.platformCollisionBlocks = [];
        this.platformCollisions2D.forEach((row, y) => {
            row.forEach((symbol, x) => {
                if (symbol == 202) {
                    this.platformCollisionBlocks.push(
                        new CollisionDetection({
                            position: new Vector({ x: x * 16, y: y * 16 })
                        })
                    );
                }
            })
        })



        this.scaledCanvas = {
            width: this.canvas.width / 4, // as we are scaling (4,4) the background
            height: this.canvas.height / 4,
        }
        window.gameHeight = this.canvas.height;


        this.player = new Player({
            position: { x: this.canvas.width / 9.3, y: this.canvas.height / 2.7, },
            collisionBlocks: this.collisionsBlocks,
            imageSrc: "./assets/warrior/Idle.png",
            frameRate: 8,
            animations: {
                Idle: {
                    imageSrc: "./assets/warrior/Idle.png",
                    frameRate: 8,
                },
                Run: {
                    imageSrc: "./assets/warrior/Run.png",
                    frameRate: 8,
                },
                RunLeft: {
                    imageSrc: "./assets/warrior/RunLeft.png",
                    frameRate: 8,
                },
                IdleLeft: {
                    imageSrc: "./assets/warrior/IdleLeft.png",
                    frameRate: 8,
                }
            }
        });
        this.keys = {};


        this.background = new Sprite({
            position: new Vector({ x: 0, y: 0 }),
            imageSrc: "./assets/background.png",
        })


        this.elements = [this.player];






        this.registerEventListeners();

        requestAnimationFrame(this.render.bind(this))
    }


    registerEventListeners() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key] = true;
        });
        window.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
        })
    }



    lasTick = Date.now();


    update() {
        this.elements.forEach((e) => {
            e.update(this.keys, this.ctx);
        })
        this.collisionsBlocks.forEach(collisionBlock => {
            collisionBlock.update(this.ctx);
        })
        this.platformCollisionBlocks.forEach(collisionBlock => {
            collisionBlock.update(this.ctx);
        });

        this.background.update(this.keys);
    }

    render(ts) {
        requestAnimationFrame(this.render.bind(this));


        // UPDATE ENGINE
        if (Date.now() - this.lasTick > this.frameBuffer) {
            this.update();
            this.lasTick = Date.now();
        }

        // RESET
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


        // CODE ENGINE
        this.ctx.save();
        this.ctx.scale(4, 4);
        this.ctx.translate(0, -this.background.image.height + this.scaledCanvas.height)
        this.background.draw(this.ctx);
        this.collisionsBlocks.forEach(collisionBlock => {
            collisionBlock.draw(this.ctx);
        })
        this.platformCollisionBlocks.forEach(block => {
            block.draw(this.ctx)
        })
        this.elements.forEach((e) => {
            e.draw(this.ctx);
        })
        this.ctx.restore();



        // DRAWING ENGINE



    }
}


window.onload = () => {
    window.game = new Game();
}