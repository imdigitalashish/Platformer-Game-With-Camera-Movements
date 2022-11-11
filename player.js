import { Vector } from "./vector.js";

export class Player {
    constructor({ position }) {
        this.position = new Vector({ x: position.x, y: position.y });

        this.velocity = new Vector({ x: 0, y: 1 });
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, 100, 100);
    }

    update(keys) {
        this.position.y += this.velocity.y;
        this.velocity.y += 0.5;
    }
}