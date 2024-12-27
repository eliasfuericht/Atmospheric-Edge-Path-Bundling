import {Coordinate} from "../EdgeBundling.types.ts";

// Interpolate between two points
function interpolate(p0: Coordinate, p1: Coordinate, t: number): Coordinate {
    const oneMinusT = 1 - t; // Precompute for efficiency
    return {
        lat: oneMinusT * p0.lat + t * p1.lat,
        lng: oneMinusT * p0.lng + t * p1.lng,
    };
}

// Compute a point on a Bézier curve using De Casteljau's algorithm
function deCasteljau(t: number, controlPoints: Coordinate[]): Coordinate {
    let points = controlPoints;

    while (points.length > 1) {
        points = points.slice(0, -1).map((point, i) => interpolate(point, points[i + 1], t));
    }

    return points[0];
}

export default deCasteljau;