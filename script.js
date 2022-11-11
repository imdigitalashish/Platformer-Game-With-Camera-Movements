import { Player } from "./player.js";

class Game {
    constructor() {

        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1024;
        this.canvas.height = 576;



        this.player = new Player({ position: { x: 0, y: 0 } });
        this.player2 = new Player({ position: { x: 300, y: 100 } });
        this.elements = [this.player, this.player2]
        this.keys = [];

        requestAnimationFrame(this.render.bind(this))
    }



    lasTick = Date.now();


    update() {
        this.elements.forEach((e) => {
            e.update(this.keys);
        })
        
    }

    render(ts) {
        requestAnimationFrame(this.render.bind(this));


        if (Date.now() - this.lasTick > 40) {
            this.update();
            this.lasTick = Date.now();
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);



        this.elements.forEach((e) => {
            e.draw(this.ctx);
        })
    }
}


window.onload = () => {
    window.game = new Game();
}