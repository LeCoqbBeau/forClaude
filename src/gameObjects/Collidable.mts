import * as Vec2D from "vector2d";

export class Collidable {
    constructor(
        private _pos: Vec2D.AbstractVector,
        private _points: Vec2D.AbstractVector[],
        private _name: string
    ) {};


    get pos(): Vec2D.AbstractVector {
        return this._pos;
    };

    get points(): Vec2D.AbstractVector[] {
        return this._points;
    };

    get name(): String {
        return this._name;
    }

    getPoint(i: number): Vec2D.AbstractVector {
        if (i < 0 || i >= this.points.length)
            throw new Error(`getPoint(): out of bounds (${i})`);
        return this.points[i];
    };

    getPoints(): Vec2D.AbstractVector[] {
        return this._points;
    };

    getEdge(i: number): [Vec2D.AbstractVector, Vec2D.AbstractVector] {
        if (i < 0 || i >= this.getEdges().length)
            throw new Error(`getEdge(): out of bounds (${i})`);
        return this.getEdges()[i];
    };

    getEdges(): [Vec2D.AbstractVector, Vec2D.AbstractVector][] {
        let edges: [Vec2D.AbstractVector, Vec2D.AbstractVector][] = [];
        for (let i = 1; i < this._points.length; ++i)
            edges.push([this._points[i - 1].clone(), this._points[i].clone()]);
        return edges;
    };
}

export function getCentroid(points: Vec2D.AbstractVector[]): Vec2D.AbstractVector {
    let sumX = 0
    let sumY = 0;
    for (const point of points) {
        sumX += point.x;
        sumY += point.y;
    }
    const count = points.length;
    return new Vec2D.Vector(sumX / count, sumY / count);
}


export function createRectangle(pos: Vec2D.AbstractVector, size: Vec2D.AbstractVector, name: string): Collidable {
    let points: Vec2D.AbstractVector[] = [];
    for (let i = 0; i < 4; i++)
        points.push(pos.clone());
    points[1].add(size.clone().setY(0));
    points[2].add(size.clone());
    points[3].add(size.clone().setX(0));
    return new Collidable(pos, points, name);
}
