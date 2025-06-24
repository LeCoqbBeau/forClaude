import * as Vec2D from "vector2d";
import {clamp, max, min} from "../utils.mjs";
import {Collidable, createRectangle} from "./Collidable.mjs";

export class Paddle {

// Const member

    public get length() {
        return 2;
    };
    public get speed() {
        return 0.50; // this is speed per move() call
    };

// Constructor

    private readonly _hitbox: Collidable;
    constructor(
        _playerID: number,
        _pos: Vec2D.Vector
    ) {
        this._hitbox = createRectangle(
            _pos,
            new Vec2D.Vector(0, -this.length),
            `paddle.${_playerID}`
        );
    }
    private _dir = new Vec2D.Vector(0, 0);

// Accessors

    public get hitbox() {
        return this._hitbox;
    }

    public get pos() {
        return this._hitbox.pos;
    }

    public get midPos() {
        return new Vec2D.Vector(this._hitbox.pos.x - this.length / 2, this._hitbox.pos.y - this.length / 2);
    }

// Methods

    shouldMove() {
        return (false ? true : false); // REPLACE THE FIRST FALSE BY THE ACTUAL CONDITION!!!
    }

    changeDir(dir: number) {
        this._dir.setY(dir).unit().mulS(this.speed);
    }

    move() {
        this.pos.y = clamp(this.pos.y + this.speed, 0, 10);
    }
}

