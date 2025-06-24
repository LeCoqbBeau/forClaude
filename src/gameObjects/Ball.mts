import * as Vec2D from "vector2d";
import {Collidable} from "./Collidable.mjs";
import {projectVector} from "../utils.mjs";
import {Paddle} from "./Paddle.mjs";
import {AbstractVector} from "vector2d";

export class Ball {

// Const member

    public get size() {
        return 0.5;
    };

    public get acceleration() {
        return 1/100 // this much of its own speed is added to the ball's speed
    }

    public get baseSpeed() {
        return 0.5;
    }

// Constructor

    constructor(
        private _pos: Vec2D.AbstractVector,
        private _dir: Vec2D.AbstractVector,
        public speed: number = this.baseSpeed
    ) {}

// Accessors

    public get pos() {
        return this._pos;
    }

    public set pos(newPos: AbstractVector) {
        this._pos = newPos;
    }

    public get dir() {
        return this._dir;
    }

    public set dir(newDir: AbstractVector) {
        this._dir = newDir;
    }

// Methods

    public advance() {
        this.pos.add(this._dir.clone().unit().mulS(this.speed));
    }

    public accelerate() {
        this.speed *= (1 + this.acceleration);
    }

    public reflect(edge: Vec2D.AbstractVector[]) {
        const u = edge[1].clone().subtract(edge[0]);
        const theta = Math.acos(this.dir.clone().dot(u) / (this.dir.length() * u.length()));
        this.dir = this.dir.rotate(theta * 2).unit().mulS(this.speed);
    }

    public paddleReflect(paddle: Paddle) {
        const dY = this.pos.y - paddle.midPos.y;
        let theta = 75 * (dY) * (Math.PI / 180.0);
        this.dir = this.dir.reverse().setY(0).rotate(theta).unit().mulS(this.speed);
    }

    public collide(objects: Iterable<Collidable>): [Collidable, Vec2D.AbstractVector[]] | undefined {
        for (const object of objects) {
            for (const edge of object.getEdges()) {
                const d = projectVector(this.pos, edge);
                if (d.distance(edge[0]) > this.size || d.distance(edge[1]) > this.size)
                    continue;
                else if (this.pos.distance(d) > this.size)
                    continue;
                return [object, edge];
            }
        }
        return undefined;
    }
}