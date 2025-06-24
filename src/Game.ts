import * as Vec2D from "vector2d"
import {Ball} from "./gameObjects/Ball.mjs"
import {Collidable, createRectangle, getCentroid} from "./gameObjects/Collidable.mjs"
import {Paddle} from "./gameObjects/Paddle.mjs"

export class Game {

// Constructor

    constructor(
        private _map: Collidable[] = [createRectangle(
            new Vec2D.Vector(0, 0),
            new Vec2D.Vector(20, 10),
            "map"
        )],
        private _ball: Ball,
    ) {}
    private _leftTeam: Paddle[] = [];
    private _rightTeam: Paddle[] = [];
    private _allTeams: Paddle[] = [];
    private _score: number[] = [0, 0];
    private _tickRate = 1000 / 60; // 60 FPS
    private _allCollidable: Collidable[] = structuredClone(this._map);
    private _state: string = "notStarted";

// Accessors

    public get ball() {
        return this._ball;
    }

// Methods

    joinTeam(player: Paddle, team: string = "auto") {
        if (team == "left") {
            this._leftTeam.push(player);
            this._allTeams.push(player);
        }
        else if (team == "right") {
            this._rightTeam.push(player);
            this._allTeams.push(player);
        }
        else if (team == "auto") {
            if (this._leftTeam.length > this._rightTeam.length) {
                this._rightTeam.push(player);
                this._allTeams.push(player);
            } else {
                this._leftTeam.push(player);
                this._allTeams.push(player);
            }
        }
        throw new Error(`joinTeam(): invalid team option ${team}, expected: 'left' / 'right' / 'auto'`)
    }

    private joinTeamHelper(player: Paddle, team: Paddle[]) {
        team.push(player);
        this._allTeams.push(player);
    }

    start() {
        this._allCollidable.concat(this._allTeams.map((paddle: Paddle) => paddle.hitbox));
        this._ball.pos = getCentroid(this._map[0].getPoints());
        this._state = "starting";
        const loop = () => {
            const start = Date.now();

            this.update();
            if (this._state === "ended")
                return ;

            const elapsed = Date.now() - start;
            const nextTick = Math.max(0, this._tickRate - elapsed);

            setTimeout(loop, nextTick);
        };

        loop();
    }

    update() {
        this.updatePaddles();
        if (this._state == "running")
            this.updateBall();
        else if (this._state == "idling")
            this.idlingBall();
        else if (this._state == "starting")
            this.idlingBall();
    }

    private updateBall() {
        this.ball.advance();
        const ballCollision = this.ball.collide(this._allCollidable);
        if (ballCollision !== undefined) {
            // If ball collides with something else than a paddle
            if (!ballCollision[0].name.startsWith("paddle."))
            {
                if (this.hasScored(ballCollision[0], ballCollision[1]))
                    return this.onScore(ballCollision[1][0].getX() === 0 ? 0 : 1); // if x = 0 then left team scored else right team did
                this._ball.reflect(ballCollision[1]);
                return ;
            }
            // Get all paddles
            let allPaddles = structuredClone(this._leftTeam).concat(this._rightTeam);
            const playerID = ballCollision[0].name.substring(7);
            for (const paddle of allPaddles)
            {
                // Search ride paddle then collide
                if (paddle.hitbox.name !== `paddle.${playerID}`) continue;
                this._ball.paddleReflect(paddle);
                break;
            }
        }
    }

    private idlingBall() {
        return ;
    }

    private updatePaddles() {
        for (const paddle of this._allTeams) {
            if (paddle.shouldMove()) paddle.move();
        }
    }

    private hasScored(object: Collidable, edge: Vec2D.AbstractVector[]): boolean {
        if (object.name !== "map") return false;
        if (edge[0].clone().subtract(edge[1]).getX() !== 0) return false;
        return true;
    }

    private onScore(scoringTeam: number) {
        this._ball.pos = getCentroid(this._map[0].getPoints());
        this._ball.speed = 0;
        ++this._score[scoringTeam];
        if (this._score[scoringTeam] == 11)
            this._state = "ended";
        else
            this._state = "idling";
        setTimeout(() => {
            this._ball.speed = this._ball.baseSpeed;
            this._ball.dir = new Vec2D.Vector(0.5 - scoringTeam, 0);
            this._state = "running";
        }, 2.5 * 1e4);
    }
}
