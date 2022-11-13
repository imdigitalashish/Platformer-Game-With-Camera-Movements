import { height } from "./constants.js";
import { Player } from "./player.js";
import { Sprite } from "./sprite.js";
import { Vector } from "./vector.js";

class Game {
    constructor() {

        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1024;
        this.canvas.height = 576;


        this.scaledCanvas = {
            width: this.canvas.width / 4, // as we are scaling (4,4) the background
            height: this.canvas.height / 4,
        }
        window.gameHeight = this.canvas.height;


        this.player = new Player({ position: { x: 0, y: 0 } });
        this.player2 = new Player({ position: { x: 300, y: 100 } });
        this.keys = {};


        this.background = new Sprite({
            position: new Vector({ x: 0, y: 0 }),
            imageSrc: "./assets/background.png",
        })


        this.elements = [this.player, this.player2];



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
            e.update(this.keys);
        })

    }

    render(ts) {
        requestAnimationFrame(this.render.bind(this));


        // UPDATE ENGINE
        if (Date.now() - this.lasTick > 40) {
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
        this.ctx.restore();

        // DRAWING ENGINE
        this.elements.forEach((e) => {
            e.draw(this.ctx);
        })
    }
}


window.onload = () => {
    window.game = new Game();
}