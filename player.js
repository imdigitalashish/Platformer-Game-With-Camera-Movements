import { globalScalingFactor, gravity } from "./constants.js";
import { Vector } from "./vector.js";

export class Player {
    constructor({ position }) {
        this.position = new Vector({ x: position.x, y: position.y });

        this.velocity = new Vector({ x: 0, y: 1 });
        this.height = 100;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, 100, this.height);
    }

    update(keys) {
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y < window.gameHeight) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }


        this.position.x += this.velocity.x;


        this.velocity.x = 0;

        if (keys.d) {
            this.velocity.x = 2 * globalScalingFactor;
        }

        if (keys.a) {
            this.velocity.x = -2 * globalScalingFactor;
        }

        if (keys.w) {
            this.velocity.y = -15 * globalScalingFactor;
        }
    }
}