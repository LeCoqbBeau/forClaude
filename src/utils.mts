import * as Vec2D from "vector2d"

export function min(x: number, y: number) {
    if (x > y)
        return y;
    return x;
}

export function max(x: number, y: number) {
    if (x > y)
        return x;
    return y;
}

export function clamp(num: number, mini: number, maxi: number) {
    return max(mini, min(num, maxi))
}

export function projectVector(p: Vec2D.AbstractVector, edge: Vec2D.AbstractVector[]) {
    // Project point P onto line AB with D, the projection
    const a = edge[0];
    const b = edge[1];
    const ab = b.clone().subtract(a);
    const ap = p.clone().subtract(a);
    return ab.mulS((ab.dot(ap)) / (ab.dot(ab)));
}